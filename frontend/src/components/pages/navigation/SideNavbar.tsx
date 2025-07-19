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
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAuthContext from "../../../contexts/AuthContext";
import PostModal from "../../post/PostModal";
import Editor from "../feed/editor-tools/Editor";
import usePosts from "../../../hooks/usePosts";
import useNotifications from "../../../hooks/useNotifications";

export default function SideNavbar() {
	const { signOut } = useAuth();
	const { userData } = useAuthContext()!;
	const isFeed: boolean = window.location.pathname === "/";
	const { showPostModal, showThePostModal } = usePosts();
	const navigate = useNavigate();
	useNotifications(); // needed to be called because without it, if you're on any other page (that's not the notifications page), you won't see the live count of notifications or any notifications appear

	return (
		<>
			{showPostModal && !isFeed ? (
				<PostModal>
					<Editor showBorder={false} />
				</PostModal>
			) : null}
			<div className="w-80 bg-black border-r-2 border-r-gray-700 text-white h-screen flex items-center justify-center relative">
				<div className="w-3/4 flex items-center h-full flex-col">
					<div className="w-full">
						<Link to="/">
							<img
								src={TwitterXSVG}
								alt="Twitter-X SVG"
								className="w-12 h-12 mt-3"
							/>
						</Link>
					</div>
					<div className="w-full text-2xl mt-3">
						<Link to="/">
							<div className="hover:bg-gray-800 p-2 rounded-full">
								<span className="mr-4">
									<FontAwesomeIcon icon={faHouse} />
								</span>
								<span>Home</span>
							</div>
						</Link>
					</div>
					<div className="w-full text-2xl mt-3">
						<Link to="/explore">
							<div className="hover:bg-gray-800 p-2 rounded-full">
								<span className="mr-4">
									<FontAwesomeIcon icon={faMagnifyingGlass} />
								</span>
								<span>Explore</span>
							</div>
						</Link>
					</div>
					<div className="w-full text-2xl mt-3 flex items-center">
						<Link to="/notifications">
							<div className="hover:bg-gray-800 p-2 rounded-full flex items-center">
								<span className="mr-4">
									<FontAwesomeIcon icon={faBell} />
								</span>
								<div className="flex items-center">
									<span>Notifications</span>
									{userData &&
										!userData.hasReadNotifications &&
										userData.numNotifications > 0 && (
											<span className="bg-red-600 text-white text-xs font-bold min-w-[1.25rem] h-5 px-2 flex items-center justify-center rounded-full leading-none ml-2">
												{userData.numNotifications > 99
													? "99+"
													: userData.numNotifications}
											</span>
										)}
								</div>
							</div>
						</Link>
					</div>
					<div className="w-full text-2xl mt-3">
						<Link to="/messages">
							<div className="hover:bg-gray-800 p-2 rounded-full">
								<span className="mr-4">
									<FontAwesomeIcon icon={faMessage} />
								</span>
								<span>Messages</span>
							</div>
						</Link>
					</div>
					<div className="w-full text-2xl mt-3">
						<Link to="/bookmarks">
							<div className="hover:bg-gray-800 p-2 rounded-full">
								<span className="mr-4">
									<FontAwesomeIcon icon={faBookmark} />
								</span>
								<span>Bookmarks</span>
							</div>
						</Link>
					</div>
					<div className="w-full text-2xl mt-3">
						<Link to={`/${userData?.username}`}>
							<div className="hover:bg-gray-800 p-2 rounded-full">
								<span className="mr-4">
									<FontAwesomeIcon icon={faUser} />
								</span>
								<span>Profile</span>
							</div>
						</Link>
					</div>
					<div
						className="w-full text-2xl mt-3 hover:cursor-pointer"
						onClick={() => {
							const confirmation = confirm(
								"Are you sure you would like to sign out?"
							);
							if (confirmation) {
								signOut();
								navigate("/sign-in");
							}
						}}
					>
						<div className="hover:bg-gray-800 p-2 rounded-full">
							<span className="mr-4">
								<FontAwesomeIcon
									icon={faRightFromBracket}
									className="ml-auto"
								/>
							</span>
							<span>Sign Out</span>
						</div>
					</div>
					<div className="w-full text-2xl mt-6">
						<button
							className="p-2 bg-white text-black rounded-md text-lg w-full font-semibold"
							onClick={() => showThePostModal(true)}
						>
							POST
						</button>
					</div>
					<div className="absolute bottom-0 w-full p-3 hover:cursor-pointer">
						<Link to={`/${userData?.username}`}>
							<div className="flex">
								<div className="w-12 h-12">
									<img
										src={userData?.profilePicture}
										alt="User profile picture"
										className="w-12 h-12 object-cover rounded-full"
									/>
								</div>
								<div className="ml-3 font-semibold">
									<p>{userData?.fullName}</p>
									<p className="text-slate-500">@{userData?.username}</p>
								</div>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
