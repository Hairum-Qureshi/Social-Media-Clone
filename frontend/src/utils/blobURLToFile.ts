import axios from "axios";

export async function blobURLToFile(
	blobURL: string,
	userID: string,
	uploadType: string,
	postID?: string
): Promise<File> {
	const response = await axios.get(blobURL, { responseType: "blob" });
	const blob = response.data;
	const originalFile = await fetch(blobURL).then(res => res.blob());

	if (postID && uploadType === "post") {
		return new File(
			[blob],
			`${postID}-${userID}-${Math.round(
				Date.now() * Math.random() * 1e9
			)}`,
			{
				type: originalFile.type
			}
		);
	}

	if (uploadType === "profile-picture") {
		return new File([blob], `${userID}-profile-picture`, {
			type: originalFile.type
		});
	}

	return new File([blob], `${userID}-backdrop`, {
		type: originalFile.type
	});
}
