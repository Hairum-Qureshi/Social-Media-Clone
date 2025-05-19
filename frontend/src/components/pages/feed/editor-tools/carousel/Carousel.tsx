import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CarouselImage from "./CarouselImage";
import { useEffect, useState } from "react";
import { CarouselProps } from "../../../../../interfaces";
import { useLocation, useNavigate } from "react-router-dom";

export default function Carousel({
	images,
	numImages,
	removeImage,
	allowDelete,
	forPost,
	imgsPerSlide = 2
}: CarouselProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const [index, setIndex] = useState(
		Number(location.pathname.split("/").pop()) - 1 || 0
	);

	function moveNext() {
		setIndex(index => (index === numImages - 1 ? index : index + 1));
	}

	function moveBack() {
		setIndex(index => (index === 0 ? index : index - 1));
	}

	useEffect(() => {
		// handles updating the URL
		if (location.pathname.includes("/photo")) {
			const segments = location.pathname.split("/");
			segments[segments.length - 1] = (index + 1).toString();
			const newPath = segments.join("/");

			navigate(newPath, { replace: true });
		}
	}, [index]);

	return (
		<div className="relative flex mb-3 w-full h-auto items-center justify-center">
			{numImages === 1 ? (
				<div className="w-full mt-4">
					<CarouselImage
						imageIndex={index}
						removeImage={removeImage}
						allowDelete={allowDelete}
						forPost={forPost}
						numImages={numImages}
					>
						{images[index]}
					</CarouselImage>
				</div>
			) : imgsPerSlide === 1 ? (
				<>
					{index !== 0 && (
						<div
							className="absolute left-0 ml-5 hover: cursor-pointer text-2xl"
							onClick={() => moveBack()}
						>
							<div className="bg-slate-800 p-2 rounded-full w-10 h-10 flex items-center justify-center">
								<FontAwesomeIcon icon={faArrowLeft} />
							</div>
						</div>
					)}
					<CarouselImage
						imageIndex={index}
						removeImage={removeImage}
						allowDelete={allowDelete}
						forPost={forPost}
						numImages={numImages}
						forGallery={true}
					>
						{images[index]}
					</CarouselImage>
					{index !== numImages - 1 && (
						<div
							className="absolute right-0 mr-5 hover: cursor-pointer text-2xl"
							onClick={() => moveNext()}
						>
							<div className="bg-slate-800 p-2 rounded-full w-10 h-10 flex items-center justify-center">
								<FontAwesomeIcon icon={faArrowRight} />
							</div>
						</div>
					)}
				</>
			) : (
				<></>
			)}
		</div>
	);
}

// import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import CarouselImage from "./CarouselImage";
// import { useEffect, useState } from "react";
// import { CarouselProps } from "../../../../../interfaces";

// export default function Carousel({
// 	images,
// 	numImages,
// 	removeImage,
// 	allowDelete,
// 	forPost,
// 	imgsPerSlide = 2
// }: CarouselProps) {
// 	const [index, setIndex] = useState(0);

// 	// Resets the index back to 0 every time numImage changes (such as when the user deletes an image) which prevents indexing out of bounds
// 	useEffect(() => {
// 		setIndex(0);
// 	}, [numImages]);

// 	return (
// 		<div className="relative flex mb-3 w-full h-auto">
// 			{numImages === 4 ? (
// 				<>
// <CarouselImage
// 	imageIndex={index}
// 	removeImage={removeImage}
// 	allowDelete={allowDelete}
// 	forPost={forPost}
// 	numImages={numImages}
// >
// 						{images[index]}
// 					</CarouselImage>
// 					<CarouselImage
// 						imageIndex={index}
// 						removeImage={removeImage}
// 						allowDelete={allowDelete}
// 						forPost={forPost}
// 						numImages={numImages}
// 					>
// 						{images[index + 2]}
// 					</CarouselImage>
// 					<div
// 						className={`absolute top-28 ${
// 							index === 1 && index + 1 === 2 ? "ml-5 left-0" : "mr-5 right-0"
// 						} text-white text-2xl border-2 border-white bg-black rounded-md p-1 hover:cursor-pointer`}
// 					>
// 						{index !== 1 && index + 1 !== 2 ? (
// 							<FontAwesomeIcon
// 								icon={faArrowRight}
// 								onClick={() => setIndex(index + 1)}
// 							/>
// 						) : (
// 							<FontAwesomeIcon
// 								icon={faArrowLeft}
// 								onClick={() => setIndex(index - 1)}
// 							/>
// 						)}
// 					</div>
// 				</>
// 			) : numImages === 3 ? (
// 				<>
// 					<CarouselImage
// 						imageIndex={index}
// 						removeImage={removeImage}
// 						allowDelete={allowDelete}
// 						forPost={forPost}
// 						numImages={numImages}
// 					>
// 						{images[index]}
// 					</CarouselImage>
// 					<CarouselImage
// 						imageIndex={index}
// 						removeImage={removeImage}
// 						allowDelete={allowDelete}
// 						forPost={forPost}
// 						numImages={numImages}
// 					>
// 						{images[index + 1]}
// 					</CarouselImage>
// 					<div
// 						className={`absolute top-28 ${
// 							index === 1 && index + 1 === 2 ? "ml-5 left-0" : "mr-5 right-0"
// 						} text-white text-2xl border-2 border-white bg-black rounded-md p-1 hover:cursor-pointer`}
// 					>
// 						{index !== 1 && index + 1 !== 2 ? (
// 							<FontAwesomeIcon
// 								icon={faArrowRight}
// 								onClick={() => setIndex(index + 1)}
// 							/>
// 						) : (
// 							<FontAwesomeIcon
// 								icon={faArrowLeft}
// 								onClick={() => setIndex(index - 1)}
// 							/>
// 						)}
// 					</div>
// 				</>
// 			) : numImages === 2 ? (
// 				<>
// 					<CarouselImage
// 						imageIndex={index}
// 						removeImage={removeImage}
// 						allowDelete={allowDelete}
// 						forPost={forPost}
// 						numImages={numImages}
// 					>
// 						{images[index]}
// 					</CarouselImage>
// 					<CarouselImage
// 						imageIndex={index}
// 						removeImage={removeImage}
// 						allowDelete={allowDelete}
// 						forPost={forPost}
// 						numImages={numImages}
// 					>
// 						{images[index + 1]}
// 					</CarouselImage>
// 				</>
// 			) : (
// <div className="w-full flex items-center mt-4 justify-center">
// 	<CarouselImage
// 		imageIndex={index}
// 		removeImage={removeImage}
// 		allowDelete={allowDelete}
// 		forPost={forPost}
// 		numImages={numImages}
// 	>
// 		{images[index]}
// 	</CarouselImage>
// </div>
// 			)}
// 		</div>
// 	);
// }
