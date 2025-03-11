interface SearchResult {
    content: string;
    title: string;
    link: string;
    similarity: number;
  }
  
  interface SearchResultsProps {
    results: SearchResult[];
  }
  
  export function SearchResults({ results }: SearchResultsProps) {
    if (!results.length) return null;
  
    return (
      <div className="w-full max-w-3xl mx-auto mt-6 space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm
                     hover:bg-white/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-2">{result.title}</h3>
            <p className="text-white/70 mb-3">{result.content}</p>
            <div className="flex justify-between items-center">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 transition-colors">
                View Source →
              </a>
              <span className="text-sm text-white/50">
                {(result.similarity * 100).toFixed(1)}% match
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }