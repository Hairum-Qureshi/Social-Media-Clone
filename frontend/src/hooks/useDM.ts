import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserData, UserTagData, DMTools, Message } from "../interfaces";
import axios from "axios";
import useAuthContext from "../contexts/AuthContext";
import useSocketContext from "../contexts/SocketIOContext";
import { useEffect, useState } from "react";
import forge from "node-forge";
import { get } from "idb-keyval";
import CryptoJS from "crypto-js";

export default function useDM(): DMTools {
	const queryClient = useQueryClient();
	const { userData } = useAuthContext()!;
	const convoID: string = window.location.pathname.split("/")[3];
	const { receivedMessage } = useSocketContext()!;
	const [messages, setMessages] = useState<Message[]>([]);

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

	// const { data: messages = [] } = useQuery({
	// 	queryKey: ["messages", convoID],
	// 	queryFn: async () => {
	// 		const response = await axios.get(
	// 			`${
	// 				import.meta.env.VITE_BACKEND_BASE_URL
	// 			}/api/messages/conversation/${convoID}`,
	// 			{ withCredentials: true }
	// 		);
	// 		return response.data;
	// 	}
	// });

	const { data } = useQuery({
		queryKey: ["messages", convoID],
		queryFn: async () => {
			const response = await axios.get(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/conversation/${convoID}`,
				{ withCredentials: true }
			);

			setMessages(data);
			return response.data;
		}
	});

	// useEffect(() => {
	// 	if (receivedMessage) {
	// 		messages.push(receivedMessage);
	// 		queryClient.invalidateQueries({
	// 			queryKey: ["messages"]
	// 		});
	// 		queryClient.invalidateQueries({
	// 			queryKey: ["conversations"]
	// 		});
	// 	}
	// }, [receivedMessage]);

	useEffect(() => {
		if (!data || !Array.isArray(data)) return;

		const decryptMessages = async () => {
			try {
				const privateKeyPem = await get("private-key");
				const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
				const currentUserID = userData?._id;

				const decryptedMessages = await Promise.all(
					data.map(async msg => {
						if (!currentUserID) return msg;

						const encryptedKey = msg.encryptedAESKeys?.[currentUserID];

						if (!encryptedKey) {
							// Try to decrypt sender's own message if they are the author
							if (msg.senderId === currentUserID && msg.encryptedAESKeys) {
								const senderEncryptedKey = msg.encryptedAESKeys[currentUserID];
								if (!senderEncryptedKey) return msg;

								try {
									const decodedSenderKey =
										forge.util.decode64(senderEncryptedKey);
									const decryptedAESKey = privateKey.decrypt(
										decodedSenderKey,
										"RSA-OAEP"
									);

									const bytes = CryptoJS.AES.decrypt(
										msg.message,
										decryptedAESKey
									);
									const originalMessage = bytes.toString(CryptoJS.enc.Utf8);

									return { ...msg, message: originalMessage };
								} catch (err) {
									console.error("Failed to decrypt sender's own message", err);
									return msg;
								}
							}

							// Not accessible and not sent by current user
							return msg;
						}

						try {
							const decodedEncryptedAESKey = forge.util.decode64(encryptedKey);
							const decryptedAESKey = privateKey.decrypt(
								decodedEncryptedAESKey,
								"RSA-OAEP"
							);

							const bytes = CryptoJS.AES.decrypt(msg.message, decryptedAESKey);
							const originalMessage = bytes.toString(CryptoJS.enc.Utf8);

							return { ...msg, message: originalMessage };
						} catch (err) {
							console.error(
								`Failed to decrypt message for user ${currentUserID}`,
								err
							);
							return msg;
						}
					})
				);

				setMessages(decryptedMessages);
			} catch (err) {
				console.error("Failed to decrypt all messages:", err);
			}
		};

		decryptMessages();
	}, [data]);

	useEffect(() => {
		if (!receivedMessage) return;

		const decryptAndHandleMessage = async () => {
			try {
				const privateKeyPem = await get("private-key");
				const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

				const currentUserID = userData?._id;

				if (currentUserID) {
					const encryptedKey =
						receivedMessage.encryptedAESKeys?.[currentUserID];

					if (!encryptedKey) {
						console.warn("No encrypted AES key for this user");
						return;
					}

					const decodedEncryptedAESKey = forge.util.decode64(encryptedKey);
					const decryptedAESKey = privateKey.decrypt(
						decodedEncryptedAESKey,
						"RSA-OAEP"
					);

					const bytes = CryptoJS.AES.decrypt(
						receivedMessage.message,
						decryptedAESKey
					);
					const originalMessage = bytes.toString(CryptoJS.enc.Utf8);

					const decryptedMessage = {
						...receivedMessage,
						message: originalMessage
					};

					setMessages(prevMessages => [...prevMessages, decryptedMessage]);
					queryClient.invalidateQueries({ queryKey: ["conversations"] });
				}
			} catch (err) {
				console.error("Failed to decrypt message:", err);
			}
		};

		decryptAndHandleMessage();
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
