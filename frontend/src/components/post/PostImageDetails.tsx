import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePosts from "../../hooks/usePosts";
import Carousel from "../pages/feed/editor-tools/carousel/Carousel";
import Editor from "../pages/feed/editor-tools/Editor";
import { useNavigate } from "react-router-dom";
import PostIconsBar from "./PostIconsBar";
import moment from "moment";

// TODO - replace empty "" in else block

export default function PostImageDetails() {
	const { postDataByID } = usePosts();
	const navigate = useNavigate();

	return (
		<div className="bg-black w-full h-screen text-white">
			<div className="flex h-full">
				<div className="w-full flex flex-col">
					<div className="w-full flex flex-col flex-grow">
						<div
							className="hover:cursor-pointer z-10"
							onClick={() => navigate(-1)}
						>
							<FontAwesomeIcon
								icon={faX}
								className="m-5 absolute left-0 text-lg"
							/>
						</div>
						<div className="w-full h-full text-lg overflow-hidden flex items-center justify-center">
							{postDataByID && postDataByID?.postImages.length > 0 ? (
								<Carousel
									images={postDataByID?.postImages}
									numImages={postDataByID?.postImages.length}
									allowDelete={false}
									forPost={true}
									imgsPerSlide={1}
								/>
							) : (
								""
							)}
						</div>
					</div>
				</div>
				<div className="border-l-2 border-slate-500 w-1/2 h-full overflow-y-auto">
					<div className="p-4">
						<div className="flex items-center">
							<div className="w-10 h-10 rounded-full">
								<img
									src={postDataByID?.user?.profilePicture}
									alt="User Pfp"
									className="w-10 h-10 object-cover rounded-full"
								/>
							</div>
							<div className="ml-2">
								<div className="font-semibold">
									{postDataByID?.user?.fullName}
								</div>
								<div className="text-zinc-500">
									@{postDataByID?.user?.username}
								</div>
							</div>
						</div>
						<div className = "my-3">{postDataByID?.text}</div>
						<div className="text-zinc-500 text-sm mt-1 mb-2">
							{moment(postDataByID?.createdAt.toString()).format(
								"h:mm A · MMMM D, YYYY"
							)}
						</div>
					</div>
					<div className="-mt-4 mb-3 border-t-2 border-slate-500">
						<PostIconsBar postData={postDataByID} />
					</div>
					<Editor placeHolder={"Post your reply"} />
				</div>
			</div>
		</div>
	);
}
