import { DeleteIcon } from "../icons/DeleteIcon";
import { DocumentIcon } from "../icons/DocumenIcon";
import { ShareIcon } from "../icons/ShareIcon";

export function Card() {
  return (
    <div className="p-4 bg-white-200 border border-gray-200 rounded-md max-w-72">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm">
          <div className="pr-2">
            <DocumentIcon />
          </div>
          Project Ideas
        </div>

        <div className="flex text-gray-500 items-center">
          <div className="pr-4 cursor-pointer">
            <ShareIcon />
          </div>
          <div className="cursor-pointer">
            <DeleteIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
