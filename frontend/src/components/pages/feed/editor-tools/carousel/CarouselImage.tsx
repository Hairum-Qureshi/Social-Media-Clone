import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CarouselImageProps } from "../../../../../interfaces";

export default function CarouselImage({
	children,
	imageIndex,
	removeImage,
	allowDelete,
	forPost,
	numImages
}: CarouselImageProps) {
	return (
		<div
			className={`relative m-2 ${
				numImages === 1 ? "w-full" : "w-1/2"
			} aspect-square`}
		>
			{allowDelete && !forPost && (
				<div
					className="absolute top-0 right-0 text-lg text-white p-2 bg-black rounded-full flex items-center justify-center h-8 w-8 m-2 hover:cursor-pointer"
					onClick={() => removeImage(imageIndex)}
				>
					<FontAwesomeIcon icon={faX} />
				</div>
			)}

			<img
				src={children as string}
				alt="Uploaded image"
				className="w-full h-full object-cover rounded-md"
			/>
		</div>
	);
}
