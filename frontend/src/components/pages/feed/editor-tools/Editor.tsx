import { useRef, useState } from "react";
import EditorOptions from "./EditorOptions";
import Carousel from "./Carousel";

export default function Editor() {
	const [postContent, setPostContent] = useState("");
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const handleInput = () => {
		const textarea = textAreaRef.current;
		if (textarea) {
			textarea.style.height = "auto"; // Reset height to auto to recalculate
			textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight for dynamic resizing
		}
	};
	
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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

			if (file) {
				reader.readAsDataURL(file);
			}
		}
	}

	function removeImage(imageIndex: number) {
		const image = uploadedImages[imageIndex];
		const filteredImages = uploadedImages.filter((img: string) => img !== image);
		setUploadedImages(filteredImages);
	}

	// TODO - allow users to paste images
	return (
		<div className="border-2 border-gray-500">
			<div className="w-full rounded-md text-center h-auto">
				<div className="rounded-md ml-3 h-full">
					<div className="flex flex-col my-5">
						<div className="flex items-start w-full">
							<img
								src="https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
								alt="User pfp"
								className="lg:w-10 lg:h-10 w-12 h-12 rounded-full"
							/>
							<div className="flex flex-col w-full text-left mx-3">
								<div className="border-b-2 border-gray-500">
									<textarea
										ref={textAreaRef}
										className="bg-transparent w-full max-h-28 outline-none resize-none p-2"
										placeholder="What's happening?!"
										value={postContent}
										onChange={e => setPostContent(e.target.value)}
										onInput={handleInput}
										onPaste={e => handlePaste(e)}
									></textarea>
								</div>
								{uploadedImages.length > 0 && (
									<div className="h-60 w-full flex">
										<Carousel
											images={uploadedImages}
											numImages={uploadedImages.length}
											removeImage={removeImage}
										/>
									</div>
								)}
							</div>
						</div>

						<div className="flex items-center text-xl mt-3">
							<EditorOptions />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
