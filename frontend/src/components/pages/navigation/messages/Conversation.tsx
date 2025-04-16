interface ConversationProps {
	defaultSubtext: string;
	showHeaderText: boolean;
}

export default function Conversation({
	defaultSubtext,
	showHeaderText = true
}: ConversationProps) {
	return (
		<div className="flex h-screen">
			<div className="m-auto w-2/3">
				{showHeaderText && (
					<h2 className="font-bold text-4xl">Select a message</h2>
				)}
				{defaultSubtext && (
					<p className="text-zinc-500 mt-3">{defaultSubtext}</p>
				)}
			</div>
		</div>
	);
}
