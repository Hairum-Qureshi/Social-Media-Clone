import { faGear } from "@fortawesome/free-solid-svg-icons";
import UserNotificationCard from "./UserNotificationCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Notifications() {
	return (
		<div className="bg-black w-full text-white min-h-screen overflow-auto">
			<div className = "flex items-center">
				<h2 className="text-2xl font-bold m-5">Notifications</h2>
				<span className = "text-2xl ml-auto m-5 hover:cursor-pointer"><FontAwesomeIcon icon={faGear} /></span>
			</div>
			<UserNotificationCard
				notifType={"follow"}
				notifDescription={"followed you"}
			/>
			<UserNotificationCard
				notifType={"like"}
				notifDescription={"liked your post"}
			/>
			<UserNotificationCard
				notifType={"comment"}
				notifDescription={"commented on your post"}
			/>
			<UserNotificationCard
				notifType={"message"}
				notifDescription={"sent you a message"}
			/>
		</div>
	);
}
