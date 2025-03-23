import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface UserSettingsModalProps {
	closeModal: () => void;
}

export default function UserSettingsModal({
	closeModal
}: UserSettingsModalProps) {
	// TODO - make sure to add logic where if the user enters "Israel"/"State of Israel", it will change to "Palestine"
	// TODO - make sure to update database so that it handles storing the user's location too
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
					/>
					<input
						type="text"
						placeholder="Username"
						className="bg-transparent border-2 border-gray-600 p-2 w-1/2 ml-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
					/>
				</div>
				<div>
					<input
						type="email"
						placeholder="Email"
						className="bg-transparent border-2 border-gray-600 w-full p-2 mr-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
					/>
				</div>
				<div className="flex">
					<input
						type="password"
						placeholder="Current Password"
						className="bg-transparent border-2 border-gray-600 p-2 w-1/2 mr-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
					/>
					<input
						type="password"
						placeholder="New Password"
						className="bg-transparent border-2 border-gray-600 p-2 w-1/2 ml-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
					/>
					
				</div>
				<div>
					<input
						type="text"
						placeholder="Country/Location"
						className="bg-transparent border-2 border-gray-600 w-full p-2 mr-2 mb-4 focus:border-sky-400 focus:outline-none rounded-md"
					/>
				</div>
				<div>
					<textarea
						placeholder="Bio"
						className="w-full p-2 resize-none bg-transparent border-2 mb-3 border-gray-600 focus:border-sky-400 focus:outline-none rounded-md h-24"
					></textarea>
				</div>
				<div>
					<input
						type="text"
						placeholder="Link"
						className="bg-transparent border-2 border-gray-600 w-full p-2 mr-2 mb-5 focus:border-sky-400 focus:outline-none rounded-md"
					/>
				</div>
				<div>
					<button className="w-full p-2 border-blue-300 bg-sky-400 text-white rounded-full">
						Update
					</button>
				</div>
			</div>
		</div>
	);
}
