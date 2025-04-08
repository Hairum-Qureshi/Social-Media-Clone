import { faEnvelope, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import UserSearchModal from "./UserSearchModal";
import { useState } from "react";

export default function Contacts() {
	const path = window.location.pathname;
	const [openModal, setOpenModal] = useState(
		path.includes("/compose") || false
	);

	function closeModal() {
		setOpenModal(false);
	}

	return (
		<>
			{openModal && <UserSearchModal closeModal={closeModal} />}
			<div>
				<div className="flex p-2">
					<h3 className="font-semibold w-full text-white text-xl m-3">
						Messages
					</h3>
					<div className="text-white inline-flex items-center text-lg">
						<span className="mr-3">
							<FontAwesomeIcon icon={faGear} />
						</span>
						<span className="mr-3">
							<FontAwesomeIcon icon={faEnvelope} />
						</span>
					</div>
				</div>
				<Link to="/messages/requests">
					<div className="text-white flex w-full hover:bg-zinc-900 hover:cursor-pointer p-3">
						<div className="">
							<span className="mr-3 text-lg border-2 border-slate-700 rounded-full w-12 h-12 flex items-center justify-center">
								<FontAwesomeIcon icon={faEnvelope} />
							</span>
						</div>
						<p className="flex items-center">Message Requests</p>
					</div>
				</Link>
				<div className="text-white">
					<div className="m-10">
						<h2 className="text-4xl font-bold">Welcome to your inbox!</h2>
						<p className="text-slate-500 mt-3">
							Drop a line, share posts and more with private conversations
							between you and others on X.
						</p>
						<Link to="/messages/compose">
							<button
								className="bg-sky-500 px-8 py-4 text-lg text-white rounded-full mt-5 font-semibold"
								onClick={() => setOpenModal(true)}
							>
								Write a message
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
