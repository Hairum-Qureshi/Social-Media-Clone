interface ChatBubbleProps {
	you: boolean;
	message: string;
	timestamp: string;
}

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
			<div className="bg-sky-500 p-2 rounded-md">
				<p>{message}</p>
			</div>
			<p className="text-xs text-gray-400 mt-1">{timestamp}</p>
		</div>
	);
}
