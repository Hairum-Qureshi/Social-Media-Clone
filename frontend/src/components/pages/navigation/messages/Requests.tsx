import useDM from "../../../../hooks/useDM";
import { DMRequest } from "../../../../interfaces";
import Conversation from "./Conversation";
import DM from "./DM";
import UserRequest from "./UserRequest";

export default function Requests() {
	const { dmRequests } = useDM();

	return (
		<div className="bg-black inline-flex w-full">
			<div className="border border-slate-600 w-5/12 flex-shrink-0">
				<UserRequest />
				{!dmRequests || !dmRequests.length ? (
					<div className="text-zinc-500 m-10">
						<p>
							Message requests from people you don't follow live here. To reply
							to their messages, you need to accept the request.
						</p>
					</div>
				) : (
					dmRequests.map((dm: DMRequest, index: number) => {
						return (
							<div className="text-white">
								<DM
									conversationID={dm.messages[index].conversationID}
									username={dm.requestedBy.username}
									pfp={dm.requestedBy.profilePicture}
									fullName={dm.requestedBy.fullName}
									latestMessage={dm.latestMessage}
								/>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
