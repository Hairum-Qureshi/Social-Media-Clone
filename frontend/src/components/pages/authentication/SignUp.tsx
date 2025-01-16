import { useEffect, useState } from "react";
import TwitterXSVG from "../../../assets/twitter-x.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [usernameCharacters, setUsernameCharacters] = useState(0);
	const [fullNameCharacters, setFullNameCharacters] = useState(0);

	useEffect(() => {
		setUsernameCharacters(username.length);
		setFullNameCharacters(fullName.length);
	}, [username, fullName]);

	const { signUp } = useAuth();

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
				<h1 className="mt-10 font-bold text-7xl">Happening now</h1>
				<h3 className="text-4xl font-bold mt-7">Join today.</h3>
				<div className="mt-6">
					<form action="">
						<div className="border-2 focus-within:border-sky-400 border-gray-500 rounded-sm p-2 lg:w-3/4 w-full relative">
							<div>
								<p className="text-gray-400 text-xs w-1/4">
									Username
									<span className="absolute right-0 ml-right mr-1">
										{usernameCharacters}/20
									</span>
								</p>
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
								<p className="text-gray-400 text-sm">
									Full name
									<span className="absolute right-0 ml-right mr-1">
										{fullNameCharacters}/50
									</span>
								</p>
							</div>
							<div className="flex justify-center items-center">
								<span className="mr-2">
									<FontAwesomeIcon icon={faUser} />
								</span>
								<input
									type="text"
									className="w-full bg-transparent outline-none"
									value={fullName}
									onChange={e => setFullName(e.target.value)}
									maxLength={20}
									placeholder="Full Name"
								/>
							</div>
						</div>
						<div className="border-2 focus-within:border-sky-400 border-gray-500 rounded-sm p-2 lg:w-3/4 w-full relative mt-5">
							<div>
								<p className="text-gray-400 text-sm">Email</p>
							</div>
							<div className="flex justify-center items-center">
								<span className="mr-2">
									<FontAwesomeIcon icon={faEnvelope} />
								</span>
								<input
									type="email"
									className="w-full bg-transparent outline-none"
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder="Email"
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
								onClick={event => {
									signUp(event, username, fullName, email, password);
								}}
								className="bg-sky-600 hover:bg-sky-500 h-10 flex items-center justify-center rounded-md p-2 mt-7 lg:w-3/4 w-full text-center font-bold text-lg hover:cursor-pointer active:bg-sky-600"
							>
								CREATE ACCOUNT
							</button>
						</div>
					</form>
					<h4 className="text-lg font-bold mt-5">Already have an account?</h4>
					<Link to="/sign-in">
						<div className="bg-sky-600 h-10 flex items-center justify-center rounded-md p-2 mt-3 lg:w-3/4 w-full text-center font-bold text-lg hover:bg-sky-500 hover:cursor-pointer active:bg-sky-600">
							SIGN IN
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
