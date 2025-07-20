import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { ProfileTools } from "../interfaces";
import useAuthContext from "../contexts/AuthContext";
import { blobURLToFile } from "../utils/blobURLToFile";
import { useLocation } from "react-router-dom";

export default function useProfile(): ProfileTools {
	const queryClient = useQueryClient();
	const location = useLocation();
	const splitPathname = location.pathname.split("/");
	const username =
		splitPathname.length === 1 ? splitPathname.pop() : splitPathname[1];
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
				const response = await axios.patch(
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
			queryClient.invalidateQueries({ queryKey: ["currentProfilePosts"] });
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
		queryKey: ["profile", username],
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
				return response.data;
			} catch (error) {
				console.error(error);
			}
		}
	});

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ["profile", username] });
		queryClient.invalidateQueries({ queryKey: ["currentProfilePosts"] });
		queryClient.invalidateQueries({ queryKey: ["postsImages"] });
	}, [location.pathname]);

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
				console.error("Error following:", error);
				throw new Error("Failed to follow user");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile", username] });
			queryClient.invalidateQueries({ queryKey: ["followReccs"] });
		}
	});

	const handleFollowing = (userID: string | undefined) => {
		handleFollowingMutation({ userID });
	};

	const { mutate: uploadPfpImageMutate } = useMutation({
		mutationFn: async ({
			blobURL,
			userID
		}: {
			blobURL: string;
			userID: string;
		}) => {
			try {
				const formData = new FormData();
				const res: File = await blobURLToFile(
					blobURL,
					"profile-picture",
					userID
				);

				formData.append("isPfp", "true"); // needs to come first because in the backend, if this comes after, it'll be undefined in the multer config!
				formData.append("profile-picture", res);

				const response = await axios.patch(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/user/update-profile/images/profile-picture`,
					formData,
					{
						withCredentials: true,
						headers: { "Content-Type": "multipart/form-data" }
					}
				);

				return response.data;
			} catch (error) {
				console.error("Error in updating profile picture:", error);
				throw new Error("Failed to update profile picture");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile", username] });
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["currentProfilePosts"] });
		}
	});

	const { mutate: uploadBackdropImageMutate } = useMutation({
		mutationFn: async ({
			blobURL,
			userID
		}: {
			blobURL: string;
			userID: string;
		}) => {
			try {
				const formData = new FormData();
				const res: File = await blobURLToFile(blobURL, "backdrop", userID);

				formData.append("isPfp", "false"); // needs to come first because in the backend, if this comes after, it'll be undefined in the multer config!
				formData.append("imageType", "backdrop");
				formData.append("backdrop", res);

				const response = await axios.patch(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/user/update-profile/images/backdrop`,
					formData,
					{
						withCredentials: true,
						headers: { "Content-Type": "multipart/form-data" }
					}
				);

				return response.data;
			} catch (error) {
				console.error("Error in updating profile backdrop:", error);
				throw new Error("Failed to update profile backdrop");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile", username] });
		}
	});

	function handleImage(
		event: React.ChangeEvent<HTMLInputElement>,
		isPfp: boolean
	) {
		const files: FileList | null = event.target.files;
		if (files && files.length > 0 && userData) {
			const blobURL = window.URL.createObjectURL(files[0]);
			if (isPfp) {
				uploadPfpImageMutate({ blobURL, userID: userData?._id });
			} else {
				uploadBackdropImageMutate({ blobURL, userID: userData?._id });
			}
		}
	}

	const { data: postsImages } = useQuery({
		queryKey: ["postsImages"],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/user/profile/${username}/posts-images`,
					{
						withCredentials: true
					}
				);
				return response.data;
			} catch (error) {
				console.error(error);
			}
		}
	});

	const { mutate: extendedBioMutate } = useMutation({
		mutationFn: async ({
			extendedBioContent
		}: {
			extendedBioContent: string;
		}) => {
			const response = await axios.post(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/user/update-profile/extended-bio`,
				{ extendedBioContent },
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		}
	});

	const addExtendedBio = (extendedBioContent: string) => {
		extendedBioMutate({ extendedBioContent });
	};

	const { mutate: extendedBioDeletionMutate } = useMutation({
		mutationFn: async () => {
			const response = await axios.delete(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/user/update-profile/delete-extended-bio`,
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		}
	});

	const deleteExtendedBio = () => {
		const confirmation = confirm(
			"Are you sure you would like to delete your bio? This cannot be undone"
		);

		if (!confirmation) return;

		extendedBioDeletionMutate();
	};

	const { data: extendedBio } = useQuery({
		queryKey: ["extendedBio", username],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/user/profile/extended-bio/${
						location.pathname.includes("/settings/bio")
							? userData?.username
							: username
					}`,
					{
						withCredentials: true
					}
				);
				return response.data;
			} catch (error) {
				console.error(error);
			}
		}
	});

	const { mutate: extendedBioWorkExperienceMutate } = useMutation({
		mutationFn: async ({
			isCurrentlyWorkingHere,
			jobTitle,
			companyName,
			companyLogo,
			location,
			startDate,
			endDate,
			experience
		}: {
			isCurrentlyWorkingHere: boolean;
			jobTitle: string;
			companyName: string;
			companyLogo: string;
			location: string;
			startDate: string;
			endDate: string;
			experience: string;
		}) => {
			const response = await axios.post(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/user/update-profile/extended-bio/work-experience`,
				{
					isCurrentlyWorkingHere,
					jobTitle,
					companyName,
					companyLogo,
					location,
					startDate,
					endDate,
					experience
				},
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["extendedBio", username] });
		}
	});

	const { mutate: updateExtendedBioWorkExperienceMutate } = useMutation({
		mutationFn: async ({
			workHistoryID,
			isCurrentlyWorkingHere,
			jobTitle,
			companyName,
			companyLogo,
			location,
			startDate,
			endDate,
			experience
		}: {
			workHistoryID: string;
			isCurrentlyWorkingHere: boolean;
			jobTitle: string;
			companyName: string;
			companyLogo: string;
			location: string;
			startDate: string;
			endDate: string;
			experience: string;
		}) => {
			const response = await axios.patch(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/user/update-profile/extended-bio/work-experience/edit/${workHistoryID}`,
				{
					isCurrentlyWorkingHere,
					jobTitle,
					companyName,
					companyLogo,
					location,
					startDate,
					endDate,
					experience
				},
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["extendedBio", username] });
		},
		onError: error => {
			console.error(error);
		}
	});

	const addExtendedBioWorkExperience = (
		isCurrentlyWorkingHere: boolean,
		jobTitle: string,
		companyName: string,
		companyLogo: string,
		location: string,
		startDate: string,
		endDate: string,
		experience: string
	) => {
		extendedBioWorkExperienceMutate({
			isCurrentlyWorkingHere,
			jobTitle,
			companyName,
			companyLogo,
			location,
			startDate,
			endDate,
			experience
		});
	};

	const updateExtendedBioWorkExperience = (
		workHistoryID: string,
		isCurrentlyWorkingHere: boolean,
		jobTitle: string,
		companyName: string,
		companyLogo: string,
		location: string,
		startDate: string,
		endDate: string,
		experience: string
	) => {
		updateExtendedBioWorkExperienceMutate({
			workHistoryID,
			isCurrentlyWorkingHere,
			jobTitle,
			companyName,
			companyLogo,
			location,
			startDate,
			endDate,
			experience
		});
	};

	const { mutate: workExperienceDeletionMutate } = useMutation({
		mutationFn: async (workExperienceID: string) => {
			const response = await axios.delete(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/user/update-profile/extended-bio/work-experience/${workExperienceID}`,
				{ withCredentials: true }
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["extendedBio", username] });
		}
	});

	const deleteWorkExperienceByID = (workExperienceID: string) => {
		const confirmation = confirm(
			"Are you sure you would like to delete your work experience? This cannot be undone"
		);

		if (!confirmation) return;

		workExperienceDeletionMutate(workExperienceID);
	};

	return {
		postMutation,
		profileData: data,
		handleFollowing,
		handleImage,
		postsImages,
		addExtendedBio,
		deleteExtendedBio,
		addExtendedBioWorkExperience,
		updateExtendedBioWorkExperience,
		extendedBio,
		deleteWorkExperienceByID
	};
}
