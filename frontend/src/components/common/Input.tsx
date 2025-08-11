import { ChangeEvent } from "react";
import { Input  } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const CustomInput = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  className = "",
  inputRef,
}: InputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
};

export default CustomInput;