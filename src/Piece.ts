import { Size } from './types';
import { clean } from './utils/canvas';

type PieceSize = number | Size;

interface PieceConfig<T> {
	name: string;
	size?: PieceSize;
	setup?: () => void;
	paint: () => void;
	settings?: T;
}

const createDiv = (className: string) => {
	const div = document.createElement('div');

	div.className = className;

	return div;
};

const noop = () => undefined;

const parseSize = (size: PieceSize): Size => {
	if (typeof size === 'number') {
		return {
			width: size,
			height: size,
		};
	}

	return size;
};

interface Piece {
	attach: () => void;
}

interface PieceData {
	context: CanvasRenderingContext2D;
	size: Size;
	settings?: unknown;
}

const pieces = new Map<string, Piece>();
const pieceData = new Map<string, PieceData>();

const defaultSetup = () => {
	const context = useContext();
	const { canvas } = context;
	const { width, height } = useSize();

	const dpr = window.devicePixelRatio;
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	context.scale(dpr, dpr);

	context.lineCap = 'square';
	context.lineWidth = 2;
};

const getLocalSettings = <T>(name: string) => {
	const rawSetting = localStorage.getItem(`${name}-piece-settings`);

	if (rawSetting) {
		try {
			return JSON.parse(rawSetting) as T;
		} catch (error) {}
	}
};

const setLocalSettings = (name: string, settings: unknown) => {
	if (settings) {
		localStorage.setItem(`${name}-piece-settings`, JSON.stringify(settings));
	}
};

const create = <T extends object>(config: PieceConfig<T>) => {
	const { setup = noop, paint, size: rawSize = 320, name, settings } = config;

	if (pieces.has(name)) {
		throw new Error(`Name already used: '${name}'`);
	}

	const localSettings = getLocalSettings<T>(name);

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	const container = createDiv('piece');
	const frame = createDiv('frame');

	container.appendChild(frame);
	frame.appendChild(canvas);

	const size = parseSize(rawSize);

	if (localSettings) {
		console.warn(`Using local setting for '${name}'`);
	}

	const data = {
		context,
		size,
		settings: localSettings || settings,
	};

	setLocalSettings(name, data.settings);

	pieceData.set(name, data);

	currentPieceData = data;
	defaultSetup();
	setup();
	paint();
	currentPieceData = null;

	const piece = {
		attach() {
			const [wall] = document.getElementsByClassName('wall');

			wall.appendChild(container);
		},
		updateSetting<V>(settingName: keyof T, value: V) {
			Object.assign(data.settings, { [settingName]: value });
			currentPieceData = data;
			clean(context);
			paint();
			currentPieceData = null;
			setLocalSettings(name, data.settings);
		},
	};
	pieces.set(name, piece);

	return piece;
};

let currentPieceData: PieceData;

const checkCurrentPiece = (name: string) => {
	if (!currentPieceData) {
		throw new Error(`${name} used outside of a piece`);
	}
};

const useSettings = <T>(): T => {
	checkCurrentPiece('useSettings');
	return currentPieceData.settings as T;
};

const useContext = () => {
	checkCurrentPiece('useContext');
	return currentPieceData.context;
};

const useSize = () => {
	checkCurrentPiece('useSize');
	return currentPieceData.size;
};

export { create, pieces, useContext, useSize, useSettings };
