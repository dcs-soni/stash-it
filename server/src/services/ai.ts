import { ChromaClient, Collection } from "chromadb";

const chromaClient = new ChromaClient({
  path: process.env.CHROMA_API_URL,
});


let collection: Collection;
let embedder: any;
let textGenerator: any;

// Helper to dynamically import Xenova's pipeline function
async function getPipeline() {
  const transformers = await import("@xenova/transformers");
  return transformers.pipeline;
}

async function getEmbedder() {
  if (!embedder) {
    const pipeline = await getPipeline();
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

async function getTextGenerator() {
  if (!textGenerator) {
    const pipeline = await getPipeline();
    textGenerator = await pipeline("text-generation", "Xenova/gpt2");
  }
  return textGenerator;
}

// Create a custom embedding function that matches ChromaDB's IEmbeddingFunction interface
class CustomEmbeddingFunction {
  async generate(texts: string[]): Promise<number[][]> {
    const embedder = await getEmbedder();
    const embeddings: number[][] = [];

    for (const text of texts) {
      const output = await embedder(text, { pooling: "mean", normalize: true });
      embeddings.push(Array.from(output.data) as number[]);
    }

    return embeddings;
  }
}   

export async function initAI() {
  const collectionName = "stashit_content";

   // Create custom embedding function
   const embeddingFunction = new CustomEmbeddingFunction();



   try {
    // Try to get the collection (assuming it may exist)
    collection = await chromaClient.getCollection({
      name: collectionName,
      embeddingFunction,
    });

    console.log(`✅ Collection '${collectionName}' fetched successfully.`);

  } catch (getError: any) {
    console.warn(`⚠️ Collection '${collectionName}' not found. Attempting to create it...`);

    try {
      // If not found, create it
      collection = await chromaClient.createCollection({
        name: collectionName,
        embeddingFunction,
        metadata: { "hnsw:space": "cosine" },
      });

      console.log(`✅ Collection '${collectionName}' created.`);

    } catch (createError: any) {
      if (
        createError?.message?.includes("already exists") ||
        createError?.name === "ChromaUniqueError"
      ) {
        // If it still throws "already exists" due to race condition, fallback to get
        console.warn(`⚠️ Collection '${collectionName}' already exists. Getting it instead...`);

        collection = await chromaClient.getCollection({
          name: collectionName,
          embeddingFunction,
        });
      } else {
        console.error("❌ Failed to initialize Chroma collection:", createError);
        throw createError; // Let the caller handle this fatal error
      }
    }
  }
  

  // // Load the embedding model
  // embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  embedder = await getEmbedder();


  // // Load the text generation model
  // textGenerator = await pipeline("text-generation", "Xenova/gpt2");

  textGenerator = await getTextGenerator();
  
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // const output = await embedder(text, {
    //   pooling: "mean",
    //   normalize: true,
    // });

    const embedder = await getEmbedder();
    const output = await embedder(text, { pooling: "mean", normalize: true });

    // Extract the actual embedding array from the model output
    // The exact structure may vary depending on the model and transformer version
    const embedding = Array.from(output.data) as number[];
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

export async function addContentToVectorDB(
  id: string,
  content: string,
  metadata: any
) {
  try {
    if (!collection) {
      await initAI();
    }

    console.log(`Adding content to vector DB: ${id}`);

    // Log metadata for debugging
    console.log(`Metadata for ${id}:`, JSON.stringify(metadata));

    // Ensure userId is included in metadata
    if (!metadata.userId) {
      console.warn("Warning: Adding content without userId in metadata");
    }

    // Generate embedding for the content
    const embedding = await generateEmbedding(content);

    // Add the document to ChromaDB
    await collection.add({
      ids: [id],
      embeddings: [embedding],
      documents: [content],
      metadatas: [metadata],
    });

    console.log(`Successfully added content with ID: ${id}`);
    return true;
  } catch (error) {
    console.error("Error adding content to vector DB:", error);
    throw error;
  }
}

export async function removeFromVectorDB(id: string): Promise<boolean> {
  try {
    if (!collection) {
      await initAI();
    }

    console.log(`Removing content from vector DB: ${id}`);

    // Delete the document from ChromaDB
    await collection.delete({
      ids: [id],
    });

    console.log(`Successfully removed content with ID: ${id}`);
    return true;
  } catch (error) {
    console.error("Error removing content from vector DB:", error);
    // Just return false or throw, but don't send an HTTP response
    return false;
  }
}

export async function searchContent(query: string, userId: string) {
  try {
    if (!collection) {
      // Initialize if not already done
      await initAI();
    }

    console.log(`Searching for query: "${query}" for userId: ${userId}`);

    // Get all content to verify what's in the database
    const all = await collection.get();
    console.log(`Collection has ${all.ids.length} documents total`);

    // Log sample metadata to check structure
    if (all.metadatas && all.metadatas.length > 0) {
      console.log(
        "Sample metadata:",
        JSON.stringify(all.metadatas.slice(0, 3))
      );
    }

    // First try a search without user filtering to check if results exist
    const resultsNoFilter = await collection.query({
      queryTexts: [query],
      nResults: 10,
    });

    console.log(
      `Search without filtering found ${
        resultsNoFilter.documents?.[0]?.length || 0
      } results`
    );

    // Then try with userId filter
    const results = await collection.query({
      queryTexts: [query],
      nResults: 10,
      where: { userId: userId },
    });

    console.log(
      `Search with userId filter found ${
        results.documents?.[0]?.length || 0
      } results for user ${userId}`
    );

    // Check if we have any results
    if (
      !results.documents ||
      !results.documents[0] ||
      results.documents[0].length === 0
    ) {
      return {
        answer:
          "I don't have any stashes that match your query yet. Try adding some content first!",
        results: [],
      };
    }

    // Continue with processing results
    const docs = results.documents[0];
    const context = docs.join("\n");

    // Generate a response based on the results
    let answer;
    try {
      //

      const generator = await getTextGenerator();

      const generated = await generator(
        `Based on your stashed content: ${context}\n\n ${query}\nAnswer:`,
        {
          max_length: 150,
          temperature: 0.7,
        }
      );

      answer = generated[0].generated_text;

      // Clean up the answer to remove the prompt
      answer =
        answer.split("Answer:").pop()?.trim() ||
        "Here's what I found in your stashes: " + docs[0];
    } catch (error) {
      console.error("Text generation error:", error);
      answer = `I found these related stashes: ${docs
        .map((d) => `"${d}"`)
        .join(", ")}`;
    }

    // Format results for the client
    const formattedResults = results.documents[0].map((doc, i) => {
      const metadata = results.metadatas?.[0]?.[i] || {};
      return {
        content: doc,
        title: metadata.title || "Untitled",
        link: metadata.link || "",
        similarity: 1 - (results.distances?.[0]?.[i] || 0),
      };
    });

    // Sort by similarity and get only the top result
    const sortedResults = formattedResults.sort(
      (a, b) => b.similarity - a.similarity
    );
    const bestMatch = sortedResults[0];

    // If we have a result with good similarity (above 0.5 or 50%)
    if (bestMatch && bestMatch.similarity > 0.5) {
      return {
        answer: `I found this most relevant stash: "${
          bestMatch.title
        }" (${Math.round(bestMatch.similarity * 100)}% match)`,
        results: [bestMatch],
      };
    } else {
      return {
        answer:
          "I couldn't find any highly relevant stashes matching your query.",
        results: [],
      };
    }
  } catch (error) {
    console.error("Search error:", error);
    return {
      answer: "Sorry, I encountered an error while searching your stashes.",
      results: [],
    };
  }
}
