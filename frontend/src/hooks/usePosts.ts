import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Post, PostData } from "../interfaces";
import useAuthContext from "../contexts/AuthContext";

export default function usePosts(feedType?: string): PostData {
	const [postData, setPostData] = useState<Post[]>([]);
	const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
	const [currentUserPostData, setCurrentUserPostData] = useState<Post[]>([]);
	const queryClient = useQueryClient();
	const { userData } = useAuthContext()!;

	function getFeedTypeEndpoint(): string {
		switch (feedType) {
			case "For You":
				return "/api/posts/all";
			case "Following":
				return "/api/posts/following";
			default:
				return "/api/posts/all";
		}
	}

	const POST_ENDPOINT: string = getFeedTypeEndpoint();

	const { data, isLoading } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_BASE_URL}${POST_ENDPOINT}`,
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

	const { data: currUserPostData, isLoading: loading } = useQuery({
		queryKey: ["currentUserPosts"],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/current-user/all`,
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

	async function blobURLToFile(blobURL: string, postID:string): Promise<File> {
		const response = await axios.get(blobURL, { responseType: "blob" });
		const blob = response.data;
		const originalFile = await fetch(blobURL).then(res => res.blob());

		return new File([blob], `${postID}-${userData?._id}-${Math.round(Date.now() * Math.random() * 1e9)}`, {
			type: originalFile.type
		});
	}

	const { mutate, isPending } = useMutation({
		mutationFn: async ({
			uploadedImages,
			postContent
		}: {
			uploadedImages: string[];
			postContent: string;
		}) => {
			try {
				const formData = new FormData();
				const postID = Date.now().toString(36) + Math.random().toString(36).substring(2);
				formData.append("postID", postID);

				if (uploadedImages.length > 0) {
					for (let i = 0; i < uploadedImages.length; i++) {
						const res: File = await blobURLToFile(uploadedImages[i], postID);
						formData.append("images", res);
					}
				}

				formData.append("postContent", postContent);

				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/create`,
					formData,
					{
						withCredentials: true,
						headers: { "Content-Type": "multipart/form-data" }
					}
				);

				return response.data;
			} catch (error) {
				console.error("Error posting:", error);
				throw new Error("Failed to create post");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		}
	});

	const postMutation = (uploadedImages: string[], postContent: string) => {
		mutate({ uploadedImages, postContent });
	};

	const { mutate: deletion } = useMutation({
		mutationFn: async ({ postID }: { postID: string }) => {
			try {
				const response = await axios.delete(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/${postID}`,
					{ withCredentials: true }
				);

				return response.data;
			} catch (error) {
				console.error("Error posting:", error);
				throw new Error("Failed to create post");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		}
	});

	const deleteMutation = (postID: string) => {
		deletion({ postID });
	};

	useEffect(() => {
		setCurrentUserPostData(currUserPostData);
	}, [currUserPostData, loading]);

	useEffect(() => {
		setPostData(data);
		setLoadingStatus(isLoading);
	}, [data, feedType, isLoading]);

	return {
		postData,
		loadingStatus,
		currentUserPostData,
		postMutation,
		isPending,
		deleteMutation
	};
}
