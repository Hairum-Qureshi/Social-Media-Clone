import { useState } from "react";
import Contacts from "./Contacts";
import Conversation from "./Conversation";
import { Conversation as IConversation } from "../../../../interfaces";

export default function Messages() {
	const [conversation, setConversation] = useState<IConversation>();

	function setConvo(conversation: IConversation) {
		setConversation(conversation);

		console.log(conversation);
	}

	return (
		<div className="bg-black inline-flex w-full">
			<div className="border border-slate-600 w-5/12">
				<Contacts setConvo={setConvo} />
			</div>
			<div className="text-white border border-slate-600 flex-grow">
				<Conversation
					defaultSubtext={
						!conversation ? "Choose from your existing conversations, start a new one, or just keep swimming." : ""
					} 
					showHeaderText = {!conversation ? true : false}
				/>
			</div>
		</div>
	);
}
