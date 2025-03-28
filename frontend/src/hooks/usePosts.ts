import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Post, PostData } from "../interfaces";

export default function usePosts(feedType?: string): PostData {
	const [postData, setPostData] = useState<Post[]>([]);
	const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
	const [currentUserPostData, setCurrentUserPostData] = useState<Post[]>([]);
	const queryClient = useQueryClient();

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

	const { mutate, isPending } = useMutation({
		mutationFn: async ({
			uploadedImages,
			postContent
		}: {
			uploadedImages: string[];
			postContent: string;
		}) => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/create`,
					{ uploadedImages, postContent },
					{ withCredentials: true }
				);

				return response.data;
			} catch (error) {
				console.error("Error posting:", error);
				throw new Error("Failed to create post");
			}
		},
		onSuccess: () => {
			// alert("Successfully posted!");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		}
	});

	const postMutation = (uploadedImages: string[], postContent: string) => {
		mutate({ uploadedImages, postContent });
	};

	useEffect(() => {
		setCurrentUserPostData(currUserPostData);
	}, [currUserPostData, loading]);

	useEffect(() => {
		setPostData(data);
		setLoadingStatus(isLoading);
	}, [data, feedType, isLoading]);

	return { postData, loadingStatus, currentUserPostData, postMutation, isPending };
}
