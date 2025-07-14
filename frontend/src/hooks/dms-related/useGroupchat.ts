import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GroupChatTools, UserTagData } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { blobURLToFile } from "../../utils/blobURLToFile";

export default function useGroupChat(): GroupChatTools {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: makeAdminMutation } = useMutation({
		mutationFn: async ({
			conversationID,
			uid
		}: {
			conversationID: string;
			uid: string;
		}) => {
			const response = await axios.patch(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/conversations/${conversationID}/make-admin`,
				{ uid },
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	const makeAdmin = (conversationID: string, uid: string) => {
		const confirmation = confirm(
			"Are you sure you would like to make this user an admin?"
		);

		if (!confirmation) return;

		makeAdminMutation({ conversationID, uid });
	};

	const { mutate: leaveGroupChatMutation } = useMutation({
		mutationFn: async ({ conversationID }: { conversationID: string }) => {
			const response = await axios.patch(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/conversations/${conversationID}/leave`,
				{},
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	const leaveGroupChat = (conversationID: string) => {
		const prompt = confirm(
			"Are you sure you would like to leave this group chat? Once you leave, you will no longer be able to rejoin unless somebody re-adds you"
		);

		if (!prompt) return;

		leaveGroupChatMutation({ conversationID });
	};

	const { mutate: removeUserFromGroupChatMutation } = useMutation({
		mutationFn: async ({
			conversationID,
			uid
		}: {
			conversationID: string;
			uid: string;
		}) => {
			const response = await axios.patch(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/conversations/${conversationID}/remove-user`,
				{ uid },
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	const removeUserFromGroupChat = (conversationID: string, uid: string) => {
		const prompt = confirm(
			"Are you sure you would to remove this user from the group chat? They will no longer be able to see the messages in this group chat"
		);

		if (!prompt) return;

		removeUserFromGroupChatMutation({ conversationID, uid });
	};

	const { mutate: deleteGroupChatMutation } = useMutation({
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

	const deleteGroupChat = (conversationID: string) => {
		deleteGroupChatMutation({ conversationID });
	};

	const { mutate: updateGroupNameMutation } = useMutation({
		mutationFn: async ({
			conversationID,
			newGroupName
		}: {
			conversationID: string;
			newGroupName: string;
		}) => {
			const response = await axios.patch(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/conversations/${conversationID}/rename`,
				{ newGroupName },
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	const renameGroupChat = (conversationID: string, newGroupName: string) => {
		if (!newGroupName?.trim()) {
			alert("Group name cannot be empty");
			return;
		}

		updateGroupNameMutation({ conversationID, newGroupName });
	};

	const { mutate: addUsersToGCMutation } = useMutation({
		mutationFn: async ({
			conversationID,
			searchedUsersUIDs
		}: {
			conversationID: string;
			searchedUsersUIDs: string[];
		}) => {
			const response = await axios.patch(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/conversations/${conversationID}/add-users`,
				{ searchedUsersUIDs },
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	const addSearchedUsers = (
		conversationID: string,
		searchedUsers: UserTagData[]
	) => {
		const searchedUsersUIDs = searchedUsers.map(user => user._id);
		addUsersToGCMutation({ conversationID, searchedUsersUIDs });
	};

	const { mutate: uploadGroupChatPhoto } = useMutation({
		mutationFn: async ({
			blobURL,
			conversationID
		}: {
			blobURL: string;
			conversationID: string;
		}) => {
			try {
				const formData = new FormData();
				const res: File = await blobURLToFile(
					blobURL,
					"groupPhoto",
					conversationID
				);

				formData.append("isPfp", "false"); // needs to come first because in the backend, if this comes after, it'll be undefined in the multer config!
				formData.append("imageType", "groupPhoto");
				formData.append("groupPhoto", res);

				const response = await axios.patch(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/messages/conversations/${conversationID}/group-photo`,
					formData,
					{
						withCredentials: true,
						headers: { "Content-Type": "multipart/form-data" }
					}
				);

				return response.data;
			} catch (error) {
				console.error("Error in updating group chat photo:", error);
				throw new Error("Failed to update group chat photo");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	function handleImage(
		event: React.ChangeEvent<HTMLInputElement>,
		conversationID: string
	) {
		const files: FileList | null = event.target.files;
		if (files && files.length > 0) {
			const blobURL = window.URL.createObjectURL(files[0]);
			uploadGroupChatPhoto({ blobURL, conversationID });
		}
	}

	async function userGroupChatStatus(conversationID: string): Promise<boolean> {
		try {
			const response = await axios.get(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/messages/conversations/${conversationID}/still-in-groupchat`,
				{
					withCredentials: true
				}
			);
			return response.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	return {
		makeAdmin,
		leaveGroupChat,
		removeUserFromGroupChat,
		deleteGroupChat,
		renameGroupChat,
		addSearchedUsers,
		handleImage,
		userGroupChatStatus
	};
}
