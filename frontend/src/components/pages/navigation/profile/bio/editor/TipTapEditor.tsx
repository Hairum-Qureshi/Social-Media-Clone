import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import useAuthContext from "../../../../../../contexts/AuthContext";
import TipTapEditorToolbar from "./TipTapEditorToolbar";
import { EditorTypes, TipTapEditorProps } from "../../../../../../interfaces";

// TODO - make the emoji button work
// ! Resolve issue where if you paste in formatted text, the div width continues to grow

export default function TipTapEditor({
	getEditorContent,
	editorFor,
	showBlockQuoteButton = true,
	showEmojiButton = true,
	showLinkButton = true,
	showTextSizesSelector = true,
	workExperienceDescription = ""
}: TipTapEditorProps) {
	const { userData } = useAuthContext()!;

	const editor = useEditor({
		extensions: [StarterKit, Link, Underline],
		editorProps: {
			attributes: {
				class: "focus:outline-none"
			}
		},
		content:
			editorFor === EditorTypes.BIO
				? userData?.extendedBio
				: editorFor === EditorTypes.WORK_HISTORY
				? workExperienceDescription
				: ""
	});

	useEffect(() => {
		if (editor) {
			getEditorContent(editor.getHTML());
		}
	}, [editor?.getHTML()]);

	useEffect(() => {
		if (editor && workExperienceDescription) {
			editor.commands.setContent(workExperienceDescription);
		}
	}, [editor, workExperienceDescription]);

	if (!editor) return null;

	return (
		<div className="w-full">
			<TipTapEditorToolbar
				editor={editor}
				showBlockQuoteButton={showBlockQuoteButton}
				showLinkButton={showLinkButton}
				showEmojiButton={showEmojiButton}
				showTextSizesSelector={showTextSizesSelector}
			/>
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
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
