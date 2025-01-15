export interface CarouselImageProps {
	image: string;
	imageIndex: number;
	removeImage: (imageIndex: number) => void;
	allowDelete: boolean;
}

export interface CarouselProps {
	images: string[];
	numImages: number;
	removeImage: (imageIndex: number) => void;
	allowDelete: boolean;
}

export interface EditorOptionsProps {
	handleImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
