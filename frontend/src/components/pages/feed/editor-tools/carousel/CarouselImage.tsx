import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CarouselImageProps } from "../../../../../interfaces";

export default function CarouselImage({
	children,
	imageIndex,
	removeImage,
	allowDelete,
	forPost
}: CarouselImageProps) {
	return (
		<div className="w-full h-full m-2 relative">
			{allowDelete && !forPost && <div
				className="absolute top-0 right-0 text-lg text-white p-2 bg-black rounded-full flex items-center justify-center h-8 w-8 m-2 hover:cursor-pointer"
				onClick={() => removeImage(imageIndex)}
			>
				<FontAwesomeIcon icon={faX} />
			</div>}
			<img
				src={children as string}
				className="object-contain rounded-md"
				alt="Uploaded image"
			/>
		</div>
	);
}
