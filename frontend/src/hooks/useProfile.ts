import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ProfileTools {
	postMutation: (
		fullName: string,
		username: string,
		email: string,
		currentPassword: string,
		newPassword: string,
		location: string,
		bio: string,
		link: string
	) => void;
}

export default function useProfile(): ProfileTools {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: async ({
			fullName,
			username,
			email,
			currentPassword,
			newPassword,
			location,
			bio,
			link
		}: {
			fullName?: string;
			username?: string;
			email?: string;
			currentPassword?: string;
			newPassword?: string;
			location?: string;
			bio?: string;
			link?: string;
		}) => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/update-profile`,
					{
						fullName,
						username,
						email,
						currentPassword,
						newPassword,
						location,
						bio,
						link
					},
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (error) {
				console.error("Error posting:", error);
				throw new Error("Failed to create post");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["currentUserPosts"] });
		}
	});

	const postMutation = (
		fullName?: string,
		username?: string,
		email?: string,
		currentPassword?: string,
		newPassword?: string,
		location?: string,
		bio?: string,
		link?: string
	) => {
		if (
			!fullName &&
			!username &&
			!email &&
			!currentPassword &&
			!newPassword &&
			!location &&
			!bio &&
			!link
		)
			return;

		if ((currentPassword && !newPassword) || (!currentPassword && newPassword))
			return alert(
				"In order to update your password, please make sure both fields are filled"
			);

		mutate({
			fullName,
			username,
			email,
			currentPassword,
			newPassword,
			location,
			bio,
			link
		});
	};

	return { postMutation };
}
