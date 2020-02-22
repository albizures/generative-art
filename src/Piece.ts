import p5 from 'p5';
import { Size } from './types';
import { clean } from './utils/canvas';

type PieceSize = number | Size;

interface PieceConfig<T, S> {
	name: string;
	size?: PieceSize;
	setup?: () => void;
	paint?: () => void;
	draw?: () => void;
	update?: (state: S) => S;
	state?: S;
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
	name: string;
	state: unknown;
	settings?: unknown;
}

const pieces = new Map<string, Piece>();
const pieceData = new Map<string, PieceData>();

const defaultSetup = () => {
	const context = useContext();

	context.strokeWeight(2);
};

const getLocalSettings = <T extends object>(name: string) => {
	const rawSetting = localStorage.getItem(`${name}-piece-settings`);

	if (rawSetting) {
		try {
			return JSON.parse(rawSetting) as T;
		} catch (error) {
			return {};
		}
	}
	return {};
};

const setLocalSetting = <V>(
	name: string,
	settingName: keyof V,
	value: unknown,
) => {
	const localSettings = getLocalSettings(name);
	localStorage.setItem(
		`${name}-piece-settings`,
		JSON.stringify({
			...localSettings,
			[settingName]: value,
		}),
	);
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

const create = <T extends object, S extends object = {}>(
	config: PieceConfig<T, S>,
) => {
	const {
		setup = noop,
		paint,
		size: rawSize = 320,
		name,
		settings,
		draw,
		update,
		state: defaultState = {} as S,
	} = config;

	if (pieces.has(name)) {
		throw new Error(`Name already used: '${name}'`);
	}

	const localSettings = getLocalSettings<T>(name);

	const container = createDiv('piece');
	const frame = createDiv('frame');

	container.appendChild(frame);

	const size = parseSize(rawSize);

	const properties = Object.keys(localSettings);

	if (localSettings && properties.length > 0) {
		console.warn(
			`Using local setting for ${properties.join(', ')} in piece '${name}'`,
		);
	}

	let context: p5;
	const data = {
		state: defaultState,
		name,
		get context() {
			return context;
		},
		size,
		settings: {
			...settings,
			...localSettings,
		},
	};

	pieceData.set(name, data);

	const piece = {
		attach(parent: Element) {
			parent.appendChild(container);
			const hasDraw = !!draw;

			new p5((sketch: p5) => {
				context = sketch;
				context.setup = () => {
					context.createCanvas(size.width, size.height);
					if (!hasDraw) {
						context.noLoop();
					}
					run([defaultSetup, setup, paint].filter(Boolean), data);
				};

				if (hasDraw) {
					const updateState = () => (data.state = update(data.state));
					context.draw = () => {
						run([updateState, draw], data);
					};
				}
			}, frame);
		},
		updateSetting<V>(settingName: keyof T, value: V) {
			Object.assign(data.settings, { [settingName]: value });
			setLocalSetting<T>(name, settingName, value);
			run([clean, paint], data);
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

const useState = <S>() => {
	checkCurrentPiece('useState');
	return currentPieceData.state as S;
};

const useSize = () => {
	checkCurrentPiece('useSize');
	return currentPieceData.size;
};

export { create, pieces, useContext, useSize, useSettings, useState };
