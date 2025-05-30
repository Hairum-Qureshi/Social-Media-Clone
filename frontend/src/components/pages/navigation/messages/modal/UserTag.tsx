import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserTagProps } from "../../../../../interfaces";

export default function UserTag({ profilePicture, userFullName, deleteUser, tagIndex }: UserTagProps) {
	return (
		<div className="p-1">
			<div className="flex items-center border-2 border-zinc-800 p-1 rounded-full">
				<div className="w-5 h-5 object-cover">
					<img
						src={profilePicture}
						alt="User Pfp"
						className="w-5 h-5 rounded-full"
					/>
				</div>
				<span className="text-sm ml-2">{userFullName}</span>
				<span className="text-sky-500 text-sm mr-1 ml-2 hover:cursor-pointer" onClick = {() => deleteUser(tagIndex)}>
					<FontAwesomeIcon icon={faXmark} />
				</span>
			</div>
		</div>
	);
}
