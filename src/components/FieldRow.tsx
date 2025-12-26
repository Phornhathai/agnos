import React from "react"; 

type Props = {
  label: string; // Field label
  value?: React.ReactNode; // Field value can be text or JSX
};

// Summary  FieldRow shows a label and value in Staff View in a clean readable way
export default function FieldRow({ label, value }: Readonly<Props>) {
  // Field row component
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg border">
      <div className="text-xs text-gray-500">{label}</div> 
      <div className="text-sm font-medium text-gray-900">
        {value ?? <span className="text-gray-400">—</span>}
      </div>
    </div>
  );
}
