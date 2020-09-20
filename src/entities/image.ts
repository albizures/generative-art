import * as Pieza from 'pieza';
import { Size } from '../types';

const getImageFitSize = (image: Pieza.Image, margin = 0): Size => {
	const { width, height } = Pieza.useMeasures();
	if (image.width > image.height) {
		const ratio = width / image.width;
		return {
			width: width - margin,
			height: image.height * ratio - margin,
		};
	} else {
		const ratio = height / image.height;
		return {
			width: image.width * ratio - margin,
			height: height - margin,
		};
	}
};

export { getImageFitSize };
