import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ContactProps {
	username: string;
	pfp: string;
	fullName: string;
}

export default function Contact({ username, pfp, fullName }: ContactProps) {
	return (
		<div className="w-full p-3 bg-zinc-800 border-r-2 border-r-sky-600 hover:bg-zinc-900 hover:cursor-pointer">
			<div className="flex items-center">
				<div className="w-10 h-10 rounded-full flex-shrink-0">
					<img
						src={pfp}
						alt="User pfp"
						className="w-10 h-10 rounded-full object-cover"
					/>
				</div>
				<div className="w-full">
					<div className="ml-3 -mt-1 flex">
						{fullName}&nbsp;<span className="text-gray-500">@{username}</span>
						<div className="ml-auto">
							<FontAwesomeIcon icon={faEllipsis} />
						</div>
					</div>
					<div className="ml-3 text-gray-500">Text</div>
				</div>
			</div>
		</div>
	);
}
