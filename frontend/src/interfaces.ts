import { ChangeEvent, RefObject } from "react";

export interface CarouselImageProps {
	image: string;
	imageIndex: number;
	removeImage?: (imageIndex: number) => void;
	allowDelete: boolean;
	forPost: boolean;
}

export interface CarouselProps {
	images: string[];
	numImages: number;
	removeImage?: (imageIndex: number) => void;
	allowDelete: boolean;
	forPost: boolean;
}

export interface EditorOptionsProps {
	handleImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
	uploadedImages: string[];
	postContent: string;
	clearTextArea: () => void;
}

export interface UserData_Conversation {
	_id: string;
	username: string;
	fullName: string;
	profilePicture: string;
	isVerified: boolean;
	createdAt: Date;
	bio: string;
	numFollowers: number;
	followers: UserData[];
}

export interface Conversation {
	_id: string;
	users: UserData_Conversation[];
	isGroupchat: boolean;
	groupName: string;
	groupPhoto: string;
	media: string[];
	latestMessage: string;
	isDMRequest: boolean;
	requestedBy: UserData_Conversation;
	requestedTo: UserData_Conversation;
	messages: Message[];
}

export interface UserData {
	_id: string;
	username: string;
	fullName: string;
	email: string;
	location: string;
	followers: UserData[];
	following: UserData[];
	profilePicture: string;
	coverImage: string;
	bio: string;
	link: string;
	likedPosts: string[];
	numFollowers: number;
	numFollowing: number;
	isVerified: boolean;
	conversations: Conversation;
	createdAt: Date;
	updatedAt: Date;
}

export interface Message {
	message: string;
	sender: {
		_id: string;
		username: string;
		profilePicture: string;
	};
	attachments: string[];
	conversationID: string;
	createdAt: Date;
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
	postID: string;
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
	deleteMutation: (postID: string) => void;
	postDataByID: Post;
}

export interface UserCardProps {
	showFollowButton?: boolean;
	isFollowing?: boolean;
	showFollowStatus: boolean;
	userData: UserData;
}

export interface UserTagProps {
	profilePicture: string;
	userFullName: string;
	deleteUser: (tagIndex: number) => void;
	tagIndex: number;
}

export interface UserSearchModalProps {
	closeModal: () => void;
}

export interface UserTagData {
	pfp: string;
	fullName: string;
}

export interface UserSearchTools {
	deleteUser: (tagIndex: number) => void;
	searchedUser: string;
	searchedUsers: UserTagData[];
	path: string;
	updateSearchedUser: (e?: ChangeEvent<HTMLInputElement>) => void;
	autoSearch: () => void;
	searching: boolean;
	returnedUsers: UserData[];
	addUserTag: (user: UserData) => void;
}

export interface ProfileTools {
	postMutation: (
		fullName: string,
		username: string,
		email: string,
		currentPassword: string,
		newPassword: string,
		location: string,
		bio: string,
		link: string
	) => void;
	profileData: UserData | undefined;
	handleFollowing: (userID: string | undefined) => void;
}

export interface ContactProps {
	username: string;
	pfp: string;
	fullName: string;
	latestMessage: string;
}

export interface ConversationProps {
	defaultSubtext: string;
	showHeaderText: boolean;
	conversation: Conversation | undefined;
}

export interface InboxFooterProps {
	uploadedImage: string;
	deleteImage: () => void;
	contentEditableDivRef: RefObject<HTMLDivElement> | null;
	handlePaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
}

export interface InboxHeaderProps {
	conversation: Conversation;
	currUID: string;
}

export interface ProfilePreviewProps {
	conversation: Conversation;
	currUID: string;
}

export interface DMTools {
	createDM: (searchedUsers: UserTagData[]) => void;
	conversations: Conversation[];
	sendMessage: (
		message: string | undefined,
		uploadedImage: string,
		conversationID: string
	) => void;
	messages: Message[];
}
