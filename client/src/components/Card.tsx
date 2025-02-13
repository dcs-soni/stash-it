import { DeleteIcon } from "../icons/DeleteIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

interface CardProps {
  title: string;
  link: string;
  type: "youtube" | "twitter";
}

export function Card({ title, link, type }: CardProps) {
  return (
    <div className="p-4 bg-white-200 border border-gray-200 shadow-md rounded-md max-w-72 max-h-96 group">
      <div className="flex justify-between items-center border-b-2 pb-2 border-black-100 ">
        <div className="flex items-center text-sm">
          <div className="pr-2">
            {type === "youtube" && <YoutubeIcon fill="#FF0000" size="size-5" />}
            {type === "twitter" && <XIcon fill="#000" size="size-4" />}
          </div>
          <div className="text-slate-950">{title}</div>
        </div>

        <div className="flex text-gray-500 items-center">
          <div className="pr-4 cursor-pointer opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 translate-all duration-300">
            <a target="_blank">
              <ShareIcon />
            </a>
          </div>
          <div className="cursor-pointer">
            <DeleteIcon />
          </div>
        </div>
      </div>

      <div className="pt-4 cursor-pointer">
        {type === "youtube" && (
          <iframe
            className="w-full my-2"
            src={link.replace("watch", "embed").replace("?v=", "/")}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen></iframe>
        )}

        {type === "twitter" && (
          <blockquote className=" twitter-tweet">
            <a href={link.replace("x.com", "twitter.com")}></a>
          </blockquote>
        )}
      </div>
    </div>
  );
}
