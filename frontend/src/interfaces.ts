export interface CarouselImageProps {
	image: string;
	imageIndex: number;
	removeImage: (imageIndex:number) => void
}

export interface CarouselProps {
	images: string[];
	numImages: number;
	removeImage: (imageIndex: number) => void;
}

export interface EditorOptionsProps {
	handleImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}