import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserData, UserTagData, DMTools, Message } from "../../../src/interfaces";
import axios from "axios";
import useAuthContext from "../../contexts/AuthContext";
import useSocketContext from "../../contexts/SocketIOContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useDM(): DMTools {
	const queryClient = useQueryClient();
	const { userData } = useAuthContext()!;
	const convoID: string = window.location.pathname.split("/")[3];
	const { receivedMessage } = useSocketContext()!;
	const navigate = useNavigate();

	const { data: conversations = [] } = useQuery({
		queryKey: ["conversations"],
		queryFn: async () => {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/messages/conversations`,
				{ withCredentials: true }
			);
			return response.data || [];
		}
	});

	const { mutate } = useMutation({
		mutationFn: async ({
			searchedUsers,
			groupChatName
		}: {
			searchedUsers: UserTagData[];
			groupChatName?: string;
		}) => {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/messages/create`,
				{ searchedUsers, groupChatName },
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	const createDM = (searchedUsers: UserTagData[], groupChatName?: string) => {
		mutate({ searchedUsers, groupChatName });
	};

	const { data: messages = [] } = useQuery({
		queryKey: ["messages", convoID],
		queryFn: async () => {
			const response = await axios.get(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/conversation/${convoID}`,
				{ withCredentials: true }
			);
			return response.data;
		}
	});

	useEffect(() => {
		if (receivedMessage) {
			queryClient.invalidateQueries({
				queryKey: ["messages"]
			});
		}
	}, [receivedMessage]);

	const { mutate: sendMessageMutate } = useMutation({
		mutationFn: async ({
			message,
			userData,
			uploadedImage,
			conversationID
		}: {
			message: string | undefined;
			userData: UserData;
			uploadedImage: string | string[];
			conversationID: string;
		}) => {
			const response = await axios.post(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/new-message/${conversationID}`,
				{
					message,
					sender: userData,
					attachments: uploadedImage
				},
				{ withCredentials: true }
			);

			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["messages"]
			});
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	function sendMessage(
		message: string | undefined,
		uploadedImage: string,
		conversationID: string
	) {
		if (message && userData) {
			if (message.length > 280) {
				return alert(
					"Message is too long. Please shorten it to 280 characters or less."
				);
			}

			queryClient.setQueryData(
				["messages", convoID],
				(prevMessages: Message[] = []) => [
					...prevMessages,
					{
						message,
						sender: {
							_id: userData._id,
							username: userData.username,
							profilePicture: userData.profilePicture
						},
						attachments: [],
						conversationID,
						createdAt: new Date()
					}
				]
			);

			sendMessageMutate({ message, userData, uploadedImage, conversationID });
		}

		if (!message) alert("Please provide a message");
	}

	const { data: dmRequests } = useQuery({
		queryKey: ["dmRequests"],
		queryFn: async () => {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/messages/dm-requests`,
				{ withCredentials: true }
			);
			return response.data || [];
		}
	});

	const { mutate: acceptDMRequestMutate } = useMutation({
		mutationFn: async ({ dmRequestID }: { dmRequestID: string }) => {
			const response = await axios.patch(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/dm-requests/${dmRequestID}/accept`,
				{},
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dmRequests"] });
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	const acceptDMRequest = (dmRequestID: string) => {
		acceptDMRequestMutate({ dmRequestID });
	};

	const { mutate: deleteConversationMutation } = useMutation({
		mutationFn: async ({ conversationID }: { conversationID: string }) => {
			try {
				const response = await axios.delete(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/messages/conversations/${conversationID}`,
					{ withCredentials: true }
				);

				return response.data;
			} catch (error) {
				console.error("Error deleting:", error);
				throw new Error("Failed to delete notification");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			navigate("/messages");
		}
	});

	const deleteConversation = (conversationID: string) => {
		const confirmation = confirm(
			"Are you sure you would like to delete this conversation?"
		);
		if (!confirmation) return;

		deleteConversationMutation({ conversationID });
	};

	return {
		createDM,
		conversations,
		sendMessage,
		messages,
		dmRequests,
		acceptDMRequest,
		deleteConversation
	};
}
