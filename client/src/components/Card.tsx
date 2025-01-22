import { DeleteIcon } from "../icons/DeleteIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { XIcon } from "../icons/xIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
// import { Tweet } from "react-tweet";

interface CardProps {
  title: string;
  link: string;
  type: "youtube" | "twitter";
}

export function Card({ title, link, type }: CardProps) {
  return (
    <div className="p-4 bg-white-200 border border-gray-200 rounded-md max-w-72 max-h-96">
      <div className="flex justify-between items-center border-b-2 pb-2 border-gray-100">
        <div className="flex items-center text-sm">
          <div className="pr-2">
            {type === "youtube" && <YoutubeIcon />}
            {type === "twitter" && <XIcon />}
          </div>
          <div>{title}</div>
        </div>

        <div className="flex text-gray-500 items-center">
          <div className="pr-4 cursor-pointer">
            <a href={link} target="_blank">
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
      {/*  */}
      {/* <div className="overflow-scroll max-h-60">
        <Tweet id="1881741968507838861" />
      </div> */}
    </div>
  );
}
