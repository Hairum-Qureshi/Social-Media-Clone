import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { NotificationTools } from "../interfaces";
import useSocketContext from "../contexts/SocketIOContext";
import { useEffect } from "react";

export default function useNotifications(): NotificationTools {
	const queryClient = useQueryClient();
	const { notificationData: notifData } = useSocketContext();

	useEffect(() => {
		if (notifData) {
			queryClient.refetchQueries({ queryKey: ["notifications"] });
			queryClient.refetchQueries({ queryKey: ["user"] });
		}
	}, [notifData]);

	const { data: notificationData, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/notifications/all`,
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

	const { mutate: deletion } = useMutation({
		mutationFn: async ({ notificationID }: { notificationID: string }) => {
			try {
				const response = await axios.delete(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/notifications/${notificationID}`,
					{ withCredentials: true }
				);

				return response.data;
			} catch (error) {
				console.error("Error deleting:", error);
				throw new Error("Failed to delete notification");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		}
	});

	const deleteNotification = (notificationID: string) => {
		deletion({ notificationID });
	};

	const { mutate: deletionAll } = useMutation({
		mutationFn: async () => {
			try {
				const response = await axios.delete(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/notifications/all`,
					{ withCredentials: true }
				);

				return response.data;
			} catch (error) {
				console.error("Error deleting:", error);
				throw new Error("Failed to delete all notifications");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		}
	});

	const deleteAllNotifications = () => {
		const confirmation = confirm(
			"Are you sure you would like to delete all your notifications?"
		);
		if (confirmation) deletionAll();
	};

	async function markAllNotifsAsRead() {
		try {
			const response = await axios.patch(
				`${
					import.meta.env.VITE_BACKEND_BASE_URL
				}/api/notifications/mark-all-read`,
				{},
				{ withCredentials: true }
			);

			if (response) {
				queryClient.invalidateQueries({ queryKey: ["user"] });
			}
		} catch (error) {
			console.log(error);
		}
	}

	return {
		notificationData,
		deleteNotification,
		isLoading,
		deleteAllNotifications,
		markAllNotifsAsRead
	};
}
