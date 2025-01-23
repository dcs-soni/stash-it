import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";

export function Sidebar() {
  return (
    <div className="border-r h-screen bg-white w-60 fixed p-4 ">
      <div className="flex text-4xl justify-center font-satisfy cursor-pointer text-blue-400 border-b-2 p-2">
        StashIt
      </div>

      <div className="-m-5 mt-6 text-xl justify-items-start">
        <SidebarItem
          icon={<YoutubeIcon fill="#808080" size="size-6" />}
          text="Youtube"
        />
        <SidebarItem
          icon={<XIcon fill="#808080" size="size-6" />}
          text="Twitter"
        />
      </div>
    </div>
  );
}
