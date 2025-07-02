import moment from "moment";
import { ChatBubbleProps } from "../../../../interfaces";

// TODO - design the chat bubble so it looks like a bubble

export default function ChatBubble({
	you,
	message,
	timestamp
}: ChatBubbleProps) {
	return (
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
