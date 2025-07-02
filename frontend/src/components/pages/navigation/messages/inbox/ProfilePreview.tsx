import { useLocation } from "react-router-dom";
import { ProfilePreviewProps } from "../../../../../interfaces";
import checkFollowingStatus from "../../../../../utils/checkFollowingStatus";
import getFriend from "../../../../../utils/getFriend";
import getMonthAndYear from "../../../../../utils/getMonthAndYear";

export default function ProfilePreview({
	conversation,
	currUID
}: ProfilePreviewProps) {
	// TODO - add logic to remove the 'a DM request has been sent to them' message once the other user has approved their DM request

	const location = useLocation();

	return (
		<div className="p-3 w-full min-h-1/3 h-auto hover:bg-slate-800 hover:cursor-pointer">
			<div className="mt-5">
				<div className="w-full justify-center">
					<div className="flex items-center justify-center">
						<img
							src={getFriend(conversation?.users, currUID).profilePicture}
							alt="User pfp"
							className="w-20 h-20 rounded-full object-cover"
						/>
					</div>

					<div className="text-base text-center mt-2 hover:cursor-pointer">
						<p className="font-semibold">
							{getFriend(conversation?.users, currUID).fullName}
						</p>
						<p className="text-zinc-500">
							@{getFriend(conversation?.users, currUID).username}
						</p>
						<p className="my-3">
							{getFriend(conversation?.users, currUID).bio}
						</p>
						<p className="text-sm text-zinc-500 mt-2">
							Joined&nbsp;
							{
								getMonthAndYear(
									getFriend(conversation?.users, currUID).createdAt
								)?.month
							}
							&nbsp;
							{
								getMonthAndYear(
									getFriend(conversation?.users, currUID).createdAt
								)?.year
							}
							&nbsp;·&nbsp;
							{getFriend(conversation?.users, currUID).numFollowers}
							&nbsp;Follower
							{getFriend(conversation?.users, currUID).numFollowers === 0 ||
							getFriend(conversation?.users, currUID).numFollowers > 1
								? "s"
								: ""}
						</p>
						{!checkFollowingStatus(
							getFriend(conversation?.users, currUID),
							currUID
						) &&
							!location.pathname.includes("/messages/requests") && (
								<div className="bg-sky-950 mt-3 rounded-md p-1 text-base">
									@{getFriend(conversation?.users, currUID).username} isn't
									following you. A DM request has been sent to them.
								</div>
							)}
						{!checkFollowingStatus(
							getFriend(conversation?.users, currUID),
							currUID
						) &&
							location.pathname.includes("/messages/requests") && (
								<div className="bg-sky-950 mt-3 rounded-md p-1 text-base">
									@{getFriend(conversation?.users, currUID).username} isn't
									following you.
								</div>
							)}
					</div>
				</div>
			</div>
		</div>
	);
}
