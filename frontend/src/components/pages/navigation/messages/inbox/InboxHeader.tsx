import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InboxHeaderProps } from "../../../../../interfaces";
import getFriend from "../../../../../utils/getFriend";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

// TODO - will need to figure out logic for rendering out online statuses for group chats and implement it

export default function InboxHeader({
	conversation,
	currUID,
	status,
	setShowInfoPanel,
	showInfoPanel
}: InboxHeaderProps) {
	return (
		<div className="w-full p-2 font-semibold sticky top-0 bg-black">
			{conversation?.isGroupchat ? (
				<div className="flex items-center">
					<img
						src={conversation?.groupPhoto}
						alt="User pfp"
						className="w-8 h-8 rounded-full object-cover mr-3"
					/>
					<p>{conversation.groupName}</p>
					<span
						className="ml-auto text-lg hover:cursor-pointer"
						onClick={() => setShowInfoPanel(!showInfoPanel)}
					>
						<FontAwesomeIcon icon={faCircleInfo} />
					</span>
				</div>
			) : (
				<div className="flex items-center">
					<img
						src={getFriend(conversation?.users, currUID).profilePicture}
						alt="User pfp"
						className="w-8 h-8 rounded-full object-cover mr-3"
					/>
					<p>
						{getFriend(conversation?.users, currUID).fullName}
						{status === "ONLINE" ? (
							<span className="text-green-600 font-light ml-5">Online</span>
						) : (
							<span className="text-red-600 font-light ml-5">Offline</span>
						)}
					</p>
					<span
						className="ml-auto text-lg hover:cursor-pointer"
						onClick={() => setShowInfoPanel(!showInfoPanel)}
					>
						<FontAwesomeIcon icon={faCircleInfo} />
					</span>
				</div>
			)}
		</div>
	);
}
