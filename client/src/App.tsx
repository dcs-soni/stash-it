import { Button } from "./components/Button";
import { StashIcon } from "./icons/StashIcon";
import { ShareIcon } from "./icons/ShareIcon";
import { Card } from "./components/Card";
import { CreateContentModal } from "./components/CreateContentModal";
import { useState } from "react";

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-4">
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
        <Card
          title="Trummp"
          link="https://x.com/sfrei_/status/1881759013928591406"
          type="twitter"
        />

        <Card
          title="Youtube video"
          link="https://www.youtube.com/watch?v=FFetMn8VXE4"
          type="youtube"
        />
      </div>
    </div>
  );
}

export default App;
