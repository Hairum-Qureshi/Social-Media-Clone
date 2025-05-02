import { faEnvelope, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import UserSearchModal from "./modal/UserSearchModal";
import { useState } from "react";
import useDM from "../../../../hooks/useDM";
import DM from "./DM";
import { Conversation, UserData_Conversation } from "../../../../interfaces";
import useAuthContext from "../../../../contexts/AuthContext";

// TODO - may need to add specific logic for displaying group chats
// TODO - remove hardcoded "3 pending requests" and add logic so it only displays the number of requests if the user has any requests
// !BUG - message stuff is still appearing when you go view DM requests

interface ContactsProps {
	setConvo: (conversation: Conversation) => void;
}

export default function Contacts({ setConvo }: ContactsProps) {
	const path = window.location.pathname;
	const [openModal, setOpenModal] = useState(
		path.includes("/compose") || false
	);

	function closeModal() {
		setOpenModal(false);
	}

	const { conversations } = useDM();
	const { userData } = useAuthContext()!;

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
							<p className="text-sm text-zinc-500">3 pending requests</p>
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
						conversations?.map((conversation: Conversation) =>
							conversation.users.map((user: UserData_Conversation) => {
								if (user._id !== userData?._id) {
									return (
										<Link
											to={`/messages/conversation/${conversation._id}/${userData?._id}-${user._id}`}
											onClick={() => setConvo(conversation)}
										>
											<DM
												username={user.username}
												pfp={user.profilePicture}
												fullName={user.fullName}
												latestMessage={conversation.latestMessage}
												conversationID={conversation._id}
											/>
										</Link>
									);
								}
							})
						)
					)}
				</div>
			</div>
		</>
	);
}
