import axios from "axios";
import { UserData } from "../interfaces";

export async function blobURLToFile(
	blobURL: string,
	userData: UserData,
	uploadType: string,
	postID?: string
): Promise<File> {
	const response = await axios.get(blobURL, { responseType: "blob" });
	const blob = response.data;
	const originalFile = await fetch(blobURL).then(res => res.blob());

	if (postID && uploadType === "post") {
		return new File(
			[blob],
			`${postID}-${userData?._id}-${Math.round(
				Date.now() * Math.random() * 1e9
			)}`,
			{
				type: originalFile.type
			}
		);
	}

	if (uploadType === "profile-picture") {
		return new File([blob], `${userData?._id}-profile-picture`, {
			type: originalFile.type
		});
	}

	return new File([blob], `${userData?._id}-profile-backdrop`, {
		type: originalFile.type
	});
}
