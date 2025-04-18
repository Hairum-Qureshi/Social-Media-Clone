import { ProfilePreviewProps } from "../../../../../interfaces";
import getFriend from "../../../../../utils/getFriend";
import getMonthAndYear from "../../../../../utils/getMonthAndYear";

export default function ProfilePreview({
	conversation,
	currUID
}: ProfilePreviewProps) {
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
					</div>
				</div>
			</div>
		</div>
	);
}
