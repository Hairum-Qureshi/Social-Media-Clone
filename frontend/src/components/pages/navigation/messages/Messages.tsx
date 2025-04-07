import Contacts from "./Contacts";
import Conversation from "./Conversation";

export default function Messages() {
	return (
		<div className="bg-black inline-flex w-full">
			<div className="border border-slate-600 w-5/12">
				<Contacts />
			</div>
			<div className="text-white border border-slate-600 flex-grow">
				<Conversation
					defaultSubtext={
						"Choose from your existing conversations, start a new one, or just keep swimming."
					}
				/>
			</div>
		</div>
	);
}
