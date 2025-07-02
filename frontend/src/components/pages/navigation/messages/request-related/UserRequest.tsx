import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function UserRequest() {
	return (
		<div className="flex p-2 m-3">
			<Link to="/messages">
				<span className="text-white mr-4 items-center text-xl hover:cursor-pointer">
					<FontAwesomeIcon icon={faArrowLeft} />
				</span>
			</Link>
			<h3 className="font-semibold w-full text-white text-xl">
				Message Requests
			</h3>
		</div>
	);
}
