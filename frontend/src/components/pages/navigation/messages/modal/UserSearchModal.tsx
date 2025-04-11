import {
	faArrowLeft,
	faMagnifyingGlass,
	faUsers
} from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import UserCard from "../../../feed/UserCard";
import UserTag from "./UserTag";
import useUserSearch from "../../../../../hooks/useUserSearch";
import { UserSearchModalProps } from "../../../../../interfaces";

export default function UserSearchModal({ closeModal }: UserSearchModalProps) {
	const {
		deleteUser,
		handleUserTag,
		searchedUser,
		searchedUsers,
		path,
		updateSearchedUser,
		autoSearch,
		searching
	} = useUserSearch();

	// TODO - make the search user feature work
	// TODO - add a border shadow around the modal

	return (
		<div className="w-2/5 ml-20 border border-slate-700 rounded-xl h-3/4 absolute top-24 bg-black shadow-lg shadow-black flex flex-col">
			<div className="w-full p-2 text-white flex items-center my-2">
				<span className="text-xl ml-2 hover:cursor-pointer">
					{!path.includes("/group") ? (
						<FontAwesomeIcon icon={faXmark} onClick={() => closeModal()} />
					) : (
						<Link to="/messages/compose">
							<FontAwesomeIcon icon={faArrowLeft} />
						</Link>
					)}
				</span>
				<span className="font-semibold ml-10 text-xl">
					{path.includes("/group") ? "Create a group" : "New Message"}
				</span>
				<button className="ml-auto px-5 py-1 rounded-full bg-white text-black disabled:bg-gray-500 hover:cursor-pointer">
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
					onKeyDown={e => handleUserTag(e)}
					onKeyUp={autosave}
					value={searchedUser}
				/>
			</div>
			{searchedUsers.length > 0 && (
				<div className="text-white p-1 flex flex-wrap items-center w-full border-b-2 border-b-slate-700 overflow-y-auto">
					{searchedUsers.map((searchedUser: string, index: number) => {
						return (
							<UserTag
								userFullName={searchedUser}
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
				<div className="hover:bg-zinc-900 cursor-pointer p-2">
					{saving ? (
						<h1 className="text-center">Searching...</h1>
					) : (
						<UserCard
							showFollowButton={false}
							isFollowing={false}
							showFollowStatus={true}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
