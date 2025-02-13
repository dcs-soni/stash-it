import { useState, useRef } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
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
  const titleRef = useRef<HTMLInputElement>();
  const linkRef = useRef<HTMLInputElement>();
  const [type, setType] = useState(ContentType.Youtube);

  function refreshPage() {
    window.location.reload();
  }

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

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
    refreshPage();
  }

  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-slate-400 fixed top-0 left-0 opacity-90 flex justify-center z-10">
          <div className="flex flex-col justify-center">
            <span className="bg-white opacity-100 p-4 rounded-md flex flex-col justify-center">
              <div onClick={onClose} className="flex justify-end">
                <CrossIcon />
              </div>
              <div>
                <Input reference={titleRef} placeholder={"Title"} />
                <Input reference={linkRef} placeholder={"Link"} />
              </div>
              <div className="flex gap-1 p-4">
                <Button
                  text="Youtube"
                  variant={
                    type === ContentType.Youtube ? "primary" : "secondary"
                  }
                  onClick={() => {
                    setType(ContentType.Youtube);
                  }}
                />

                <Button
                  text="Twitter"
                  variant={
                    type === ContentType.Twitter ? "primary" : "secondary"
                  }
                  onClick={() => {
                    setType(ContentType.Twitter);
                  }}
                />
              </div>
              <Button onClick={addContent} variant="primary" text="Submit" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
