import { useRef, useState } from "react";
import EditorOptions from "./EditorOptions";
import Carousel from "./carousel/Carousel";
import { EditorProps } from "../../../../interfaces";
import useAuthContext from "../../../../contexts/AuthContext";
import moment from "moment";

// TODO - need to resolve image aspect ratio when uploading images
// TODO - if the user hasn't typed anything yet, disable the "POST" button too
// TODO - instead of alerting the user they can only have a max of 4 images, disable the GIF and image icon
// TODO - move all this logic to a custom hook

export default function Editor({
	showBorder = true,
	placeHolder = "What's Happening?!",
	buttonText = "POST",
	content = "",
	isForRetweet = false,
	retweetPostData = null
}: EditorProps) {
	const [postContent, setPostContent] = useState(content || "");
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const { userData } = useAuthContext()!;

	const handleInput = () => {
		const textarea = textAreaRef.current;
		if (textarea) {
			textarea.style.height = "auto"; // Reset height to auto to recalculate
			textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight for dynamic resizing
		}
	};

	function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
		const image = e.clipboardData || window.Clipboard;
		const file = image.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				const blob = new Blob([file], { type: file.type });
				const imageURL = URL.createObjectURL(blob);
				if (uploadedImages.length < 4) {
					setUploadedImages(prev => [...prev, imageURL]);
				} else {
					alert("You can only attach 4 images per post");
				}
			};

			reader.readAsDataURL(file);
		}
	}

	function removeImage(imageIndex: number) {
		const filteredImages = uploadedImages.filter(
			(_, index) => index !== imageIndex
		);
		setUploadedImages(filteredImages);
	}

	function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
		const files: FileList | null = event.target.files;
		if (files) {
			const blobURL = window.URL.createObjectURL(files[0]);
			setUploadedImages(prev => [...prev, blobURL]);
			event.target.value = ""; // Resets input to allow duplicate uploads consecutively
		}
	}

	function clearTextArea() {
		setPostContent("");
		setUploadedImages([]);
	}

	// TODO - allow users to paste images
	return (
		<div className={`${showBorder && "border-2 border-gray-500"}`}>
			<div className="w-full rounded-md text-center h-auto">
				<div className="rounded-md ml-3 h-full">
					<div className="flex flex-col my-5">
						<div className="flex items-start w-full">
							<img
								src={userData?.profilePicture}
								alt="User pfp"
								className="lg:w-10 lg:h-10 w-12 h-12 rounded-full"
							/>
							<div className="flex flex-col w-full text-left mx-3">
								<div
									className={`${showBorder && "border-b-2 border-gray-500"}`}
								>
									<textarea
										ref={textAreaRef}
										className="bg-transparent w-full max-h-28 outline-none resize-none p-2"
										placeholder={placeHolder}
										value={postContent}
										onChange={e => setPostContent(e.target.value)}
										onInput={handleInput}
										onPaste={e => handlePaste(e)}
									></textarea>
								</div>
								{isForRetweet && (
									<div className="border border-slate-600 rounded-lg">
										<div className="w-full p-2 flex items-center">
											<img
												src={retweetPostData?.user?.profilePicture}
												alt="User Profile Picture"
												className="w-8 h-8 rounded-full object-cover"
											/>
											<div className="flex text-base text-slate-500">
												<p className="font-semibold ml-3 text-white">
													{retweetPostData?.user?.fullName}
												</p>
												<p className="ml-2">
													@{retweetPostData?.user?.username}
												</p>
												&nbsp;·
												<p>
													&nbsp;
													{moment(
														retweetPostData?.createdAt?.toString()
													).fromNow()}
												</p>
											</div>
										</div>
										<div className="w-full border-t border-t-slate-600 min-h-auto max-h-80 p-3 overflow-hidden">
											{retweetPostData?.text}
											{retweetPostData &&
												retweetPostData?.postImages?.length > 0 && (
													<div className="">
														<Carousel
															images={retweetPostData?.postImages}
															numImages={retweetPostData?.postImages.length}
															allowDelete={false}
															forPost={true}
														/>
													</div>
												)}
										</div>
									</div>
								)}
								{uploadedImages.length > 0 && (
									<div className="w-full flex">
										<Carousel
											images={uploadedImages}
											numImages={uploadedImages.length}
											removeImage={removeImage}
											allowDelete={true}
											forPost={false}
											forEditor={true}
										/>
									</div>
								)}
							</div>
						</div>
						<div className="flex items-center text-xl mt-3 text-sky-400">
							<EditorOptions
								handleImage={handleImage}
								uploadedImages={uploadedImages}
								postContent={postContent}
								clearTextArea={clearTextArea}
								buttonText={buttonText}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
