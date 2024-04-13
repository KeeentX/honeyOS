import React, { useState } from "react";

type SaveHandler = (name: string) => void;
type CancelHandler = () => void;

interface NewFilePopupProps {
  onSave: SaveHandler;
  onCancel: CancelHandler;
}

export default function NewFilePopup({ onSave, onCancel }: NewFilePopupProps) {
  const [name, setName] = useState("");

  const handleSave = () => {
    onSave(name);
    setName("");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2 bg-inherit"
          placeholder="Enter name"
        />
        <div className="flex justify-end">
          <button className="p-2 border mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="p-2 border" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
