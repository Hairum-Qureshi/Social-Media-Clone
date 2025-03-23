import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Post } from "../interfaces";

interface PostData {
	postData: Post[];
	loadingStatus: boolean;
	currentUserPostData: Post[];
}

export default function usePosts(feedType?: string): PostData {
	const [postData, setPostData] = useState<Post[]>([]);
	const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
	const [currentUserPostData, setCurrentUserPostData] = useState<Post[]>([]);

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
		queryKey: ["posts", feedType],
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

	useEffect(() => {
		setCurrentUserPostData(currUserPostData);
	}, [currUserPostData, loading]);

	useEffect(() => {
		setPostData(data);
		setLoadingStatus(isLoading);
	}, [feedType, isLoading]);

	return { postData, loadingStatus, currentUserPostData };
}
