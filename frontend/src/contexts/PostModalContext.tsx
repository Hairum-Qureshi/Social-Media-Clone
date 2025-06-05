import { createContext, useContext, useState } from "react";

interface PostModalContextType {
	isEditMode: boolean;
	setIsEditMode: (val: boolean) => void;
	postContent: string;
	setPostContent: (val: string) => void;
}

const PostModalContext = createContext<PostModalContextType | undefined>(
	undefined
);

export function PostModalProvider({ children }: { children: React.ReactNode }) {
	const [isEditMode, setIsEditMode] = useState(false);
	const [postContent, setPostContent] = useState("");

	return (
		<PostModalContext.Provider
			value={{
				isEditMode,
				setIsEditMode,
				postContent,
				setPostContent,
			}}
		>
			{children}
		</PostModalContext.Provider>
	);
}

export function usePostModal() {
	const context = useContext(PostModalContext);
	if (!context)
		throw new Error("usePostModal must be used inside PostModalProvider");
	return context;
}
