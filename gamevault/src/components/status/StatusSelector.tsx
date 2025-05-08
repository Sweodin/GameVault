import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";

// Define status options that can be used across the application
export const statusOptions = [
  { name: "Online", color: "bg-green-500" },
  { name: "Away", color: "bg-yellow-500" },
  { name: "Busy", color: "bg-red-500" },
  { name: "Invisible", color: "bg-gray-500" },
];

// Helper function to get status color
export const getStatusColor = (status: string | null) => {
  const statusOption = statusOptions.find((s) => s.name === status);
  return statusOption ? statusOption.color : "bg-gray-500";
};

interface StatusSelectorProps {
  variant?: "dropdown" | "buttons";
  onStatusChange?: () => void; // Optional callback for when status changes
}

export default function StatusSelector({
  variant = "dropdown",
  onStatusChange,
}: StatusSelectorProps) {
  const { userStatus, updateUserStatus, currentUser } = useAuth();
  const { onlineUsers } = useChat();

  const handleStatusChange = (status: string) => {
    // If selecting Online, we'll use the real online status from Firebase
    // For other statuses, we'll use the user-selected status
    updateUserStatus(status);
    if (onStatusChange) {
      onStatusChange();
    }
  };

  if (variant === "buttons") {
    return (
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status.name}
            type="button"
            onClick={() => handleStatusChange(status.name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
              (status.name === "Online" &&
                currentUser &&
                onlineUsers[currentUser.uid]) ||
              (status.name !== "Online" && status.name === userStatus)
                ? "bg-gray-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                status.name === "Online" &&
                currentUser &&
                onlineUsers[currentUser.uid]
                  ? "bg-green-500"
                  : status.color
              }`}
            ></span>
            {status.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {statusOptions.map((status) => (
        <div
          key={status.name}
          className={`flex items-center px-4 py-2 rounded-md cursor-pointer ${
            (status.name === "Online" &&
              currentUser &&
              onlineUsers[currentUser.uid]) ||
            (status.name !== "Online" && status.name === userStatus)
              ? "bg-gray-700"
              : "hover:bg-gray-700"
          }`}
          onClick={() => handleStatusChange(status.name)}
        >
          <span
            className={`w-3 h-3 rounded-full ${
              status.name === "Online" &&
              currentUser &&
              onlineUsers[currentUser.uid]
                ? "bg-green-500"
                : status.color
            } mr-3`}
          ></span>
          <span className="text-sm">{status.name}</span>
        </div>
      ))}
    </div>
  );
}
