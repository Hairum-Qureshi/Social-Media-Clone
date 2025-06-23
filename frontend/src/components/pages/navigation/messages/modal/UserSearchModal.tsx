import {
	faArrowLeft,
	faMagnifyingGlass,
	faUsers
} from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import UserCard from "../../../feed/UserCard";
import UserTag from "./UserTag";
import useUserSearch from "../../../../../hooks/useUserSearch";
import {
	UserData,
	UserSearchModalProps,
	UserTagData
} from "../../../../../interfaces";
import useDM from "../../../../../hooks/useDM";

export default function UserSearchModal({ closeModal }: UserSearchModalProps) {
	const {
		deleteUser,
		searchedUser,
		searchedUsers,
		path,
		updateSearchedUser,
		autoSearch,
		searching,
		returnedUsers,
		addUserTag
	} = useUserSearch();

	const navigate = useNavigate();

	const { createDM } = useDM();

	// TODO - add a border shadow around the modal

	return (
		<div className="w-2/5 ml-20 border border-slate-700 rounded-xl h-3/4 absolute top-24 bg-black shadow-lg shadow-black flex flex-col">
			<div className="w-full p-2 text-white flex items-center my-2">
				<span className="text-xl ml-2 hover:cursor-pointer">
					{!path.includes("/group") ? (
						<Link to="/messages">
							<FontAwesomeIcon
								icon={faXmark}
								onClick={() => {
									closeModal();
									if (path.includes("messages/compose")) {
										navigate("/messages", { replace: true });
									} else {
										navigate(-1);
									}
								}}
							/>
						</Link>
					) : (
						<Link to="/messages/compose">
							<FontAwesomeIcon icon={faArrowLeft} />
						</Link>
					)}
				</span>
				<span className="font-semibold ml-10 text-xl">
					{path.includes("/group") ? "Create a group" : "New Message"}
				</span>
				<button
					className="ml-auto px-5 py-1 rounded-full bg-white text-black disabled:bg-gray-500 hover:cursor-pointer"
					disabled={
						path.includes("/group")
							? searchedUsers.length < 2
							: searchedUsers.length !== 1
					}
					onClick={() => {
						createDM(searchedUsers);
						closeModal();
					}}
				>
					Next
				</button>
			</div>
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
			{searchedUsers.length !== 1 && !path.includes("/group") && (
				<Link to="/messages/compose/group">
					<div className="w-full text-white flex items-center border-b-2 border-b-slate-700 hover:bg-gray-900 hover:cursor-pointer">
						<span className="m-2 w-10 h-10 rounded-full border-2 border-gray-700 text-sky-500 inline-flex items-center justify-center">
							<FontAwesomeIcon icon={faUsers} />
						</span>
						<p className="font-semibold text-sky-500 ml-2">Create a group</p>
					</div>
				</Link>
			)}
			<div className="w-full text-white overflow-y-scroll flex-1">
				{searching || (returnedUsers.length !== 0 && searchedUser) ? (
					<>
						{searching ? (
							<h1 className="text-center">Searching...</h1>
						) : (
							returnedUsers.map((user: UserData) => (
								<div
									className="hover:bg-zinc-900 cursor-pointer p-2"
									onClick={() => addUserTag(user)}
								>
									<UserCard
										key={user._id}
										showFollowButton={false}
										isFollowing={false}
										showFollowStatus={true}
										userData={user}
									/>
								</div>
							))
						)}
					</>
				) : null}
			</div>
		</div>
	);
}
