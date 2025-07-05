import {
	faEllipsis,
	faThumbtack,
	faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContactProps } from "../../../../interfaces";
import useSocketContext from "../../../../contexts/SocketIOContext";
import useDM from "../../../../hooks/useDM";

export default function DM({
	conversationID,
	username,
	pfp,
	fullName,
	latestMessage,
	activeConversationID,
	setActiveConversationID
}: ContactProps) {
	const { typingIndicatorChatID, userIsTyping, typingUser } =
		useSocketContext()!;

	const isOptionsOpen = activeConversationID === conversationID;

	const handleOptionsClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveConversationID(conversationID);
	};

	const { deleteConversation } = useDM();

	return (
		<div
			className="w-full p-3 bg-zinc-800 border-r-2 border-r-sky-600 hover:bg-zinc-900 hover:cursor-pointer"
			onClick={() => setActiveConversationID(null)}
		>
			<div className="flex items-center">
				<div className="w-10 h-10 rounded-full flex-shrink-0">
					<img
						src={pfp}
						alt="User pfp"
						className="w-10 h-10 rounded-full object-cover"
					/>
				</div>
				<div className="w-full relative">
					<div className="ml-3 -mt-1 flex">
						{fullName}&nbsp;<span className="text-gray-500">@{username}</span>
						<div className="ml-auto" onClick={e => handleOptionsClick(e)}>
							{!isOptionsOpen && <FontAwesomeIcon icon={faEllipsis} />}
						</div>
						{isOptionsOpen && (
							<div className="bg-black rounded-md absolute border-2 border-zinc-800 right-0 z-10">
								<div className="w-full text-white font-semibold">
									<p className="text-sm p-2 flex items-center">
										<span className="mr-2">
											<FontAwesomeIcon icon={faThumbtack} />
										</span>
										Pin Conversation
									</p>
									<p
										className="text-sm text-red-600 p-2 border-t-2 border-t-zinc-800"
										onClick={() => deleteConversation(conversationID)}
									>
										<span className="mr-2">
											<FontAwesomeIcon icon={faTrash} />
										</span>
										Delete Conversation
									</p>
								</div>
							</div>
						)}
					</div>
					<div className="ml-3 text-gray-500">
						{userIsTyping && typingIndicatorChatID === conversationID ? (
							<span className="text-sky-600">@{typingUser} is typing...</span>
						) : latestMessage?.length > 40 ? (
							latestMessage?.slice(0, 40) + "..."
						) : (
							latestMessage
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
