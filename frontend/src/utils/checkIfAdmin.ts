import { AdminData } from "../interfaces";

export function checkIfAdmin(
	admins: AdminData[],
	currUID: string | undefined
): boolean {
	if (currUID) {
		return admins.some((admin: AdminData) => {
			return admin._id === currUID;
		});
	}

	return false;
}
