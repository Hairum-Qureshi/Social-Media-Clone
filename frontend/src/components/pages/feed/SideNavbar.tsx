import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TwitterXSVG from "../../../assets/twitter-x.svg";
import {
	faBell,
	faBookmark,
	faHouse,
	faMagnifyingGlass,
	faMessage,
	faRightFromBracket,
	faUser
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function SideNavbar() {
	return (
		<div className="bg-black border-r-2 border-r-gray-700 text-white h-screen lg:w-1/4 w-32 overflow-hidden">
			<div className="h-full lg:w-2/3 w-full ml-auto lg:relative lg:block flex flex-col items-center justify-center">
				<Link to="/">
					<img
						src={TwitterXSVG}
						alt="Twitter-X SVG"
						className="w-10 h-10 mt-3"
					/>
				</Link>
				<div className="text-2xl p-2">
					<Link to="/">
						<div className="ml-3">
							<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
								<span>
									<FontAwesomeIcon icon={faHouse} />
								</span>
								<span className="ml-5 hidden lg:inline-block">Home</span>
							</div>
						</div>
					</Link>
					<Link to="/explore">
						<div className="ml-3">
							<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
								<span>
									<FontAwesomeIcon icon={faMagnifyingGlass} />
								</span>
								<span className="ml-5 hidden lg:inline-block">Explore</span>
							</div>
						</div>
					</Link>
					<Link to="/notifications">
						<div className="ml-3">
							<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
								<span>
									<FontAwesomeIcon icon={faBell} />
								</span>
								<span className="ml-5 hidden lg:inline-block">
									Notifications
								</span>
							</div>
						</div>
					</Link>
					<Link to="/messages">
						<div className="ml-3">
							<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
								<span>
									<FontAwesomeIcon icon={faMessage} />
								</span>
								<span className="ml-5 hidden lg:inline-block">Messages</span>
							</div>
						</div>
					</Link>
					<Link to="/bookmarks">
						<div className="ml-3">
							<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
								<span>
									<FontAwesomeIcon icon={faBookmark} />
								</span>
								<span className="ml-5 hidden lg:inline-block">Bookmarks</span>
							</div>
						</div>
					</Link>
					<Link to="/username">
						<div className="ml-3">
							<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
								<span>
									<FontAwesomeIcon icon={faUser} />
								</span>
								<span className="ml-5 hidden lg:inline-block">Profile</span>
							</div>
						</div>
					</Link>
				</div>
				<div className="lg:absolute lg:bottom-0 lg:left-0 lg:w-full flex flex-col items-center justify-center text-center">
					<div className="w-full rounded-full p-2 text-lg text-black font-bold text-center">
						<div className="bg-white p-2 lg:rounded-md hover:cursor-pointer lg:mr-4">
							POST
						</div>
					</div>
					<div className="w-full lg:rounded-md text-lg font-bold text-center my-8">
						<div className="hover:bg-gray-800 p-2 rounded-md lg:mx-2 hover:cursor-pointer">
							<div className="flex items-center justify-center">
								<img
									src="https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
									alt="User pfp"
									className="lg:w-10 lg:h-10 w-12 h-12 rounded-full"
								/>
								<div className="hidden lg:flex lg:flex-col lg:w-full lg:text-left lg:ml-3">
									<span className="text-lg font-bold flex justify-between items-center">
										Username
										<FontAwesomeIcon
											icon={faRightFromBracket}
											className="ml-auto"
										/>
									</span>
									<span className="text-sm text-gray-400 font-light">
										@username
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
