import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FeedTools } from "../interfaces";

export default function useFeed(): FeedTools {

	const { data: getFollowReccs } = useQuery({
		queryKey: ["followReccs"],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/suggested`,
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

	return { getFollowReccs };
}
