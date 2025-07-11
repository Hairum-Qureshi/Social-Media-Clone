import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GroupChatTools } from "../../interfaces";

export default function useGroupChat(): GroupChatTools {
	const queryClient = useQueryClient();

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

	return { makeAdmin, leaveGroupChat };
}
