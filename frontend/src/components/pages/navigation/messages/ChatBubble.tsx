import moment from "moment";
import { ChatBubbleProps } from "../../../../interfaces";
import useAuthContext from "../../../../contexts/AuthContext";
import { formatSystemMessage } from "../../../../utils/formatSystemMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowLeft,
	faCrown,
	faPlus
} from "@fortawesome/free-solid-svg-icons";

// TODO - design the chat bubble so it looks like a bubble

export default function ChatBubble({
	you,
	message,
	timestamp,
	isSystem = false,
	isGroupChat,
	username
}: ChatBubbleProps) {
	const { userData } = useAuthContext()!;

	return isSystem ? (
		<div>
			<div className="w-full flex justify-center mt-3">
				<div
					className="w-11/12 text-slate-500 text-sm px-3 py-1.5 text-center shadow-sm"
					title={moment(timestamp).fromNow()}
				>
					<p className="flex items-center justify-center">
						{message.includes("left") || message.includes("removed") ? (
							<span className="text-red-600 mr-2 text-lg">
								<FontAwesomeIcon icon={faArrowLeft} />
							</span>
						) : message.includes("added") ? (
							<span className="text-green-500 mr-2 text-lg">
								<FontAwesomeIcon icon={faPlus} />
							</span>
						) : message.includes("admin") ? (
							<span className="text-yellow-500 mr-2 text-lg">
								<FontAwesomeIcon icon={faCrown} />
							</span>
						) : undefined}
						{formatSystemMessage(userData, message)}
					</p>
				</div>
			</div>
			<p className="text-right text-xs text-gray-300 mt-1 mr-2">
				{moment(timestamp).format("ddd h:mm A")}
			</p>
		</div>
	) : (
		<div
			className={`flex flex-col m-2 mt-6 ${
				you ? "items-end" : "items-start"
			} break-words whitespace-pre-wrap`}
			title={isGroupChat ? `@${username}` : ""}
		>
			<div className="bg-sky-500 p-2 rounded-md w-fit max-w-[75%] overflow-wrap break-words whitespace-pre-wrap">
				<p>{message}</p>
			</div>
			<p
				className="text-xs text-gray-400 mt-1"
				title={moment(timestamp).fromNow()}
			>
				{moment(timestamp).format("ddd h:mm A")}
			</p>
		</div>
	);
}
