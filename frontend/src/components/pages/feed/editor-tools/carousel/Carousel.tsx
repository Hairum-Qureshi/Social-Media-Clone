import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CarouselImage from "./CarouselImage";
import { useState } from "react";

interface Props {
	images: string[];
	numImages: number;
    removeImage: (imageIndex:number) => void
}

export default function Carousel({ images, numImages, removeImage }: Props) {
	const [index, setIndex] = useState(0);

	return (
		<div className="relative flex mb-3 w-full">
			{numImages === 4 ? (
				<>
					<CarouselImage image={images[index]} imageIndex={index} removeImage={removeImage} />
					<CarouselImage image={images[index + 2]} imageIndex={index + 2} removeImage={removeImage} />
					<div
						className={`absolute top-28 ${
							index === 1 && index + 1 === 2 ? "ml-5 left-0" : "mr-5 right-0"
						} text-white text-2xl border-2 border-white bg-black rounded-md p-1 hover:cursor-pointer`}
					>
						{index !== 1 && index + 1 !== 2 ? (
							<FontAwesomeIcon
								icon={faArrowRight}
								onClick={() => setIndex(index + 1)}
							/>
						) : (
							<FontAwesomeIcon
								icon={faArrowLeft}
								onClick={() => setIndex(index - 1)}
							/>
						)}
					</div>
				</>
			) : numImages === 3 ? (
				<>
					<CarouselImage image={images[index]} imageIndex={index} removeImage={removeImage} />
					<CarouselImage image={images[index + 1]} imageIndex={index + 1} removeImage={removeImage} />
					<div
						className={`absolute top-28 ${
							index === 1 && index + 1 === 2 ? "ml-5 left-0" : "mr-5 right-0"
						} text-white text-2xl border-2 border-white bg-black rounded-md p-1 hover:cursor-pointer`}
					>
						{index !== 1 && index + 1 !== 2 ? (
							<FontAwesomeIcon
								icon={faArrowRight}
								onClick={() => setIndex(index + 1)}
							/>
						) : (
							<FontAwesomeIcon
								icon={faArrowLeft}
								onClick={() => setIndex(index - 1)}
							/>
						)}
					</div>
				</>
			) : numImages === 2 ? (
				<>
					<CarouselImage image={images[index]} imageIndex={index} removeImage={removeImage} />
					<CarouselImage image={images[index + 1]} imageIndex={index + 1} removeImage={removeImage} />
				</>
			) : (
				<div className="w-full flex items-center mt-4 justify-center">
					<CarouselImage image={images[index]} imageIndex={index} removeImage={removeImage} />
				</div>
			)}
		</div>
	);
}
