import { UserCardProps } from "../../../interfaces";

export default function UserCard({ showFollowButton }: UserCardProps) {
	return (
		<div className="p-2">
			<div className="flex items-center justify-center">
				<img
					src="https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
					alt="User pfp"
					className="lg:w-10 lg:h-10 w-12 h-12 rounded-full"
				/>
				<div className="hidden lg:flex lg:flex-col lg:w-full lg:text-left lg:ml-3">
					<span className="text-base font-bold flex justify-between items-center">
						Username
					</span>
					<span className="text-sm text-gray-500 font-light">@username</span>
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
