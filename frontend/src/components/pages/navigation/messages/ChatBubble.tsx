import moment from "moment";
import { ChatBubbleProps } from "../../../../interfaces";
import useAuthContext from "../../../../contexts/AuthContext";

// TODO - design the chat bubble so it looks like a bubble

export default function ChatBubble({
	you,
	message,
	timestamp,
	isSystem = false
}: ChatBubbleProps) {
	const { userData } = useAuthContext()!;

	return isSystem ? (
		<div>
			<div className="w-full flex justify-center">
				<div
					className="bg-sky-950 w-11/12 text-sky-300 text-sm italic px-3 py-1.5 rounded-sm border border-sky-500 shadow-sm"
					title={moment(timestamp).fromNow()}
				>
					<p>
						{userData && message.includes(userData.username)
							? message.replace(`@${userData.username}`, "you")
							: message}
					</p>
				</div>
			</div>
			<p className="text-right text-xs text-gray-300 mt-1 mr-2">
				{moment(timestamp).format("ddd h:mm A")}
			</p>
		</div>
	) : (
		<div
			className={`flex flex-col m-2 ${
				you ? "items-end" : "items-start"
			} break-words whitespace-pre-wrap`}
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
