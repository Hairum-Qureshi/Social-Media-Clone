import { useEffect, useState } from "react";
import Contacts from "./Contacts";
import Conversation from "./Conversation";
import { Conversation as IConversation } from "../../../../interfaces";
import useDM from "../../../../hooks/useDM";

export default function Messages() {
	const [conversation, setConversation] = useState<IConversation>();
	const pathname: string[] = window.location.pathname.split("/");

	function setConvo(conversation: IConversation) {
		setConversation(conversation);
	}

	const { conversations } = useDM();

	useEffect(() => {
		if (pathname.length === 5) {
			const convoID = pathname[3];
			const convo = conversations.find(
				conversation => conversation._id === convoID
			);
			if (convo) {
				setConvo(convo);
			}
		}
	}, [pathname]);

	return (
		<div className="bg-black inline-flex w-full">
			<div className="border border-slate-600 w-5/12">
				<Contacts setConvo={setConvo} />
			</div>
			<div className="text-white border border-slate-600 w-[625px]">
				<Conversation
					defaultSubtext={
						!conversation
							? "Choose from your existing conversations, start a new one, or just keep swimming."
							: ""
					}
					showHeaderText={!conversation ? true : false}
					conversation={conversation}
				/>
			</div>
		</div>
	);
}
