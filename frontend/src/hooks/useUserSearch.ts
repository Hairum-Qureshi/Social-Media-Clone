import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UserData, UserSearchTools, UserTagData } from "../interfaces";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function useUserSearch(): UserSearchTools {
	const [searchedUser, setSearchedUser] = useState("");
	const [searchedUsers, setSearchedUsers] = useState<UserTagData[]>([]);
	const [searching, setSearching] = useState(false);
	const [returnedUsers, setReturnedUsers] = useState<UserData[]>([]);
	const keyUpTimer = useRef<number | null>(null);
	const path: string = window.location.pathname;

	function deleteUser(tagIndex: number) {
		const filteredSearchedUsers: UserTagData[] = searchedUsers.filter(
			(_, index: number) => tagIndex !== index
		);

		setSearchedUsers(filteredSearchedUsers);
	}

	function addUserTag(user: UserData) {
		// TODO you *might* want to add a character limit restriction here

		if (searchedUser.trim()) {
			if (!path.includes("/group")) {
				if (searchedUsers.length > 0) return;
				else
					setSearchedUsers([
						{
							pfp: user.profilePicture,
							fullName: user.fullName
						}
					]);

				const filterUsers = returnedUsers.filter(
					(returnedUser: UserData) => returnedUser._id !== user._id
				);

				setReturnedUsers(filterUsers);
			} else {
				const found: UserTagData | undefined = searchedUsers.find(
					(u: UserTagData) => u.fullName === user.fullName
				);

				if (!found && searchedUsers.length < 256) {
					setSearchedUsers([
						...searchedUsers,
						{
							pfp: user.profilePicture,
							fullName: user.fullName
						}
					]);
				}
			}
			setSearchedUser("");
		}
	}

	function updateSearchedUser(e?: ChangeEvent<HTMLInputElement>) {
		if (e) {
			setSearchedUser(e.target.value);
		} else {
			setSearchedUsers([]);
		}
	}

	useEffect(() => {
		if (!path.includes("/group")) updateSearchedUser();
	}, [path]);

	const { mutate } = useMutation({
		mutationFn: async ({ searchedUser }: { searchedUser: string }) => {
			try {
				const response = await axios.post(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/messages/searched-users`,
					{
						searchedUser
					},
					{
						withCredentials: true
					}
				);

				setReturnedUsers(response.data);
				return response.data;
			} catch (error) {
				console.error("Error posting:", error);
				throw new Error("Failed to create post");
			}
		}
	});

	const postMutation = () => {
		mutate({ searchedUser });
	};

	function autoSearch() {
		setSearching(true);
		if (keyUpTimer.current) {
			clearTimeout(keyUpTimer.current);
		}

		keyUpTimer.current = window.setTimeout(() => {
			postMutation();
			setSearching(false);
		}, 500);
	}

	return {
		deleteUser,
		searchedUser,
		searchedUsers,
		path,
		updateSearchedUser,
		autoSearch,
		searching,
		returnedUsers,
		addUserTag
	};
}
