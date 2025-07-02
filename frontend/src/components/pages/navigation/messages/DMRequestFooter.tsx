import { DMRequestFooterProps } from "../../../../interfaces";

export default function DMRequestFooter({ username }: DMRequestFooterProps) {
	return (
		<div className="w-full relative bg-black">
			<div className="absolute bottom-0 w-full border-2 border-slate-600 text-white p-3 bg-black">
				Do you want to let {username} message you? They won't know you've seen
				their message until you accept.
				<div className="my-3 font-semibold">
					<button className="border border-white rounded-xl w-full p-1.5">
						Accept
					</button>
					<div className="w-full flex my-3 text-red-600">
						<button className="border border-red-500 rounded-xl w-1/2 p-1.5 mr-2">
							Block or report
						</button>
						<button className="border border-red-600 rounded-xl w-1/2 p-1.5">
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
