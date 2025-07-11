import { useState } from "react";
import { RenameGCNameModalProps } from "../../../../../interfaces";

export default function RenameGCNameModal({
	showGCRenameModal
}: RenameGCNameModalProps) {
	const [newGCName, setNewGCName] = useState("");

	return (
		<div
			className="absolute z-20 bg-black top-20 w-1/3 border-2 border-gray-600 right-20 p-4 rounded"
			style={{
				boxShadow: "0 0 20px 4px rgba(75, 85, 99, 0.5)"
			}}
		>
			<div className="text-white text-lg font-semibold mb-2">
				Rename Group Chat
			</div>
			<input
				type="text"
				className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
				placeholder="Enter new group chat name"
				value={newGCName}
				onChange={e => setNewGCName(e.target.value)}
			/>
			<div className="flex justify-end mt-3">
				<button className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700">
					Rename
				</button>
				<button
					className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
					onClick={() => showGCRenameModal(false)}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
