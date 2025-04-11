import {
	faArrowLeft,
	faMagnifyingGlass,
	faUsers
} from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserCard from "../../../feed/UserCard";
import UserTag from "./UserTag";

interface UserSearchModalProps {
	closeModal: () => void;
}

export default function UserSearchModal({ closeModal }: UserSearchModalProps) {
	const path = window.location.pathname;
	const [searchedUser, setSearchedUser] = useState("");
	const [searchedUsers, setSearchedUsers] = useState<string[]>([]);

	// TODO - make the search user feature work
	// TODO - add a border shadow around the modal

	function deleteUser(tagIndex: number) {
		const filteredSearchedUsers: string[] = searchedUsers.filter(
			(_, index: number) => tagIndex !== index
		);

		setSearchedUsers(filteredSearchedUsers);
	}

	function handleUserTag(e: KeyboardEvent) {
		if (e.key === "Enter") {
			if (!path.includes("/group")) {
				if (searchedUsers.length > 0) return;
				else setSearchedUsers([searchedUser]);
			} else {
				const found: number = searchedUsers.indexOf(searchedUser);
				if (found === -1 && searchedUsers.length <= 256)
					setSearchedUsers([...searchedUsers, searchedUser]);
				else return;
			}

			setSearchedUser("");
		}
	}

	useEffect(() => {
		if (!path.includes("/group")) setSearchedUsers([]);
	}, [path]);

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
						setSearchedUser(e.target.value);
					}}
					onKeyUp={e => handleUserTag(e)}
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
					<UserCard
						showFollowButton={false}
						isFollowing={false}
						showFollowStatus={true}
					/>
				</div>
			</div>
		</div>
	);
}
