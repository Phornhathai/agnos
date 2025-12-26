import React from "react";

type Props = {
  title?: string; // Optional page title
  children: React.ReactNode; // Inner content
};

// Summary  Container is a page wrapper that centers content and keeps a consistent layout
export default function Container({ title, children }: Readonly<Props>) {
  // Container component
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full screen height with light background */}
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        {/* Centered layout with responsive padding */}
        {title ? (
          // Render title only when provided
          <h1 className="text-xl md:text-2xl font-semibold mb-4">{title}</h1>
        ) : null}
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          {children} 
        </div>
      </div>
    </div>
  );
}
