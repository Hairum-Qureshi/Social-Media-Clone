import { faUser } from "@fortawesome/free-solid-svg-icons";
import { UserCardProps } from "../../../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UserCard({
	showFollowButton = true,
	isFollowing = false,
	showFollowStatus,
	userData
}: UserCardProps) {
	// TODO - make sure to render out the verified badges too if the user is verified
	return (
		<div className="p-2">
			<div className="flex items-center justify-center">
				<img
					src={userData.profilePicture}
					alt="User pfp"
					className="lg:w-10 lg:h-10 w-12 h-12 rounded-full"
				/>
				<div className="hidden lg:flex lg:flex-col lg:w-full lg:text-left lg:ml-3">
					<span className="text-base font-bold flex justify-between items-center">
						{userData.fullName}
					</span>
					<span className="text-sm text-gray-500 font-light">
						@{userData.username}
					</span>
					{showFollowStatus
						? isFollowing && (
								<span className="text-gray-500 text-xs">
									<FontAwesomeIcon icon={faUser} />
									&nbsp; Following
								</span>
						  )
						: undefined}
				</div>
				{showFollowButton && (
					<div>
						<button className="p-2 w-20 bg-white text-black rounded-full text-sm font-bold">
							Follow
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
