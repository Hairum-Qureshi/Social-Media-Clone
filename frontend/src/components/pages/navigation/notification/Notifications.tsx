import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useNotifications from "../../../../hooks/useNotifications";
import { Notification } from "../../../../interfaces";
import UserNotificationCard from "./UserNotificationCard";
import { getDescription } from "../../../../utils/getDescription";

export default function Notifications() {
	const { notificationData } = useNotifications();

	return (
		<div className="bg-black w-full text-white min-h-screen overflow-auto">
			<div className="flex items-center">
				<h2 className="text-2xl font-bold m-5">Notifications</h2>
				<span className="text-2xl ml-auto m-5 hover:cursor-pointer">
					<FontAwesomeIcon icon={faGear} />
				</span>
			</div>
			{!notificationData || notificationData.length === 0 ? (
				<h3 className="text-xl font-semibold text-center mt-10">
					You currently don't have any notifications
				</h3>
			) : (
				notificationData.map((notification: Notification) => (
					<UserNotificationCard
						username={notification.from.username}
						userPfp={notification.from.profilePicture}
						notifType={notification.notifType}
						notifDescription={getDescription(notification.notifType)}
						notifDate={notification.createdAt.toString()}
						notifID={notification._id}
					/>
				))
			)}
		</div>
	);
}
