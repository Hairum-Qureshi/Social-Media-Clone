import Contacts from "./Contacts";
import Conversation from "./Conversation";

export default function Messages() {
	return (
		<div className = "bg-black inline-flex w-full">
			<div className="border border-slate-600 w-2/5">
				<Contacts />
			</div>
			<div className = "text-white border border-slate-600 flex-grow">
				<Conversation />
			</div>
		</div>
	);
}
