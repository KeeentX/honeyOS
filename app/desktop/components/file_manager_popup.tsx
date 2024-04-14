import React, { useState } from "react";

type SaveHandler = (name: string) => void;
type CancelHandler = () => void;

interface NewFilePopupProps {
  onSave: SaveHandler;
  onCancel: CancelHandler;
  fileType?: string; // Added fileType prop
}

export default function NewFilePopup({ onSave, onCancel, fileType }: NewFilePopupProps) {
  const [name, setName] = useState("");
  const [selectedFileType, setSelectedFileType] = useState(fileType || ""); // Initialize with fileType if provided


  const handleSave = () => {
    const fileName = selectedFileType === "folder" ? name : (selectedFileType === "file" ? `${name}.txt` : `${name}${selectedFileType}`);
    onSave(fileName);
    setName("");
    setSelectedFileType(""); // Reset selectedFileType after saving
  };

  const setFileType = (value: string) => {
    setSelectedFileType(value);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2 bg-inherit"
          placeholder={`Enter ${fileType === "folder" ? "folder" : "file"} name`}
        />
        {/* Render additional options for file type if fileType is specified */}
        {fileType === "file" && (
          <div>
            <label className="block mb-1">Choose file type:
              {/* Removed value={fileType} */}
              <select onChange={(e) => setFileType(e.target.value)} className="border p-2 bg-inherit">
                <option value=".txt">.txt(Text File)</option>
                <option value=".png">.png(PNG Image)</option>
                <option value=".jpg">.jpg(JPEG Image)</option>
              </select>
            </label>
          </div>
        )}
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
