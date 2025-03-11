import { HfInference } from "@huggingface/inference";
import { ChromaClient, Collection, OpenAIEmbeddingFunction } from "chromadb";
import { pipeline } from "@xenova/transformers";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const chromaClient = new ChromaClient();
let collection: Collection;
let embedder: any;
let textGenerator: any;

// Create a custom embedding function that matches ChromaDB's IEmbeddingFunction interface
class CustomEmbeddingFunction {
  async generate(texts: string[]): Promise<number[][]> {
    const embeddings = [];
    for (const text of texts) {
      const embedding = await generateEmbedding(text);
      embeddings.push(embedding);
    }
    return embeddings;
  }
}

export async function initAI() {
  const collectionName = "stashit_content";
  const existingCollections = await chromaClient.listCollections();
  const collectionExists = existingCollections.some((col: any) => col.name === collectionName);
  
  // Create custom embedding function
  const embeddingFunction = new CustomEmbeddingFunction();
  
  // Initialize ChromaDB collection
  if (!collectionExists) {
    // Create the collection if it does not exist
    collection = await chromaClient.getOrCreateCollection({
      name: collectionName,
      embeddingFunction: new CustomEmbeddingFunction(),
      metadata: { "hnsw:space": "cosine" }
    });
    console.log(`Collection '${collectionName}' created.`);
  } else {
    collection = await chromaClient.getCollection({ 
      name: collectionName,
      embeddingFunction
    });
    console.log(`Collection '${collectionName}' already exists.`);
  }
  
  // Load the embedding model
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  // Load the text generation model
  textGenerator = await pipeline('text-generation', 'Xenova/gpt2');
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const output = await embedder(text, {
      pooling: 'mean',
      normalize: true,
    });
    
    // Extract the actual embedding array from the model output
    // The exact structure may vary depending on the model and transformer version
    const embedding = Array.from(output.data) as number[];
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

export async function addContentToVectorDB(id: string, content: string, metadata: any) {
  try {
    if (!collection) {
      await initAI();
    }
    
    console.log(`Adding content to vector DB: ${id}`);
    
    // Generate embedding for the content
    const embedding = await generateEmbedding(content);
    
    // Add the document to ChromaDB
    await collection.add({
      ids: [id],
      embeddings: [embedding],
      documents: [content],
      metadatas: [metadata]
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
      ids: [id]
    });
    
    console.log(`Successfully removed content with ID: ${id}`);
    return true;
  } catch (error) {
    console.error("Error removing content from vector DB:", error);
    // Just return false or throw, but don't send an HTTP response
    return false;
  }
}


export async function searchContent(query: string) {
  try {
    if (!collection) {
      // Initialize if not already done
      await initAI();
    }
    
    console.log("Searching for query:", query);
    
    // Get all content to make sure we have data
    const all = await collection.get();
    console.log(`Collection has ${all.ids.length} documents`);
    
    // Perform the search
    const results = await collection.query({
      queryTexts: [query],
      nResults: 5
    });
    
    console.log("Search results:", JSON.stringify(results, null, 2));

    if (!results.documents || !results.documents[0] || results.documents[0].length === 0) {
      return {
        answer: "I don't have any stashes that match your query yet. Try adding some content first!",
        results: []
      };
    }
    
    // Extract the documents for response generation
    const docs = results.documents[0];
    const context = docs.join('\n');
    
    // Generate a response based on the results
    let answer;
    try {
      const generated = await textGenerator(`Based on your stashed content: ${context}\n\nQuestion: ${query}\nAnswer:`, {
        max_length: 150,
        temperature: 0.7,
      });
      answer = generated[0].generated_text;
      
      // Clean up the answer to remove the prompt
      answer = answer.split('Answer:').pop()?.trim() || 
               "Here's what I found in your stashes: " + docs[0];
    } catch (error) {
      console.error("Text generation error:", error);
      answer = `I found these related stashes: ${docs.map(d => `"${d}"`).join(', ')}`;
    }
    
    // Return both the generated answer and the raw results
    return {
      answer,
      results: results.metadatas[0].map((meta, i) => ({
        content: docs[i],
        similarity: results.distances ? results.distances[0][i] : null,
        ...meta
      }))
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      answer: "Sorry, I encountered an error while searching your stashes.",
      results: []
    };
  }
}
