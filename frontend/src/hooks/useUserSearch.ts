import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UserData, UserSearchTools } from "../interfaces";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function useUserSearch(): UserSearchTools {
	const [searchedUser, setSearchedUser] = useState("");
	const [searchedUsers, setSearchedUsers] = useState<string[]>([]);
	const [searching, setSearching] = useState(false);
    const [returnedUsers, setReturnedUsers] = useState<UserData[]>([]); 
	const keyUpTimer = useRef<number | null>(null);
	const path: string = window.location.pathname;

	function deleteUser(tagIndex: number) {
		const filteredSearchedUsers: string[] = searchedUsers.filter(
			(_, index: number) => tagIndex !== index
		);

		setSearchedUsers(filteredSearchedUsers);
	}

	function handleUserTag(e: KeyboardEvent) {
		// TODO you *might* want to add a character limit restriction here
		if (e.key === "Enter" && searchedUser.trim()) {
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
		handleUserTag,
		searchedUser,
		searchedUsers,
		path,
		updateSearchedUser,
		autoSearch,
		searching,
        returnedUsers
	};
}
