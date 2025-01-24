interface InputProps {
  placeholder: string;
  onChange?: () => void;
}

export function Input({ placeholder, onChange }: InputProps) {
  return (
    <div>
      <input
        placeholder={placeholder}
        type={"text"}
        className="px-4 py-2 m-2 border border-gray- rounded-md"
        onChange={onChange}
      />
    </div>
  );
}
