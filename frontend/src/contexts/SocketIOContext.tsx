import { createContext, useContext, useRef, useState } from "react";
import {
	ContextProps,
	Message,
	NotificationPayload,
	SocketContextData
} from "../interfaces";
import { io, Socket } from "socket.io-client";
import useAuthContext from "./AuthContext";

export const SocketContext = createContext<SocketContextData | null>(null);
// TODO - need to handle case where tab goes idle and causes users to be offline

export const SocketProvider = ({ children }: ContextProps) => {
	const socketRef = useRef<Socket | null>(null);
	const [activeUsers, setActiveUsers] = useState<string[]>([]);
	const [receivedMessage, setReceivedMessage] = useState<Message>();
	const [userIsTyping, setUserIsTyping] = useState(false);
	const [typingUser, setTypingUser] = useState("");
	const { userData } = useAuthContext()!;
	const typingTimeout = useRef<ReturnType<typeof setInterval> | null>(null);
	const isTyping = useRef(false);
	const [typingIndicatorChatID, setTypingIndicatorChatID] = useState("");
	const [notificationData, setNotificationData] = useState<
		NotificationPayload | undefined
	>();

	const connectSocket = () => {
		if (!userData?._id) return;

		const socket = io(import.meta.env.VITE_BACKEND_BASE_URL, {
			query: { userID: userData._id }
		});

		socketRef.current = socket;

		socket.on("onlineUsers", (userIDs: string[]) => {
			setActiveUsers(userIDs);
		});

		socket.on("newMessage", (message: Message) => {
			setReceivedMessage(message);
		});

		socket.on("typingStatus", ({ chatID, typingUser, isTyping }) => {
			setTypingIndicatorChatID(chatID);
			setTypingUser(typingUser);
			setUserIsTyping(isTyping);
		});

		socket.on(
			"receiveNotification",
			(notificationPayload: NotificationPayload) => {
				setNotificationData(notificationPayload);	
			}
		);
	};

	function handleTypingIndicator(
		chatID: string,
		members: string[],
		senderUID: string | undefined
	) {
		if (!socketRef.current || !senderUID) return;

		if (!isTyping.current) {
			isTyping.current = true;
			socketRef.current.emit("typingIndicator", {
				chatID,
				members,
				senderUID,
				is_typing: true
			});
		}

		// Clear previous timeout if still typing
		if (typingTimeout.current) clearTimeout(typingTimeout.current);

		// Set timeout to emit "stopped typing" after delay
		typingTimeout.current = setTimeout(() => {
			isTyping.current = false;
			socketRef.current?.emit("typingIndicator", {
				chatID,
				members,
				senderUID,
				is_typing: false
			});
		}, 1000);
	}

	const disconnectSocket = () => {
		if (socketRef.current?.connected) socketRef.current.disconnect();
	};

	const value: SocketContextData = {
		connectSocket,
		disconnectSocket,
		activeUsers,
		receivedMessage,
		handleTypingIndicator,
		typingIndicatorChatID,
		userIsTyping,
		typingUser,
		notificationData
	};

	return (
		<SocketContext.Provider value={value}>{children}</SocketContext.Provider>
	);
};

const useSocketContext = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocketContext must be used within a <SocketProvider>");
	}
	return context;
};

export default useSocketContext;
