import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function Signup() {
  return (
    <div className="h-screen w-screen bg-gray-100  border min-w-48 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-8">
        <Input placeholder="Username" />
        <Input placeholder="Paassword" />
        <div className="flex justify-center p-2 w-full">
          <Button
            variant="primary"
            text="Signup"
            fullWidth={true}
            loading={true}
          />
        </div>
      </div>
    </div>
  );
}
