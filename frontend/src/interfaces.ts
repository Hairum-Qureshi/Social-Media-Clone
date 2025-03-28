export interface CarouselImageProps {
	image: string;
	imageIndex: number;
	removeImage?: (imageIndex: number) => void;
	allowDelete: boolean;
}

export interface CarouselProps {
	images: string[];
	numImages: number;
	removeImage?: (imageIndex: number) => void;
	allowDelete: boolean;
}

export interface EditorOptionsProps {
	handleImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
	uploadedImages: string[];
	postContent: string;
	clearTextArea: () => void
}

export interface UserData {
	_id: string;
	username: string;
	fullName: string;
	email: string;
	followers: string[];
	following: string[];
	profilePicture: string;
	coverImage: string;
	bio: string;
	link: string;
	likedPosts: string[];
	numFollowers: number;
	numFollowing: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthProps {
	children: React.ReactNode;
}

export interface ContextData {
	userData: UserData | null;
}

export interface Post {
	_id: string;
	user: UserData;
	text: string;
	image: string;
	likes: string[];
	comments: Comment[];
	numLikes: number;
	numComments: number;
	createdAt: Date;
	updatedAt: Date;
	postImages: string[];
}

export interface OptionsProps {
	close: () => void;
	isOwner: boolean;
	username: string;
}

export interface PostProps {
	isOwner: boolean;
	postData: Post;
}

export interface PostData {
	postData: Post[];
	loadingStatus: boolean;
	currentUserPostData: Post[];
	postMutation: (uploadedImages: string[], postContent: string) => void;
	isPending: boolean;
}
