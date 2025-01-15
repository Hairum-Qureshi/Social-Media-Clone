import {
	faComment,
	faHeart,
	faMessage,
	faTrash,
	faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface UserNotificationCardProps {
	notifType: string;
	notifDescription: string;
}

export default function UserNotificationCard({
	notifType,
	notifDescription
}: UserNotificationCardProps) {
	return (
		<div className="w-full border-2 border-gray-700 lg:text-3xl text-xl">
			<div className="p-4 flex items-center">
				{notifType === "follow" ? (
					<span className="text-sky-400 mr-4">
						<FontAwesomeIcon icon={faUser} />
					</span>
				) : notifType === "like" ? (
					<span className="text-red-500 mr-4">
						<FontAwesomeIcon icon={faHeart} />
					</span>
				) : notifType === "comment" ? (
					<span className="text-white mr-4">
						<FontAwesomeIcon icon={faComment} />
					</span>
				) : (
					<span className="text-green-500 mr-4">
						<FontAwesomeIcon icon={faMessage} />
					</span>
				)}
				<img
					src="https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
					alt="User pfp"
					className="lg:w-10 lg:h-10 w-8 h-8 rounded-full"
				/>
				<div className="flex justify-center flex-col w-full text-left ml-3">
					<span className="lg:text-base text-sm flex justify-between items-center w-full">
						<strong>Username</strong>&nbsp;{notifDescription}
						<div className="ml-auto text-gray-600 hover:text-red-600 hover:cursor-pointer">
							<span className="text-gray-600 mr-3 lg:text-base text-sm">7 hrs ago</span>
							<span className = "text-lg"><FontAwesomeIcon icon={faTrash} /></span>
						</div>
					</span>
				</div>
			</div>
		</div>
	);
}
