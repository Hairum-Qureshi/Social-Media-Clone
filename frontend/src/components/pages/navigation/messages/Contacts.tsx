import { faEnvelope, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import UserSearchModal from "./modal/UserSearchModal";
import { useState } from "react";
import useDM from "../../../../hooks/useDM";
import DM from "./DM";
import {
	ContactsProps,
	Conversation,
	UserData_Conversation
} from "../../../../interfaces";
import useAuthContext from "../../../../contexts/AuthContext";

// TODO - may need to add specific logic for displaying group chats
// !BUG - message stuff is still appearing when you go view DM requests

export default function Contacts({ setConvo }: ContactsProps) {
	const location = useLocation();
	const [openModal, setOpenModal] = useState(
		location.pathname.includes("/compose") || false
	);
	const [activeConversationID, setActiveConversationID] = useState<
		string | null
	>(null);

	function closeModal() {
		setOpenModal(false);
	}

	const { conversations, dmRequests } = useDM();
	const { userData } = useAuthContext()!;

	const pendingCount =
		dmRequests?.reduce((count, req) => count + req.messages.length, 0) || 0;

	return (
		<>
			{openModal && <UserSearchModal closeModal={closeModal} />}
			<div>
				<div className="flex p-2">
					<h3 className="font-semibold w-full text-white text-xl m-3">
						Messages
					</h3>
					<div className="text-white inline-flex items-center text-lg">
						<span className="mr-3 hover:cursor-pointer">
							<FontAwesomeIcon icon={faGear} />
						</span>
						<Link to="/messages/compose">
							<span
								className="mr-3 hover:cursor-pointer"
								onClick={() => setOpenModal(true)}
							>
								<FontAwesomeIcon icon={faEnvelope} />
							</span>
						</Link>
					</div>
				</div>
				<Link to="/messages/requests">
					<div className="text-white flex w-full hover:bg-zinc-900 hover:cursor-pointer p-3">
						<div className="">
							<span className="mr-3 text-lg border-2 border-slate-700 rounded-full w-12 h-12 flex items-center justify-center">
								<FontAwesomeIcon icon={faEnvelope} />
							</span>
						</div>
						<div>
							<p className="flex items-center">Message Requests</p>
							<p className="text-sm text-zinc-500">
								{pendingCount === 0
									? "No Pending Requests"
									: `${pendingCount} Pending Request${
											pendingCount > 1 ? "s" : ""
									  }`}
							</p>
						</div>
					</div>
				</Link>
				<div className="text-white">
					{!conversations || conversations.length === 0 ? (
						<div className="m-10">
							<h2 className="text-4xl font-bold">Welcome to your inbox!</h2>
							<p className="text-slate-500 mt-3">
								Drop a line, share posts and more with private conversations
								between you and others on X.
							</p>
							<Link to="/messages/compose">
								<button
									className="bg-sky-500 px-8 py-4 text-lg text-white rounded-full mt-5 font-semibold"
									onClick={() => setOpenModal(true)}
								>
									Write a message
								</button>
							</Link>
						</div>
					) : (
						conversations?.map((conversation: Conversation) => {
							if (conversation.isGroupchat) {
								return (
									<Link
										to={`/messages/conversation/${conversation._id}`}
										onClick={() => setConvo(conversation)}
									>
										<DM
											username={""}
											pfp={conversation.groupPhoto}
											fullName={conversation.groupName}
											latestMessage={conversation.latestMessage}
											conversationID={conversation._id}
											activeConversationID={activeConversationID}
											setActiveConversationID={setActiveConversationID}
										/>
									</Link>
								);
							} else {
								// Find the *other* user in the DM (i.e. not the current user)
								const otherUser = conversation.users.find(
									(user: UserData_Conversation) => user._id !== userData?._id
								);

								if (!otherUser) return null;

								return (
									<Link
										to={`/messages/conversation/${conversation._id}/${userData?._id}-${otherUser._id}`}
										onClick={() => setConvo(conversation)}
									>
										<DM
											username={otherUser.username}
											pfp={otherUser.profilePicture}
											fullName={otherUser.fullName}
											latestMessage={conversation.latestMessage}
											conversationID={conversation._id}
											activeConversationID={activeConversationID}
											setActiveConversationID={setActiveConversationID}
										/>
									</Link>
								);
							}
						})
					)}
				</div>
			</div>
		</>
	);
}
