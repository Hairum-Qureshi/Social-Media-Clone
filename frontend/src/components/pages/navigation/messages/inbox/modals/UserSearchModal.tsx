import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUserSearch from "../../../../../../hooks/useUserSearch";
import UserTag from "../../modal/UserTag";
import {
	UserData,
	UserData_Conversation,
	UserSearchModalConvoProps,
	UserTagData
} from "../../../../../../interfaces";
import UserCard from "../../../../feed/UserCard";
import useGroupChat from "../../../../../../hooks/dms-related/useGroupchat";

export default function UserSearchModal({
	conversationID,
	showSearchModal,
	conversation
}: UserSearchModalConvoProps) {
	const {
		deleteUser,
		searchedUser,
		searchedUsers,
		updateSearchedUser,
		autoSearch,
		searching,
		returnedUsers,
		addUserTag
	} = useUserSearch();

	// TODO - consider having it so that it doesn't render [user is already in convo] messages for every user and instead just the latest that the user searched

	const { addSearchedUsers } = useGroupChat();

	return (
		<div
			className="absolute z-20 bg-black top-20 w-1/3 border-2 border-gray-600 right-20 p-4 rounded"
			style={{
				boxShadow: "0 0 20px 4px rgba(75, 85, 99, 0.5)"
			}}
		>
			<div className="text-white text-lg font-semibold mb-2">Add Users</div>
			<div className="w-full text-white flex items-center border-b-2 border-b-slate-700">
				<span className="text-sky-500 mx-4 text-lg">
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</span>
				<input
					type="text"
					className="w-full p-2 placeholder-gray-500 text-base outline-none bg-transparent"
					placeholder="Search people"
					onChange={e => {
						updateSearchedUser(e);
					}}
					onKeyUp={autoSearch}
					value={searchedUser}
				/>
			</div>
			{searchedUsers.length > 0 && (
				<div className="text-white p-1 flex flex-wrap items-center w-full border-b-2 border-b-slate-700 overflow-y-auto">
					{searchedUsers.map((searchedUser: UserTagData, index: number) => {
						return (
							<UserTag
								profilePicture={searchedUser.pfp}
								userFullName={searchedUser.fullName}
								deleteUser={deleteUser}
								tagIndex={index}
							/>
						);
					})}
				</div>
			)}
			<div className="w-full min-h-64 max-h-auto text-white overflow-y-scroll flex-1">
				{searching || (returnedUsers.length !== 0 && searchedUser) ? (
					<>
						{searching ? (
							<h1 className="text-center mt-5">Searching...</h1>
						) : (
							returnedUsers.map((user: UserData) => {
								const isAlreadyInConversation = conversation.users.some(
									(convUser: UserData_Conversation) => convUser._id === user._id
								);

								if (!isAlreadyInConversation) {
									return (
										<div
											key={user._id}
											className="hover:bg-zinc-900 cursor-pointer p-2"
											onClick={() => addUserTag(user, true)}
										>
											<UserCard
												showFollowButton={false}
												isFollowing={false}
												showFollowStatus={true}
												userData={user}
											/>
										</div>
									);
								} else {
									return (
										<p className="my-3 text-center font-semibold bg-zinc-900 p-2">
											@{user.username} is already in this group
										</p>
									);
								}
							})
						)}
					</>
				) : null}
			</div>
			<div className="flex justify-end mt-3">
				<button
					className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
					onClick={() => {
						addSearchedUsers(conversationID, searchedUsers);
						showSearchModal(false);
					}}
				>
					Add user(s)
				</button>
				<button
					className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
					onClick={() => showSearchModal(false)}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
