import { Button } from "../components/Button";
import { StashIcon } from "../icons/StashIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  const contents = useContent();
  return (
    <div>
      <Sidebar />
      <div className="p-4 ml-60 min-h-screen bg-gray-100 ">
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
        <div className="flex justify-end gap-4 mb-8">
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            text="Stash"
            variant="primary"
            startIcon={<StashIcon />}
          />
          <Button text="Share" variant="secondary" startIcon={<ShareIcon />} />
        </div>
        <div className="flex m-4 gap-4 font-semibold">
          {/* <Card
            title="Trummp"
            link="https://x.com/sfrei_/status/1881759013928591406"
            type="twitter"
          />

          <Card
            title="Youtube video"
            link="https://www.youtube.com/watch?v=FFetMn8VXE4"
            type="youtube"
          /> */}

          <div className="flex gap-4 flex-wrap">
            {JSON.stringify(contents)}
            {contents.map(({ type, title, link }) => (
              <Card link={link} type={type} title={title} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
