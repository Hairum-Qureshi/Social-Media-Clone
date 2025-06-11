import {
	faBold,
	faItalic,
	faStrikethrough,
	faQuoteRight,
	faList,
	faListOl,
	faLink,
	faFaceSmile,
	faChevronDown,
	faCheck,
	faUnderline
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState } from "react";
import useAuthContext from "../../../../../contexts/AuthContext";

// TODO - make the emoji button work
// ! Resolve issue where if you paste in formatted text, the div width continues to grow

interface TipTapEditorProps {
	getEditorContent: (content: string) => void;
}

export default function TipTapEditor({ getEditorContent }: TipTapEditorProps) {
	const [showTextSizes, setTextSizes] = useState(false);
	const [currentTextSizeChosen, setCurrentTextSizeChosen] = useState("Body");
	const [showLinkCreator, setShowLinkCreator] = useState(false);
	const [linkURL, setLinkURL] = useState("");
	const { userData } = useAuthContext()!;

	const editor = useEditor({
		extensions: [StarterKit, Link, Underline],
		editorProps: {
			attributes: {
				class: "focus:outline-none h-full"
			}
		},
		content: userData?.extendedBio || ""
	});

	useEffect(() => {
		if (editor) {
			getEditorContent(editor.getHTML());
		}
	}, [editor?.getHTML()]);

	if (!editor) return null;

	function applyLink(editor: Editor) {
		if (linkURL.trim() === "") {
			editor.chain().focus().unsetLink().run();
		} else {
			editor.chain().focus().setLink({ href: linkURL.trim() }).run();
		}
		setShowLinkCreator(false);
		setLinkURL("");
	}

	return (
		<div className="w-full">
			<div className="flex items-center">
				<button
					className="text-slate-600 ml-3 hover:cursor-pointer text-base"
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					title="Bold"
				>
					<FontAwesomeIcon
						icon={faBold}
						className={`p-1 mt-2 ${
							editor.isActive("bold") ? "text-sky-500" : "hover:text-slate-500"
						}`}
					/>
				</button>
				<button
					className="text-slate-600 ml-3 hover:cursor-pointer text-base"
					title="Italic"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
				>
					<FontAwesomeIcon
						icon={faItalic}
						className={`p-1 mt-2 ${
							editor.isActive("italic")
								? "text-sky-500"
								: "hover:text-slate-500"
						}`}
					/>
				</button>
				<button
					className="text-slate-600 ml-3 hover:cursor-pointer text-base"
					title="Strikethrough"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
				>
					<FontAwesomeIcon
						icon={faStrikethrough}
						className={`p-1 mt-2 ${
							editor.isActive("strike")
								? "text-sky-500"
								: "hover:text-slate-500"
						}`}
					/>
				</button>
				<button
					className="text-slate-600 ml-3 hover:cursor-pointer text-base"
					title="Underline"
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					disabled={!editor.can().chain().focus().toggleUnderline().run()}
				>
					<FontAwesomeIcon
						icon={faUnderline}
						className={`p-1 mt-2 ${
							editor.isActive("underline")
								? "text-sky-500"
								: "hover:text-slate-500"
						}`}
					/>
				</button>
				<button
					className="text-slate-600 ml-3 hover:cursor-pointer text-base"
					title="Quote"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					disabled={!editor.can().chain().focus().toggleBlockquote().run()}
				>
					<FontAwesomeIcon
						icon={faQuoteRight}
						className={`p-1 mt-2 ${
							editor.isActive("blockquote")
								? "text-sky-500"
								: "hover:text-slate-500"
						}`}
					/>
				</button>
				<button
					className="text-slate-600 ml-3 hover:cursor-pointer text-base"
					title="Bullet list"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					disabled={!editor.can().chain().focus().toggleBulletList().run()}
				>
					<FontAwesomeIcon
						icon={faList}
						className={`p-1 mt-2 ${
							editor.isActive("bulletList")
								? "text-sky-500"
								: "hover:text-slate-500"
						}`}
					/>
				</button>
				<button
					className="text-slate-600 ml-3 hover:cursor-pointer text-base"
					title="Numbered list"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
				>
					<FontAwesomeIcon
						icon={faListOl}
						className={`p-1 mt-2 ${
							editor.isActive("orderedList")
								? "text-sky-500"
								: "hover:text-slate-500"
						}`}
					/>
				</button>
				<>
					<button
						className="text-slate-600 ml-3 hover:cursor-pointer text-base"
						title="Link"
						onClick={() => setShowLinkCreator(!showLinkCreator)}
						disabled={
							!editor.can().chain().focus().setLink({ href: "https://" }).run()
						}
					>
						<FontAwesomeIcon
							icon={faLink}
							className={`p-1 mt-2 ${
								editor.isActive("link")
									? "text-sky-500"
									: "hover:text-slate-500"
							}`}
						/>
					</button>
					{showLinkCreator && (
						<div className="bg-black border border-zinc-700 py-1 px-2 h-auto absolute top-40 right-5 rounded-md text-sm text-white shadow-[0_0_10px_rgba(255,255,255,0.4)] w-3/5 z-20">
							<input
								type="text"
								className="w-full p-1 bg-black border border-slate-600 rounded-md outline-none"
								placeholder="Enter Link"
								value={linkURL}
								onChange={e => setLinkURL(e.target.value)}
								onKeyDown={e => {
									if (e.key === "Enter") {
										e.preventDefault();
										applyLink(editor);
									} else if (e.key === "Escape") {
										setShowLinkCreator(false);
										setLinkURL("");
									}
								}}
								autoFocus
							/>
						</div>
					)}
				</>
				<button
					className="text-slate-600 ml-3 hover:cursor-pointer text-base"
					title="Emojis"
					// onClick={() => editor.chain().focus().toggleEmoji().run()}
					// disabled={!editor.can().chain().focus().toggleEmoji().run()}
				>
					<FontAwesomeIcon
						icon={faFaceSmile}
						className={`p-1 mt-2 ${
							editor.isActive("emoji") ? "text-sky-500" : "hover:text-slate-500"
						}`}
					/>
				</button>
				<span
					className="mt-1 ml-4 w-2/12 text-slate-600 hover:cursor-pointer text-base flex items-center"
					onClick={() => setTextSizes(!showTextSizes)}
				>
					{currentTextSizeChosen}
					<span className="ml-auto hover:text-slate-500 ">
						<FontAwesomeIcon icon={faChevronDown} />
					</span>
					{showTextSizes && (
						<div className="bg-black z-10 font-bold border border-zinc-700 py-3 px-2 h-auto absolute top-32 rounded-md text-sm text-white shadow-[0_0_10px_rgba(255,255,255,0.4)]">
							<h2
								className="text-xl mb-1 flex items-center hover:cursor-pointer"
								onClick={() => {
									setCurrentTextSizeChosen("Heading");
									setTextSizes(false);
									editor.chain().focus().toggleHeading({ level: 1 }).run();
								}}
							>
								<span className="mr-6">Heading</span>
								{currentTextSizeChosen === "Heading" && (
									<span className="ml-auto text-base">
										<FontAwesomeIcon icon={faCheck} />
									</span>
								)}
							</h2>
							<h3
								className="text-lg mb-1 flex items-center hover:cursor-pointer"
								onClick={() => {
									setCurrentTextSizeChosen("Subheading");
									setTextSizes(false);
									editor.chain().focus().toggleHeading({ level: 3 }).run();
								}}
							>
								<span className="mr-6">Subheading</span>
								{currentTextSizeChosen === "Subheading" && (
									<span className="ml-auto text-base">
										<FontAwesomeIcon icon={faCheck} />
									</span>
								)}
							</h3>
							<p
								className="text-base flex items-center hover:cursor-pointer"
								onClick={() => {
									setCurrentTextSizeChosen("Body");
									setTextSizes(false);
									editor.chain().focus().setParagraph().run();
								}}
							>
								<span className="mr-6">Body</span>
								{currentTextSizeChosen === "Body" && (
									<span className="ml-auto text-base">
										<FontAwesomeIcon icon={faCheck} />
									</span>
								)}
							</p>
						</div>
					)}
				</span>
				<span className="flex items-center ml-auto text-base text-slate-500 mr-3">
					{editor.getText().length} Characters
				</span>
			</div>
			<div
				className="text-white mx-4 mt-3 leading-5 h-72 overflow-y-auto
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-4
                [&_p]:mb-2
                [&_blockquote]:pl-4 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:italic [&_blockquote]:text-slate-400
                [&_ul]:list-disc [&_ul]:pl-6
                [&_ol]:list-decimal [&_ol]:pl-6
                [&_li]:mb-1
                [&_a]:text-sky-400 [&_a]:underline [&_a]:hover:text-sky-300"
			>
				<EditorContent editor={editor} className="h-full w-full" />
			</div>
		</div>
	);
}
