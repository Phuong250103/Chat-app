import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const [expandedFiles, setExpandedFiles] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  } 
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col relative">
              {message.image && (
                <img
                src={message.image}
                alt="Attachment"
                className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
              {message.file && (
                <div className="mt-2 p-2 bg-base-200 rounded-md border border-zinc-600">
                    <button
                      className="font-semibold text-sm mb-1 flex items-center gap-1 hover:underline"
                      onClick={() =>
                        setExpandedFiles((prev) =>
                          prev.includes(message._id)
                      ? prev.filter((id) => id !== message._id)
                      : [...prev, message._id]
                    )
                  }
                  >
                      📄 {message.file.name}
                    </button>

                    {expandedFiles.includes(message._id) && (
                      <pre className="mt-2 text-sm whitespace-pre-wrap bg-zinc-900 p-3 rounded">
                        {message.file.content}
                      </pre>
                    )}
                  </div>
                )}
              {message.senderId === authUser._id && (
                <div className="absolute -left-6 top-[65%] transform -translate-y-1/2">
                  <button
                    onClick={() =>
                      setSelectedMessageId((prev) => (prev === message._id ? null : message._id))
                    }
                    className="text-xs text-gray-400 hover:text-white ml-2 mt-1"
                  >
                    ...
                  </button>

                  {selectedMessageId === message._id && (
                    <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 border rounded shadow p-1 z-10">
                      <button
                        onClick={() => {
                          deleteMessage(message._id);
                          setSelectedMessageId(null);
                        }}
                        className="text-sm text-red-500 hover:underline px-2 py-1"
                      >
                        Xoá
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>           
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;