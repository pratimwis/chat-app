import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { MessageSquareDiff, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import SearchUsers from "./SearchUsers";

const Sidebar = () => {
  const {
    getUsersForSidebar,
    users,
    selectedUser,
    setSelectedUser,
    getAllUsers,
    addUser,
    setAddUser,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleClick = () => {
    setAddUser(!addUser);
    getAllUsers("");
  };

  useEffect(() => {
    getUsersForSidebar();
  }, [getUsersForSidebar]);

  // In your chat or sidebar component (useEffect):
  useEffect(() => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const refreshHandler = () => getUsersForSidebar();

    socket.on("refreshSidebar", refreshHandler);

    return () => {
      socket.off("refreshSidebar", refreshHandler);
    };
  }, [getUsersForSidebar]);


  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-700" />
            <span className="font-medium text-gray-800 hidden lg:inline">
              Contacts
            </span>
          </div>
          <MessageSquareDiff
            className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110 cursor-pointer"
            onClick={handleClick}
          />
        </div>

        {/* TODO: Online filter toggle */}
        {/* <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div> */}
      </div>

      {addUser ? (
        <SearchUsers />
      ) : (
        <div className="overflow-y-auto w-full py-3">
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-xs text-zinc-400 truncate">
                  {user?.lastMessage
                    ? user.lastMessage.text
                      ? user.lastMessage.text
                      : user.lastMessage.image
                      ? "📷 Image"
                      : ""
                    : "No messages yet"}
                </div>
              </div>
            </button>
          ))}

          {users.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No online users
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
