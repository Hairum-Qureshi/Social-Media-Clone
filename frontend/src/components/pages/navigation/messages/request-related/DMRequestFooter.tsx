import { Link } from "react-router-dom";
import { DMRequestFooterProps } from "../../../../../interfaces";
import useDM from "../../../../../hooks/useDM";

// ! - for group chats, you *might* need to have 'requestedByUID' as of type string[] instead of just string
export default function DMRequestFooter({
	dmRequestID,
	dmRequestData,
	currUID
}: DMRequestFooterProps) {
	const { acceptDMRequest } = useDM();

	return (
		<div className="w-full relative bg-black">
			<div className="absolute bottom-0 w-full border-2 border-slate-600 text-white p-3 bg-black">
				{dmRequestData.isGroupchat
					? `${dmRequestData.requestedBy.fullName} has requested to add you to a group chat. Do you want to join? They won't know you've seen their message until you accept.`
					: `Do you want to let ${dmRequestData.requestedBy.username} message you? They won't know you've seen
				their message until you accept.`}
				<div className="my-3 font-semibold">
					<Link
						to={`/messages/conversation/${dmRequestID}/${dmRequestData.requestedBy._id}-${currUID}`}
					>
						<button
							className="border border-white rounded-xl w-full p-1.5"
							onClick={() => acceptDMRequest(dmRequestID)}
						>
							Accept
						</button>
					</Link>
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
