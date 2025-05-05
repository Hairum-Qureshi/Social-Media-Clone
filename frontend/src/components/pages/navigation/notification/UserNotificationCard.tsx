import {
	faComment,
	faHeart,
	faMessage,
	faTrash,
	faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { UserNotificationCardProps } from "../../../../interfaces";

export default function UserNotificationCard({
	username,
	userPfp,
	notifType,
	notifDescription,
	notifDate
}: UserNotificationCardProps) {
	return (
		<div className="w-full border-2 border-gray-700 lg:text-2xl text-xl">
			<div className="p-4 flex items-center">
				{notifType === "FOLLOW" ? (
					<span className="text-sky-400 mr-4">
						<FontAwesomeIcon icon={faUserPlus} />
					</span>
				) : notifType === "LIKE" ? (
					<span className="text-red-500 mr-4">
						<FontAwesomeIcon icon={faHeart} />
					</span>
				) : notifType === "COMMENT" ? (
					<span className="text-white mr-4">
						<FontAwesomeIcon icon={faComment} />
					</span>
				) : (
					<span className="text-green-500 mr-4">
						<FontAwesomeIcon icon={faMessage} />
					</span>
				)}
				<img
					src={userPfp}
					alt="User pfp"
					className="lg:w-9 lg:h-9 w-8 h-8 rounded-full"
				/>
				<div className="flex justify-center flex-col w-full text-left ml-3">
					<span className="lg:text-base text-sm flex justify-between items-center w-full">
						<strong>{username}</strong>&nbsp;{notifDescription}
						<div className="ml-auto text-gray-600 hover:text-red-600 hover:cursor-pointer">
							<span className="text-gray-600 mr-3 lg:text-base text-sm">
								{moment(notifDate).fromNow()}
							</span>
							<span className="text-lg">
								<FontAwesomeIcon icon={faTrash} />
							</span>
						</div>
					</span>
				</div>
			</div>
		</div>
	);
}
