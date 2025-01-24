import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-slate-200 fixed top-0 left-0 opacity-90 flex justify-center">
          <div className="flex flex-col justify-center">
            <span className="bg-white opacity-100 p-4 rounded-md flex flex-col justify-center">
              <div onClick={onClose} className="flex justify-end">
                <CrossIcon />
              </div>
              <div>
                <Input placeholder={"Title"} />
                <Input placeholder={"Link"} />
              </div>
              <Button variant="primary" text="Submit" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
