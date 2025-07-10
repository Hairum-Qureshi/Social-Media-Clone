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

	return { makeAdmin };
}
