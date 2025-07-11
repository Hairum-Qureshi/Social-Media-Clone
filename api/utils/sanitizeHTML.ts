import sanitizeHtml from "sanitize-html";

export function sanitizeEditorContent(
	content: string,
	allowedTags: string[],
	shouldAllowAttributes: boolean
): string {
	const sanitizedOutput = sanitizeHtml(content, {
		allowedTags: allowedTags,
		...(shouldAllowAttributes && {
			allowedAttributes: {
				a: ["href"]
			}
		})
	});

	return sanitizedOutput;
}