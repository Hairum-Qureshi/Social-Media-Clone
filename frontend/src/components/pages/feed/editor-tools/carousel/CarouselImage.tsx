import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CarouselImageProps } from "../../../../../interfaces";

export default function CarouselImage({image, imageIndex, removeImage}:CarouselImageProps) {
	return (
		<div className="w-full h-full m-2 relative">
			<div className="absolute top-0 right-0 text-lg text-white p-2 bg-black rounded-full flex items-center justify-center h-8 w-8 m-2 hover:cursor-pointer" onClick = {() => removeImage(imageIndex)}>
				<FontAwesomeIcon icon={faX} />
			</div>
			<img
				src={image}
				className="object-cover w-full h-full rounded-md"
				alt="Uploaded image"
			/>
		</div>
	);
}
