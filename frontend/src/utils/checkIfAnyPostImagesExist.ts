export function checkIfAnyPostImagesExist(
	postsImages: { _id: string; postImages: string[] }[]
): boolean {
	if (postsImages.length > 0) {
		return postsImages.some(postImage => postImage.postImages.length > 0);
	}
	return false;
}
