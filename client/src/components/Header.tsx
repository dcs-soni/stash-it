import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { StashIcon } from "../icons/StashIcon";
import { useState } from "react";
import { CreateContentModal } from "../components/CreateContentModal";

export function Header() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  return (
    <div className="fixed top-0 right-0 p-4 ml-60 w-[calc(100%-240px)] bg-white z-10 border-b">
      <div className="flex items-center justify-between">
        {/* <h1 className="text-2xl font-semibold text-gray-800 justify-start">
          Dashboard
        </h1> */}
        {/* <div className="p-4 mt-16 min-h-screen bg-gray-50"> */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
        <div className="flex space-x-4">
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            variant="primary"
            startIcon={<StashIcon />}>
            Stash
          </Button>
          <Button variant="secondary" onClick={handleLogout}>
            {" "}
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
