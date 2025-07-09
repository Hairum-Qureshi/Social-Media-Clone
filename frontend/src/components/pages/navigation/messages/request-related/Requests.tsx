import { Link } from "react-router-dom";
import useDM from "../../../../../hooks/useDM";
import { DMRequest } from "../../../../../interfaces";
import DM from "../DM";
import UserRequest from "./UserRequest";
import useAuthContext from "../../../../../contexts/AuthContext";
import Conversation from "../Conversation";
import { useState } from "react";

export default function Requests() {
	const { dmRequests } = useDM();
	const { userData } = useAuthContext()!;
	const [dmRequest, setDMRequest] = useState<DMRequest>();

	const filteredDMRequests = dmRequests?.filter(
		(dmRequest: DMRequest) => dmRequest.messages.length !== 0
	);

	return (
		<div className="bg-black inline-flex w-full">
			<div className="border border-slate-600 w-5/12 flex-shrink-0">
				<UserRequest />
				{!filteredDMRequests || !filteredDMRequests.length ? (
					<div className="text-zinc-500 m-10">
						<p>
							Message requests from people you don't follow live here. To reply
							to their messages, you need to accept the request.
						</p>
					</div>
				) : (
					dmRequests?.map((dm: DMRequest) => {
						if (dm.messages.length) {
							return (
								<div className="text-white">
									<Link
										to={dm.isGroupchat ? `/messages/requests/${dm.messages[0].conversationID}` : `/messages/requests/${dm.messages[0].conversationID}/${dm.requestedBy._id}-${userData?._id}`}
										onClick={() => setDMRequest(dm)}
									>
										<DM
											conversationID={dm.messages[0].conversationID}
											username={dm.isGroupchat ? "" : dm.requestedBy.username}
											pfp={
												dm.isGroupchat
													? dm.groupPhoto!
													: dm.requestedBy.profilePicture
											}
											fullName={
												dm.isGroupchat ? dm.groupName! : dm.requestedBy.fullName
											}
											latestMessage={dm.latestMessage}
										/>
									</Link>
								</div>
							);
						}
					})
				)}
			</div>
			<div className="text-white border border-slate-600 w-[625px]">
				<Conversation
					defaultSubtext={""}
					showHeaderText={!dmRequest ? true : false}
					conversation={dmRequest}
					isDMRequest={true}
				/>
			</div>
		</div>
	);
}
