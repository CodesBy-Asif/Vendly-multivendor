import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../../Data"; // define these separately
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const InboxPage = ({ userType }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  // socket state
  const [socket, setSocket] = useState(null);

  // init socket connection
  useEffect(() => {
    if (!user && !seller) return;

    const s = io("https://vendly-multivendor.onrender.com/", {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Connected to socket:", s.id);
    });

    s.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });

    return () => {
      s.disconnect();
    };
  }, [user, seller]);

  // fetch conversations
  useEffect(() => {
    if (!user && !seller) return;
    const fetchConversations = async () => {
      try {
        const url =
          userType === "seller"
            ? `${server}/conversation/get-all-conversation-seller/${seller._id}`
            : `${server}/conversation/get-all-conversation-user/${user._id}`;

        const { data } = await axios.get(url, { withCredentials: true });
        if (data.success) {
          setConversations(data.conversations);
          if (data.conversations.length > 0) {
            setSelectedConversation(data.conversations[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userType, user, seller]);

  // fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data } = await axios.get(
          `${server}/messages/get-all-messages/${selectedConversation._id}`,
          { withCredentials: true }
        );
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    // join socket room for this conversation
    if (socket) {
      socket.emit("join-conversation", selectedConversation._id);
    }
  }, [selectedConversation, socket]);

  // listen for socket messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (selectedConversation && msg.conversationId === selectedConversation._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket, selectedConversation]);

  // send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messagePayload = {
      conversationId: selectedConversation._id,
      sender: userType === "seller" ? seller._id : user._id,
      text: newMessage.trim(),
    };

    try {
      const { data } = await axios.post(
        `${server}/messages/create-new-message`,
        messagePayload,
        { withCredentials: true }
      );

      if (data.success) {
        setNewMessage("");

        if (socket) {
          socket.emit("message", data.message);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-[95dvh] rounded-3xl overflow-hidden bg-accent flex">
      {/* Left Sidebar - Conversations List */}
      <div className="w-1/3 bg-accent border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-gray-900">
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Inbox
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {conversations.length} conversation
            {conversations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 cursor-pointer hover:bg-background transition-colors ${
                    selectedConversation?._id === conv._id
                      ? "bg-blue-50 border-r-2 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>
                        {" "}
                        {conv.members[1].memberModel ==
                        (userType === "seller" ? "Shop" : "User")
                          ? conv.members[0].memberId.full_name[0]
                          : conv.members[1].memberId.shopName[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conv.members[1].memberModel ==
                        (userType === "seller" ? "Shop" : "User")
                          ? conv.members[0].memberId.full_name
                          : conv.members[1].memberId.shopName}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-accent border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedConversation.members[1].memberModel ==
                    (userType === "seller" ? "Shop" : "User")
                      ? selectedConversation.members[0].memberId.full_name
                      : selectedConversation.members[1].memberId.shopName}
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-background p-6 overflow-y-auto">
              {loadingMessages ? (
                <p>Loading messages...</p>
              ) : messages.length === 0 ? (
                <div className="flex-1 bg-background p-6 overflow-y-auto">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      {selectedConversation.lastMessage ||
                        "Start the conversation by sending a message"}
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`mb-2 max-w-xs rounded-lg p-2 ${
                      msg.sender ===
                      (userType === "seller" ? seller._id : user._id)
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>

            {/* Messages Area */}

            {/* Message Input */}
            <div className="p-4 bg-accent border-t border-border">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  className="px-6 py-2 bg-blue-600 text-accent rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleSendMessage}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
