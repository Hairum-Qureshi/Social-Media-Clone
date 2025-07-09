import { AdminData } from "../interfaces";

export function checkIfAdmin(
	admins: AdminData[],
	uid: string | undefined
): boolean {
	if (uid) {
		return admins.some((admin: AdminData) => {
			return admin._id === uid;
		});
	}

	return false;
}
