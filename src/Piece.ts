import p5 from 'p5';
import { Size } from './types';
import { clean } from './utils/canvas';

type PieceSize = number | Size;
// TODO: add an auto clean
interface PieceConfig<T, S> {
	name: string;
	type?: p5.WEBGL | p5.P2D;
	size?: PieceSize;
	setup?: () => void | S;
	draw?: () => void;
	update?: (state: S) => S;
	state?: S;
	settings?: T | ((context: p5) => T);
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

export interface Piece {
	attach: (parent: Element) => void;
	updateSetting: (settingName: string, value: any) => void;
}

export interface PieceData {
	context: p5;
	sizeAndCenter: Size & { centerX: number; centerY: number };
	name: string;
	state: unknown;
	settings?: unknown;
}

const pieces = new Map<string, Piece>();
const piecesData = new Map<string, PieceData>();

export type Pieces = typeof pieces;
export type PiecesData = typeof piecesData;

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

const setLocalSetting = (name: string, settingName: string, value: unknown) => {
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
		type,
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
		sizeAndCenter: {
			...size,
			centerX: size.width / 2,
			centerY: size.height / 2,
		},
		settings: {},
	};

	piecesData.set(name, data);

	const piece = {
		attach(parent: Element) {
			parent.appendChild(container);

			new p5((sketch: p5) => {
				context = sketch;
				context.setup = () => {
					context.createCanvas(size.width, size.height, type);
					if (!draw) {
						context.noLoop();
					}

					data.settings = {
						...(typeof settings === 'object' ? settings : settings(context)),
						...localSettings,
					};

					run(
						[
							defaultSetup,
							() => {
								const state = setup();
								if (state) {
									data.state = state;
								}
							},
							draw,
						].filter(Boolean),
						data,
					);
				};

				if (draw) {
					const updateState = () => {
						if (typeof update === 'function') {
							data.state = update(data.state);
						}
					};
					context.draw = () => {
						run([updateState, draw], data);
					};
				}
			}, frame);
		},
		updateSetting(settingName: string, value: unknown) {
			if (value === data.settings[settingName]) {
				return;
			}

			Object.assign(data.settings, { [settingName]: value });
			setLocalSetting(name, settingName, value);

			run(
				[
					clean,
					defaultSetup,
					() => {
						const state = setup();
						if (state) {
							data.state = state;
						}
					},
					,
					draw,
				].filter(Boolean),
				data,
			);
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
	return currentPieceData.sizeAndCenter;
};

const WEBGL = 'webgl';

export { Vector } from 'p5';
export {
	run,
	WEBGL,
	create,
	pieces,
	piecesData,
	useContext,
	useSize,
	useSettings,
	useState,
};

const Piece = {
	create,
	pieces,
	piecesData,
	useContext,
	useSize,
	useSettings,
	useState,
};

export default Piece;
