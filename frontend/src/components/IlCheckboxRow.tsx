import type { ReactNode } from "react";

interface IlCheckboxRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

export function IlCheckboxRow({ checked, onChange, children }: IlCheckboxRowProps) {
  return (
    <label className="flex cursor-pointer items-start">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 shrink-0 rounded border-il-neutral-60 accent-il-blue-40"
        />
      </span>
      <span className="min-w-0 flex-1 self-center py-3 text-xs leading-4 text-il-neutral-10">
        {children}
      </span>
    </label>
  );
}
