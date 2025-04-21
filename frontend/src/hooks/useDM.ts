import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserData, UserTagData, DMTools } from "../interfaces";
import axios from "axios";
import useAuthContext from "../contexts/AuthContext";
import useSocketContext from "../contexts/SocketIOContext";
import { useEffect } from "react";

export default function useDM(): DMTools {
	const queryClient = useQueryClient();
	const { userData } = useAuthContext()!;
	const convoID: string = window.location.pathname.split("/")[3];
	const { receivedMessage } = useSocketContext()!;

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
		mutationFn: async ({ searchedUsers }: { searchedUsers: UserTagData[] }) => {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/messages/create`,
				{ searchedUsers },
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	const createDM = (searchedUsers: UserTagData[]) => {
		mutate({ searchedUsers });
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
			messages.push(receivedMessage);
			queryClient.invalidateQueries({
				queryKey: ["messages"]
			});
			queryClient.invalidateQueries({
				queryKey: ["conversations"]
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

			sendMessageMutate({ message, userData, uploadedImage, conversationID });
		}

		if (!message) alert("Please provide a message");
	}

	return { createDM, conversations, sendMessage, messages };
}
