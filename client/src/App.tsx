import { Button } from "./components/Button";
import { PlusIcon } from "./icons/PlusIcon";
import { ShareIcon } from "./icons/ShareIcon";

function App() {
  return (
    <div className="bg-red-100">
      <Button text="Stash It" variant="primary" startIcon={<PlusIcon />} />
      <Button text="Share" variant="secondary" startIcon={<ShareIcon />} />
    </div>
  );
}

export default App;
