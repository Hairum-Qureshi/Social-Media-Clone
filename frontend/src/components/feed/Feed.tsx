import { useState } from "react";
import SideNavbar from "./SideNavbar";

export default function Landing() {
	const [isForYou, setIsForYou] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);

	return (
		<div className="bg-black text-white h-screen w-full flex">
			<SideNavbar />
			<div className="lg:w-1/2 w-full bg-black h-screen">
				<div className="border-b-2 border-gray-500 h-14 flex text-center hover:cursor-pointer font-bold">
					<div
						className={`w-1/2 flex items-center justify-center hover:bg-gray-900 ${
							isForYou && "border-b-2 border-sky-500"
						}`}
						onClick={() => {
							setIsForYou(true);
							setIsFollowing(false);
						}}
					>
						For You
					</div>
					<div
						className={`w-1/2 flex items-center justify-center hover:bg-gray-900 ${
							isFollowing && "border-b-2 border-sky-500"
						}`}
						onClick={() => {
							setIsForYou(false);
							setIsFollowing(true);
						}}
					>
						Following
					</div>
				</div>
			</div>
			<div className="lg:w-1/4 w-32 bg-black border-l-2 border-l-gray-700 h-screen"></div>
		</div>
	);
}
