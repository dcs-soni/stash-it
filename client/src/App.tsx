import { Button } from "./components/Button";
import { StashIcon } from "./icons/StashIcon";
import { ShareIcon } from "./icons/ShareIcon";
import { Card } from "./components/Card";

function App() {
  return (
    <div>
      <Button text="Stash" variant="primary" startIcon={<StashIcon />} />
      <Button text="Share" variant="secondary" startIcon={<ShareIcon />} />
      <Card />
    </div>
  );
}

export default App;
