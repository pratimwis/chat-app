import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { ArrowLeft } from "lucide-react";

const SearchUsers = () => {
  const {
    allUsers,
    getAllUsers,
    isSearchingUsers,
    selectedUser,
    setSelectedUser,
    setAddUser
  } = useChatStore();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAllUsers(query);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div>
      <div className="relative p-4">
        <ArrowLeft className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 cursor-pointer
         hover:not-focus:text-indigo-700 hover:size-5 " 
         onClick={() => setAddUser(false)}
        />
        <input
          type="text"
          required
          placeholder="Search by name or email"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
      </div>

      {isSearchingUsers && <SidebarSkeleton />}
      <div className="overflow-y-auto w-full ">
        {allUsers.map((user) => (
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
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
            </div>
          </button>
        ))}

        {allUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No register user found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
