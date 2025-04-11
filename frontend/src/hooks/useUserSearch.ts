import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UserSearchTools } from "../interfaces";

export default function useUserSearch(): UserSearchTools {
	const [searchedUser, setSearchedUser] = useState("");
	const [searchedUsers, setSearchedUsers] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
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

	function saveData() {
		console.log("Successfully saved data:", searchedUser);
	}

	function autosave() {
		setSaving(true);
		if (keyUpTimer.current) {
			clearTimeout(keyUpTimer.current);
		}
	
    keyUpTimer.current = window.setTimeout(() => {
        saveData();
        setSaving(false);
     }, 500); 
	}

	return {
		deleteUser,
		handleUserTag,
		searchedUser,
		searchedUsers,
		path,
		updateSearchedUser,
        autosave,
        saving,
	};
}
