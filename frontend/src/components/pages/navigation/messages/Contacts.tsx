import { faEnvelope, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Contacts() {
	return (
		<div>
			<div className="flex p-2">
				<h3 className="font-semibold w-full text-white text-xl">Messages</h3>
				<div className="text-white inline-flex items-center text-lg">
					<span className="mr-3">
						<FontAwesomeIcon icon={faGear} />
					</span>
					<span className="mr-3">
						<FontAwesomeIcon icon={faEnvelope} />
					</span>
				</div>
			</div>
			<div className="text-white">
				<div className="m-10">
					<h2 className="text-4xl font-bold">Welcome to your inbox!</h2>
					<p className="text-slate-500 mt-3">
						Drop a line, share posts and more with private conversations between
						you and others on X.
					</p>
                    <button className = "bg-sky-500 px-8 py-4 text-lg text-white rounded-full mt-5 font-semibold">Write a message</button>
				</div>
			</div>
		</div>
	);
}
