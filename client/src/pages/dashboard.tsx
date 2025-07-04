import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useNavigate } from "react-router-dom";
import { ShareIcon } from "@/icons/ShareIcon";
import { DocumentIcon } from "@/icons/DocumentIcon";
import { CreateContentModal } from "@/components/CreateContentModal";
import { DeleteIcon } from "@/icons/DeleteIcon";

import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";

interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
}

export default function Dashboard() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shareHash, setShareHash] = useState<string | null>(null);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAnswer, setSearchAnswer] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/search`,
        { query },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setSearchResults(response.data.results);
      setSearchAnswer(response.data.answer);

  
    } catch (error: any) {
      if (
        
        error.response.status === 429 
    
     
      ) {
        alert(error.response.data.message);
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong during search.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    fetchContents();
  }, []);

  async function fetchContents() {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setContents(response.data.content);
      setFilteredContent(response.data.content);
    } catch (error) {
      console.error("Error fetching contents:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/stash`,
        { share: true },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setShareHash(response.data.hash);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }

  function handleSignOut() {
    localStorage.removeItem("token");
    navigate("/signin");
  }

  async function handleDelete(contentId: string) {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/delete/${contentId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      setContents((prevContents) =>
        prevContents.filter((content) => content._id !== contentId)
      );
    } catch (err) {
      console.error("Error deleting content", err);
    }

    window.location.reload();
  }

  function filterCategory(type: string) {
    setFilteredContent(() =>
      contents.filter((content) => content.type === type)
    );
  }

  function resetFilter() {
    setFilteredContent(contents);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-brand-900 to-gray-900">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center h-1">
            <h1 className="text-2xl font-anta bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent">
              Stash It
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium 
                          hover:bg-white/20 transition-all duration-300 border border-white/20
                          hover:scale-105 hover:shadow-lg hover:shadow-brand-500/20">
                + Stash here
              </button>
              <button
                onClick={handleSignOut}
                className="text-white/80 hover:text-white transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="m-8">
        <SearchBar onSearch={handleSearch} isSearching={isSearching} />
      </div>

      {errorMessage && (
  <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
    {errorMessage}
  </div>
)}

      {searchAnswer && (
        <div className="w-full max-w-3xl mx-auto mb-8">
          <div className="p-6 rounded-xl bg-brand-500/20 border border-brand-400/30 backdrop-blur-sm">
            <p className="text-white text-lg">{searchAnswer}</p>
          </div>
        </div>
      )}

      <SearchResults results={searchResults} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Share Your Stash
              </h2>
              <p className="text-white/70">
                Generate a unique link to share your stashes with others
              </p>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-brand-500/20 text-white px-6 py-3 rounded-full
                        hover:bg-brand-500/30 transition-all duration-300 border border-brand-400/30
                        hover:scale-105 hover:shadow-lg hover:shadow-brand-500/20">
              <ShareIcon />
              <span>Share</span>
            </button>
          </div>
          {shareHash && (
            <div className="mt-4 p-4 bg-brand-500/10 rounded-xl border border-brand-400/30">
              <p className="text-brand-200 font-medium">
                Share Link: {window.location.origin}/stash/{shareHash}
              </p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Your Content</h2>
            <div className="flex space-x-4">
              <button
                onClick={resetFilter}
                className="text-white/70 hover:text-white transition-colors">
                All
              </button>
              <button
                onClick={() => filterCategory("youtube")}
                className="text-white/70 hover:text-white transition-colors">
                Youtube
              </button>
              <button
                onClick={() => filterCategory("twitter")}
                className="text-white/70 hover:text-white transition-colors">
                Twitter
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-500/20 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-brand-400 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : contents.length === 0 ? (
            <div className="backdrop-blur-md bg-white/5 rounded-2xl p-12 text-center border border-white/10">
              <div className="w-16 h-16 mx-auto mb-6 text-brand-400">
                <DocumentIcon />
              </div>
              <p className="text-white/70 text-lg">
                Your stash is empty. Click "Stash here" to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((content) => (
                <div
                  key={content._id}
                  className="group backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10
                         hover:bg-white/10 transition-all duration-300 hover:scale-105
                         hover:shadow-xl hover:shadow-brand-500/10">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-brand-500/20 text-brand-200 mb-4">
                        {content.type}
                      </span>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {content.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-4 w-full">
                      {/* View Content Link */}
                      <a
                        href={content.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-brand-300 hover:text-brand-200 
                            transition-colors group-hover:translate-x-2 duration-300">
                        <span>View Content</span>
                        <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </a>

                      <button
                        onClick={() => handleDelete(content._id)}
                        className="text-red-500 hover:text-red-400 transition-colors">
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateContentModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
