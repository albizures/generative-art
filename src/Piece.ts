import p5 from 'p5';
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
	attach: (parent: Element) => void;
}

interface PieceData {
	context: p5;
	size: Size;
	settings?: unknown;
}

const pieces = new Map<string, Piece>();
const pieceData = new Map<string, PieceData>();

const defaultSetup = () => {
	const context = useContext();

	context.strokeWeight(2);
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

const run = (fns: Function | Function[], data: PieceData) => {
	currentPieceData = data;
	[].concat(fns).forEach((fn) => {
		try {
			fn();
		} catch (error) {
			console.error(error);
		}
	});
	currentPieceData = null;
};

const create = <T extends object>(config: PieceConfig<T>) => {
	const { setup = noop, paint, size: rawSize = 320, name, settings } = config;

	if (pieces.has(name)) {
		throw new Error(`Name already used: '${name}'`);
	}

	const localSettings = getLocalSettings<T>(name);

	const container = createDiv('piece');
	const frame = createDiv('frame');

	container.appendChild(frame);

	const size = parseSize(rawSize);

	const context = new p5((sketch: p5) => {
		sketch.setup = () => {
			const canvas = sketch.createCanvas(size.width, size.height);

			// canvas.style('height', '');
			// canvas.style('width', '');
			run([defaultSetup, setup, paint], data);
		};
	}, frame);

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

	const piece = {
		attach(parent: Element) {
			parent.appendChild(container);
		},
		updateSetting<V>(settingName: keyof T, value: V) {
			Object.assign(data.settings, { [settingName]: value });
			run([clean, paint], data);
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
