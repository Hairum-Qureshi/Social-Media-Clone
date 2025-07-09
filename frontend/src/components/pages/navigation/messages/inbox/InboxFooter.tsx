import {
	faFaceSmile,
	faFilm,
	faImage,
	faPaperPlane,
	faX
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	InboxFooterProps,
	UserData_Conversation
} from "../../../../../interfaces";
import { useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import useDM from "../../../../../hooks/dms-related/useDM";
import useSocketContext from "../../../../../contexts/SocketIOContext";
import useAuthContext from "../../../../../contexts/AuthContext";

export default function InboxFooter({
	uploadedImage,
	deleteImage,
	contentEditableDivRef,
	handlePaste,
	members
}: InboxFooterProps) {
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const { sendMessage } = useDM();
	const pathname = window.location.pathname.split("/");
	const [messageContent, setMessageContent] = useState("");
	const { userData } = useAuthContext()!;
	const { handleTypingIndicator, userIsTyping, typingUser } =
		useSocketContext()!;

	function handleInput() {
		setMessageContent(contentEditableDivRef?.current?.textContent || "");
	}

	function clearMessageContent() {
		if (contentEditableDivRef && contentEditableDivRef.current) {
			contentEditableDivRef.current.textContent = "";
		}

		setMessageContent("");
	}

	function addEmoji(emojiData: EmojiClickData) {
		const messageWithEmojis = !messageContent
			? emojiData.emoji
			: `${messageContent} ${emojiData.emoji}`;
		setMessageContent(messageWithEmojis);

		if (contentEditableDivRef?.current) {
			contentEditableDivRef.current.innerText = messageWithEmojis;
		}
	}

	return (
		<div className="w-full relative">
			<div className="absolute bottom-0 w-full">
				{userIsTyping && typingUser && (
					<p className="text-white text-lg">@{typingUser} is typing...</p>
				)}
				{uploadedImage && (
					<div className="w-full bg-zinc-900">
						<div className="relative w-fit p-2 rounded">
							<button
								className="absolute top-3 right-3 text-white bg-zinc-800 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
								onClick={() => deleteImage()}
								title="Remove image button"
							>
								<FontAwesomeIcon icon={faX} />
							</button>
							<img
								src={uploadedImage}
								alt="Uploaded image"
								className="max-w-[160px] max-h-[160px] w-auto h-auto object-contain rounded"
							/>
						</div>
					</div>
				)}
				{showEmojiPicker && (
					<EmojiPicker
						theme={"dark"}
						onEmojiClick={emojiData => addEmoji(emojiData)}
					/>
				)}
				<div className="w-full">
					<div className="flex mx-1 p-2 bg-zinc-900 rounded-md items-center">
						{!uploadedImage && (
							<div className="text-base text-sky-400 w-24">
								<span className="mr-3 hover:cursor-pointer">
									<FontAwesomeIcon icon={faImage} />
								</span>
								<span className="mr-3 hover:cursor-pointer">
									<FontAwesomeIcon icon={faFilm} />
								</span>
								<span
									className="hover:cursor-pointer"
									onClick={() => setShowEmojiPicker(!showEmojiPicker)}
								>
									<FontAwesomeIcon icon={faFaceSmile} />
								</span>
							</div>
						)}
						<div
							contentEditable="plaintext-only"
							className="w-full ml-2 mr-2 px-2 py-1 min-h-[2rem] max-h-40 overflow-y-auto break-words resize-none outline-none rounded"
							onInput={e => {
								const target = e.currentTarget as HTMLDivElement;
								target.style.height = "auto";
								target.style.height = Math.min(target.scrollHeight, 160) + "px";
								handleInput();
								handleTypingIndicator(
									pathname[3],
									members.map((user: UserData_Conversation) => user._id),
									userData?._id
								);
							}}
							onKeyDown={e => {
								if (e.key === "Enter" && !e.shiftKey) {
									sendMessage(messageContent, uploadedImage, pathname[3]);
									e.preventDefault();
									deleteImage();
									clearMessageContent();
									(e.currentTarget as HTMLDivElement).style.height = "auto";
								}
							}}
							data-placeholder="Write a new message"
							ref={contentEditableDivRef}
							onPaste={e => handlePaste(e)}
						/>
						<div
							className="ml-auto text-sky-500 hover:cursor-pointer"
							onClick={() => {
								sendMessage(messageContent, uploadedImage, pathname[3]);
								clearMessageContent();
							}}
						>
							<FontAwesomeIcon icon={faPaperPlane} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
