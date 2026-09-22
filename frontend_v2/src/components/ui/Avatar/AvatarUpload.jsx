import React from "react";
import { AlertCircle, Camera, User, X } from "lucide-react";
import { useAvatarUpload } from "@/context/StudentContext";

const AvatarUpload = ({ onChange, initialSrc = null, hint = null }) => {
  const {
    preview,
    isDragging,
    error,
    inputRef,
    handleInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    triggerPick,
  } = useAvatarUpload({ onChange, initialSrc });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative inline-block">
        <div
          onClick={triggerPick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") triggerPick();
          }}
          aria-label="Upload profile photo"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "profileAvatarError" : undefined}
          className={`group relative w-28 h-28 rounded-full cursor-pointer
          flex items-center justify-center overflow-hidden
          transition-all duration-200
          ${
            error ? "ring-2 ring-red-500 ring-offset-2"
            : isDragging ? "ring-2 ring-blue-500 ring-offset-2"
            : "ring-1 ring-gray-300 hover:ring-gray-400"
          }
          ${!preview ? "bg-gray-50" : "bg-gray-100"}`}>
          {preview ?
            <img
              src={preview}
              className=""
              id="profileAvatar"
              alt="Profile avatar preview"
            />
          : <User className="w-10 h-10 text-gray-300" strokeWidth={1.5} />}

          {/* Hover / focus overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-1
            bg-black/50 opacity-0 group-hover:opacity-100
            transition-opacity duration-200">
            <Camera className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
        </div>

        {/* Error badge — sits on the icon so the failure is visible even
            when the hint below is off-screen in a scrolled modal. */}
        {error && (
          <span
            aria-hidden="true"
            className="absolute top-0 right-0 w-6 h-6 rounded-full bg-white
              shadow-md flex items-center justify-center text-red-600">
            <AlertCircle className="w-4 h-4" strokeWidth={2} />
          </span>
        )}

        {/* Remove button */}
        {preview && !error && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove photo"
            className="absolute top-0 right-0 w-6 h-6 rounded-full bg-white
              shadow-md flex items-center justify-center
              text-gray-500 hover:text-gray-800 hover:bg-gray-50
              transition-colors">
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name="profile-avatar"
        id="profileAvatarInput"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={triggerPick}
        className="text-sm font-medium text-blue-600 hover:text-blue-700
          transition-colors">
        {/* {preview ? "Change photo" : "Upload photo"} */}
      </button>

      {/* The hint doubles as the error slot: callers that pass a hint get it
          swapped for the failure, callers that don't still see the error. */}
      {(error || hint) && (
        <p
          id={error ? "profileAvatarError" : undefined}
          role={error ? "alert" : undefined}
          className={`field-hint${error ? " field-hint--error" : ""}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
};

export default AvatarUpload;
