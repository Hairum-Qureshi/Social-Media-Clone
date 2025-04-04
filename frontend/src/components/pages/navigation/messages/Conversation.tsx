export default function Conversation() {
	return (
		<div className="flex h-screen">
			<div className="m-auto w-2/3">
				<h2 className="font-bold text-4xl">Select a message</h2>
				<p className="text-slate-500 mt-3">
					Choose from your existing conversations, start a new one, or just keep
					swimming.
				</p>
				<button className="bg-sky-500 px-8 py-4 text-lg text-white rounded-full mt-5 font-semibold">
					New message
				</button>
			</div>
		</div>
	);
}
