interface ModalInputProps {
  placeholder: string;
  onChange?: () => void;
}

export function ModalInput({ placeholder, onChange }: ModalInputProps) {
  return (
    <div>
      <input
        placeholder={placeholder}
        type={"text"}
        className="px-4 py-2 m-2"
        onChange={onChange}
      />
    </div>
  );
}
