import { useState, useRef } from "react";
import { CrossIcon } from "@/icons/CrossIcon";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);

  async function addContent() {
    const title = titleRef.current?.value;
    let link = linkRef.current?.value;

    if(!link?.startsWith("https://") && !link?.startsWith("http://")) {
      link = `https://${link}`
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        {
          link,
          title,
          type,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error adding content:", error);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-brand-900 p-6 text-left shadow-xl transition-all border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Add New Content</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors">
            <CrossIcon />
          </button>
        </div>


        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setType(ContentType.Youtube)}
            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
              type === ContentType.Youtube
                ? "bg-brand-500/30 border-brand-400/50 border text-white"
                : "bg-white/5 border-white/10 border text-white/70 hover:bg-white/10"
            }`}>
            YouTube
          </button>
          <button
            onClick={() => setType(ContentType.Twitter)}
            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
              type === ContentType.Twitter
                ? "bg-brand-500/30 border-brand-400/50 border text-white"
                : "bg-white/5 border-white/10 border text-white/70 hover:bg-white/10"
            }`}>
            Twitter
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <input
              ref={titleRef}
              placeholder="Title"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white 
                       placeholder-white/50 focus:border-brand-400/50 focus:outline-none focus:ring-0
                       transition-all duration-300"
            />
          </div>
          <div>
            <input
              ref={linkRef}
              placeholder="Link"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white 
                       placeholder-white/50 focus:border-brand-400/50 focus:outline-none focus:ring-0
                       transition-all duration-300"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 
                     hover:bg-white/10 transition-all duration-300">
            Cancel
          </button>
          <button
            onClick={addContent}
            className="px-6 py-2 rounded-xl bg-brand-500/20 text-white border border-brand-400/30
                     hover:bg-brand-500/30 transition-all duration-300 hover:scale-105
                     hover:shadow-lg hover:shadow-brand-500/20">
            Add Content
          </button>
        </div>
      </div>
    </div>
  );
}