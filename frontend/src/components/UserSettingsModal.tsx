import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import useProfile from "../hooks/useProfile";

interface UserSettingsModalProps {
	closeModal: () => void;
}

export default function UserSettingsModal({
	closeModal
}: UserSettingsModalProps) {
	// TODO - make sure to add logic where if the user enters "Israel"/"State of Israel", it will change to "Palestine"
	// TODO - consider adding a border shadow around the div

	const [fullName, setFullName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [location, setLocation] = useState("");
	const [bio, setBio] = useState("");
	const [link, setLink] = useState("");

	const { postMutation } = useProfile();

	return (
		<div className="absolute top-40 right-14 z-20 bg-black text-white w-10/12 border-2 rounded-md border-white p-2">
			<div className="flex items-center">
				<h3 className="font-bold m-2 text-lg">Update Profile</h3>
				<span
					className="ml-auto text-xl mr-5 hover:cursor-pointer"
					onClick={() => closeModal()}
				>
					<FontAwesomeIcon icon={faX} />
				</span>
			</div>
			<div className="w-full p-2">
				<div className="flex">
					<input
						type="text"
						placeholder="Full Name"
						className="bg-transparent border-2 border-gray-600 p-2 w-1/2 mr-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
						onChange={e => setFullName(e.target.value)}
						value={fullName}
					/>
					<input
						type="text"
						placeholder="Username"
						className="bg-transparent border-2 border-gray-600 p-2 w-1/2 ml-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
						onChange={e => setUsername(e.target.value)}
						value={username}
					/>
				</div>
				<div>
					<input
						type="email"
						placeholder="Email"
						className="bg-transparent border-2 border-gray-600 w-full p-2 mr-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
						onChange={e => setEmail(e.target.value)}
						value={email}
					/>
				</div>
				<div className="flex">
					<input
						type="password"
						placeholder="Current Password"
						className="bg-transparent border-2 border-gray-600 p-2 w-1/2 mr-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
						onChange={e => setCurrentPassword(e.target.value)}
						value={currentPassword}
					/>
					<input
						type="password"
						placeholder="New Password"
						className="bg-transparent border-2 border-gray-600 p-2 w-1/2 ml-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
						onChange={e => setNewPassword(e.target.value)}
						value={newPassword}
					/>
				</div>
				<div>
					<input
						type="text"
						placeholder="Location"
						className="bg-transparent border-2 border-gray-600 w-full p-2 mr-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
						onChange={e => setLocation(e.target.value)}
						value={location}
					/>
				</div>
				<div>
					<textarea
						placeholder="Bio"
						className="w-full p-2 resize-none bg-transparent border-2 mb-3 border-gray-600 focus:border-sky-400 focus:outline-none rounded-md h-24"
						onChange={e => setBio(e.target.value)}
						value={bio}
					></textarea>
				</div>
				<div>
					<input
						type="text"
						placeholder="Link"
						className="bg-transparent border-2 border-gray-600 w-full p-2 mr-2 mb-5 focus:border-sky-400 focus:outline-none rounded-md"
						onChange={e => setLink(e.target.value)}
						value={link}
					/>
				</div>
				<div>
					<button
						className="w-full p-2 border-blue-300 bg-sky-400 text-white rounded-full"
						onClick={() =>
							postMutation(
								fullName,
								username,
								email,
								currentPassword,
								newPassword,
								location,
								bio,
								link
							)
						}
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
}
