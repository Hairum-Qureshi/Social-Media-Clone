import {
	faFaceSmile,
	faFilm,
	faLocationPin,
	faPhotoFilm,
	faSquarePollHorizontal
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

interface Props {
	handleImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EditorOptions({ handleImage }: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<span
				className="mx-4 hover:cursor-pointer"
				onClick={() => fileInputRef.current?.click()}
			>
				<FontAwesomeIcon icon={faPhotoFilm} /> {/* Photos */}
				<input
					type="file"
					onChange={event => handleImage(event)}
					className="hidden"
					ref={fileInputRef}
					accept=".jpg, .jpeg, .png, .gif"
				/>
			</span>
			<span className="mx-4 hover:cursor-pointer">
				<FontAwesomeIcon icon={faFilm} /> {/* GIF */}
			</span>
			<span className="mx-4 hover:cursor-pointer">
				<FontAwesomeIcon icon={faSquarePollHorizontal} /> {/* POLL */}
			</span>
			<span className="mx-4 hover:cursor-pointer">
				<FontAwesomeIcon icon={faFaceSmile} /> {/* EMOJIS */}
			</span>
			<span className="mx-4 hover:cursor-pointer">
				<FontAwesomeIcon icon={faLocationPin} /> {/* LOCATION */}
			</span>
			<div className="ml-auto flex items-center mr-5 border-l-2 border-gray-500">
				<div
					style={{
						marginLeft: "1.25rem",
						border: "2px solid",
						// borderRadius: `${
						// 	Math.floor(postContent.length / 280) * 100
						// }%`,
						borderRadius: "100%",
						width: "1.5rem",
						height: "1.5rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "0.875rem"
					}}
				>
					1
				</div>
				<button className="text-base ml-4 px-2 py-1 bg-white rounded-md text-black">
					POST
				</button>
			</div>
		</>
	);
}
