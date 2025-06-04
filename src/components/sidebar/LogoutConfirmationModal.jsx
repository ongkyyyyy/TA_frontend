/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function LogoutConfirmationModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative bg-white text-black w-full max-w-md p-6 rounded-xl shadow-lg">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-4">
          <h2 className="text-xl font-semibold">Confirm Logout</h2>
          <p className="text-gray-600">
            Are you sure you want to log out? You’ll need to log in again to access your dashboard.
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmationModal;
