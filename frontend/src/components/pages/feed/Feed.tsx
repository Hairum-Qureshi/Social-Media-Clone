import { useState } from "react";
import Editor from "./editor-tools/Editor";

export default function Landing() {
	const [isForYou, setIsForYou] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);

	// TODO - add feature where if you're in that route, the icon should be filled in, otherwise it shouldn't
	// TODO - make sure it's mobile friendly for ALL screen sizes!
	return (
		<div className="bg-black w-full text-white h-screen">
			<div className="bg-black h-screen">
				<div className="border-b-2 border-gray-500 h-14 flex text-center hover:cursor-pointer font-bold w-full">
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
				<div>
					<Editor />
				</div>
				{/* <div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div>
				<div className="bg-red-500 w-full h-10"></div> */}
			</div>
		</div>
	);
}
