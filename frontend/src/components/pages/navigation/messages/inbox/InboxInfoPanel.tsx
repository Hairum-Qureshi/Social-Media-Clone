import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../../../../../contexts/AuthContext";
import {
	InboxInfoPanelProps,
	UserData_Conversation
} from "../../../../../interfaces";
import { checkIfAdmin } from "../../../../../utils/checkIfAdmin";
import { faBan, faCrown } from "@fortawesome/free-solid-svg-icons";
import useSocketContext from "../../../../../contexts/SocketIOContext";
import livePulseGIF from "../../../../../assets/green-live-pulse.gif";
import useGroupchat from "../../../../../hooks/dms-related/useGroupchat";
import { useNavigate } from "react-router-dom";

export default function InboxInfoPanel({
	conversationData
}: InboxInfoPanelProps) {
	const { userData } = useAuthContext()!;
	const { activeUsers } = useSocketContext()!;
	const navigate = useNavigate();
	// TODO - in the future, have it display all the images/videos sent in the group chat
	// TODO - add buttons to undo giving someone admin

	const { makeAdmin, leaveGroupChat, removeUserFromGroupChat } = useGroupchat();

	return (
		<div className="text-white relative h-full overflow-y-auto">
			<div className="text-xl font-semibold border-b-2 border-slate-600">
				<div className="p-4">Info</div>
			</div>
			<div className="p-2 pb-4">
				{conversationData.isGroupchat && (
					<>
						<h3 className="font-semibold text-lg text-center">
							{conversationData.groupName}
						</h3>
						<div className="mt-2 mb-4 rounded-full flex items-center justify-center w-full">
							<img
								src={conversationData.groupPhoto}
								alt="Group chat photo"
								className="w-24 h-24 rounded-full object-cover border border-white"
							/>
						</div>
					</>
				)}

				{conversationData.isGroupchat &&
					checkIfAdmin(conversationData.admins, userData?._id) && (
						<>
							<div className="mb-4">
								<button className="px-1 py-1.5 w-full border border-purple-500 rounded-md bg-purple-900">
									Change Group Photo
								</button>
							</div>
							<div>
								<button className="px-1 py-1.5 w-full border border-sky-500 rounded-md bg-sky-800">
									Change Group Name
								</button>
							</div>
						</>
					)}
			</div>
			<div className="font-semibold border-b-2 border-slate-600 flex items-center">
				<div
					className={`p-4 text-xl ${
						!checkIfAdmin(conversationData.admins, userData?._id) && "-mt-8"
					}`}
				>
					Members ({conversationData.users.length})
				</div>
				{conversationData.isGroupchat &&
					checkIfAdmin(conversationData.admins, userData?._id) && (
						<button className="border border-sky-700 rounded-md ml-auto mr-4 py-1 px-2 bg-sky-900">
							Add User
						</button>
					)}
			</div>
			<div className="p-2 text-lg">
				{conversationData.users.map((user: UserData_Conversation) => (
					<div key={user._id} className="flex items-center my-2">
						<img
							src={user.profilePicture}
							alt="User profile picture"
							className="w-8 h-8 object-cover rounded-full border border-white shrink-0"
						/>
						<div className="ml-3 flex items-center gap-2 w-full">
							<span>@{user.username}</span>
							{checkIfAdmin(conversationData.admins, user._id) && (
								<FontAwesomeIcon icon={faCrown} className="text-yellow-300" />
							)}
							{activeUsers.includes(user._id) && (
								<img
									src={livePulseGIF}
									alt="Live status pulse GIF"
									className="w-5 h-5 object-cover"
								/>
							)}
							{checkIfAdmin(conversationData.admins, userData?._id) && // current user is admin
								!checkIfAdmin(conversationData.admins, user._id) && ( // target user is not admin
									<div className="ml-auto flex">
										<div
											className="border border-red-500 w-7 h-7 flex items-center justify-center rounded-md p-1 text-red-500 mr-2 hover:cursor-pointer"
											title="Kick user"
											onClick={() =>
												removeUserFromGroupChat(conversationData._id, user._id)
											}
										>
											<FontAwesomeIcon icon={faBan} />
										</div>
										<div
											className="border border-sky-400 w-7 h-7 flex items-center justify-center rounded-md p-1 hover:cursor-pointer"
											title="Make admin"
											onClick={() => makeAdmin(conversationData._id, user._id)}
										>
											<FontAwesomeIcon icon={faCrown} className="text-white" />
										</div>
									</div>
								)}
						</div>
					</div>
				))}
			</div>
			<div className="absolute bottom-0 w-full border-t-2 border-slate-600 bg-black h-32 mb-3">
				<div className="p-3">
					{conversationData.isGroupchat && (
						<div>
							<p
								className="font-semibold text-red-600 text-base"
								onClick={() => {
									leaveGroupChat(conversationData._id);
									navigate("/messages");
								}}
							>
								Leave Group
							</p>
							<p className="text-slate-400 text-xs my-2">
								You won't be able to send or receive messages unless someone
								adds you back to the chat.
							</p>
						</div>
					)}
					<div>
						<p className="font-semibold text-red-600 text-base">Delete Chat</p>
						<p className="text-slate-400 text-xs my-2">
							This will not delete the chat for everyone, it will only delete
							the chat from your list of conversations. If another user sends a
							message in the chat, it will reappear in your inbox.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
