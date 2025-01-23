import { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
}

export function SidebarItem({ text, icon }: SidebarItemProps) {
  return (
    <div className="pl-4 flex w-full text-gray-500 mb-2 hover:bg-gray-100  rounded-r-full space-x-2 ">
      <div className="p-2">{icon}</div>
      <div className="p-2 text-slate-950 font-semibold">{text}</div>
    </div>
  );
}
