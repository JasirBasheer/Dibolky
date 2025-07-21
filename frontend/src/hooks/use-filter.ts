import { useEffect, useState } from "react";

export const useFilter = <T extends object>(
  value: T,
  delay: number,
  onChange?: (val: T) => void
): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue({ ...value });
      onChange?.(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, onChange]);

  return debouncedValue;
};
