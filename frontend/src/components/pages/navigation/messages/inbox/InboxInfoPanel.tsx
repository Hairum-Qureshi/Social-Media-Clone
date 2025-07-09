import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../../../../../contexts/AuthContext";
import {
	InboxInfoPanelProps,
	UserData_Conversation
} from "../../../../../interfaces";
import { checkIfAdmin } from "../../../../../utils/checkIfAdmin";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

export default function InboxInfoPanel({
	conversationData
}: InboxInfoPanelProps) {
	const { userData } = useAuthContext()!;

	return (
		<div className="w-full hover:cursor-pointer text-white">
			<div className="text-xl font-semibold border-b-2 border-slate-600">
				<div className="p-4">Info</div>
			</div>
			<div className="p-2">
				{conversationData.isGroupchat &&
					checkIfAdmin(conversationData.admins, userData?._id) && (
						<button className="px-1 py-2 w-full border border-sky-500 rounded-md bg-sky-800">
							Change Group Name
						</button>
					)}
			</div>
			<div className="font-semibold border-b-2 border-slate-600 flex items-center">
				<div className="p-4 text-xl">Members</div>
				{conversationData.isGroupchat &&
					checkIfAdmin(conversationData.admins, userData?._id) && (
						<button className="border border-sky-700 rounded-md ml-auto mr-4 py-1 px-2 bg-sky-900">
							Add User
						</button>
					)}
			</div>
			<div className="p-2 text-lg">
				{conversationData.users.map((user: UserData_Conversation) => {
					return (
						<div>
							<div className="flex items-center my-2">
								<div className="w-8 h-8">
									<img
										src={user.profilePicture}
										alt="User profile picture"
										className="w-8 h-8 object-cover rounded-full border border-white"
									/>
								</div>
								<div className="ml-3 flex items-center gap-2 w-full">
									<span>{user.username}</span>
									{checkIfAdmin(conversationData.admins, user._id) && (
										<FontAwesomeIcon
											icon={faCrown}
											className="text-yellow-300"
										/>
									)}
									{!checkIfAdmin(conversationData.admins, user._id) && (
										<div
											className="ml-auto border border-sky-400 w-7 h-7 flex items-center justify-center rounded-md p-1"
											title="Make admin"
										>
											<FontAwesomeIcon icon={faCrown} className="text-white" />
											{checkIfAdmin(conversationData.admins, user._id)}
										</div>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
