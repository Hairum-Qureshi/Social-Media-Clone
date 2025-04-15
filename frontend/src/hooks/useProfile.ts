import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProfileTools, UserData } from "../interfaces";
import { useLocation } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";

export default function useProfile(): ProfileTools {
	const queryClient = useQueryClient();
	const [profileData, setProfileData] = useState<UserData>();
	const username = window.location.pathname.split("/").pop();
	const location = useLocation();
	const { userData } = useAuthContext()!;

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

	const { data } = useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/user/profile/${username}`,
					{
						withCredentials: true
					}
				);

				setProfileData(response.data);
				return response.data;
			} catch (error) {
				console.error(error);
			}
		}
	});

	useEffect(() => {
		setProfileData(data);
		queryClient.invalidateQueries({ queryKey: ["profile"] });
	}, [location]);

	useEffect(() => {
		window.history.pushState({}, "", encodeURI(`/${userData?.username}`));
	}, [userData]);

	const { mutate: handleFollowingMutation } = useMutation({
		mutationFn: async ({ userID }: { userID: string | undefined }) => {
			try {
				if (userID) {
					const response = await axios.post(
						`${
							import.meta.env.VITE_BACKEND_BASE_URL
						}/api/user/follow-status/${userID}`,
						{},
						{
							withCredentials: true
						}
					);

					return response.data;
				}
			} catch (error) {
				console.error("Error posting:", error);
				throw new Error("Failed to create post");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		}
	});

	const handleFollowing = (userID: string | undefined) => {
		handleFollowingMutation({ userID });
	};

	return { postMutation, profileData, handleFollowing };
}
