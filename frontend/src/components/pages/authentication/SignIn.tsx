import { useState } from "react";
import TwitterXSVG from "../../../assets/twitter-x.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export default function SignIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { signIn, signInIsPending } = useAuth();

	// ! the black background color isn't filling the entire screen on mobile view
	// ! need to add labels for inputs
	return (
		<div className="bg-black w-full h-full flex flex-wrap">
			<div className="w-full lg:w-1/2 h-screen">
				<div className="flex justify-center items-center h-full">
					<img src={TwitterXSVG} alt="Twitter-X-SVG" className="w-3/4 h-3/4" />
				</div>
			</div>
			<div className="w-full lg:w-1/2 h-screen text-white lg:p-0 p-5">
				<h1 className="mt-24 font-bold text-7xl">Happening now</h1>
				<h3 className="text-4xl font-bold mt-20">Sign in to 𝕏</h3>
				<div className="mt-6">
					<form action="">
						<div className="border-2 focus-within:border-sky-400 border-gray-500 rounded-sm p-2 lg:w-3/4 w-full relative">
							<div>
								<p className="text-gray-400 text-xs w-1/4">Username</p>
							</div>
							<div className="flex justify-center items-center">
								<span className="mr-2">
									<FontAwesomeIcon icon={faUser} />
								</span>
								<input
									type="text"
									className="w-full bg-transparent outline-none"
									value={username}
									onChange={e => setUsername(e.target.value)}
									maxLength={20}
									placeholder="Username"
								/>
							</div>
						</div>
						<div className="border-2 focus-within:border-sky-400 border-gray-500 rounded-sm p-2 lg:w-3/4 w-full relative mt-5">
							<div>
								<p className="text-gray-400 text-sm">Password</p>
							</div>
							<div className="flex justify-center items-center">
								<span className="mr-2">
									<FontAwesomeIcon icon={faLock} />
								</span>
								<input
									type="password"
									className="w-full bg-transparent outline-none"
									value={password}
									onChange={e => setPassword(e.target.value)}
									placeholder="Password"
								/>
							</div>
						</div>
						<div>
							<button
								className="bg-sky-600 hover:bg-sky-500 h-10 flex items-center justify-center rounded-md p-2 mt-7 lg:w-3/4 w-full text-center font-bold text-lg hover:cursor-pointer active:bg-sky-600"
								onClick={event => {
									signIn(event, username, password);
								}}
								disabled={signInIsPending}
							>
								{signInIsPending ? "Loading..." : "SIGN IN"}
							</button>
						</div>
					</form>
					<h4 className="text-lg font-bold mt-5">Don't have an account?</h4>
					<Link to="/sign-up">
						<div className="bg-sky-600 h-10 flex items-center justify-center rounded-md p-2 mt-3 lg:w-3/4 w-full text-center font-bold text-lg hover:bg-sky-500 hover:cursor-pointer active:bg-sky-600">
							SIGN UP
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
