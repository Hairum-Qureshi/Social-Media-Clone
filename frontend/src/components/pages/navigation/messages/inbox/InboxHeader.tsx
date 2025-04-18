import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InboxHeaderProps } from "../../../../../interfaces";
import getFriend from "../../../../../utils/getFriend";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export default function InboxHeader({
	conversation,
	currUID
}: InboxHeaderProps) {
	return (
		<div className="w-full p-2 font-semibold sticky top-0 bg-black">
			{conversation?.isGroupchat ? (
				<>
					<img
						src={conversation?.groupPhoto}
						alt="User pfp"
						className="w-8 h-8 rounded-full object-cover mr-3"
					/>
					<p>{conversation.groupName}</p>
				</>
			) : (
				<div className="flex items-center">
					<img
						src={getFriend(conversation?.users, currUID).profilePicture}
						alt="User pfp"
						className="w-8 h-8 rounded-full object-cover mr-3"
					/>
					<p>{getFriend(conversation?.users, currUID).fullName}</p>
					<span className="ml-auto text-lg hover:cursor-pointer">
						<FontAwesomeIcon icon={faCircleInfo} />
					</span>
				</div>
			)}
		</div>
	);
}
