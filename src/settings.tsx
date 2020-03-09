import '@plata/prop-events';
import * as P from '@plata/core';
import { Pieces, PiecesData, PieceData, Piece } from './Piece';

const createSettingInput = (piece: Piece, data: PieceData) => {
	const settings: Record<string, string | number> = data.settings as Record<
		string,
		string | number
	>;

	if (!settings) {
		return [];
	}

	const keys = Object.keys(settings);

	return keys.map((setting) => {
		const ref = P.createRef<HTMLInputElement>();
		const id = data.name + '-' + setting;
		const value = settings[setting];
		const type = typeof value;

		const debounce = (fn: Function, wait: number) => {
			let timer: number;
			return (...args: any[]) => {
				clearTimeout(timer);

				timer = setTimeout(() => {
					fn(...args);
				}, wait);
			};
		};

		P.on(
			ref,
			'keyup',
			debounce((event: P.Event<HTMLInputElement>) => {
				piece.updateSetting(
					setting,
					type === 'number' ? Number(event.target.value) : event.target.value,
				);
			}, 200),
		);

		return (
			<div>
				<label htmlFor={id}>{setting}</label>
				<input ref={ref} type={type} id={id} value={String(value)} />
			</div>
		);
	});
};

interface Props {
	pieces: Pieces;
	piecesData: PiecesData;
}

const SettingPanel = (props: Props) => {
	const { pieces, piecesData } = props;
	const keys = Array.from(pieces.keys());
	const defaultNamePiece = keys[0];
	const settingsContainerRef = P.createRef<HTMLDivElement>();
	const panelRef = P.createRef<HTMLDivElement>();

	const onChange = (event: Event) => {
		const select = event.target as HTMLSelectElement;

		P.replaceContent(
			settingsContainerRef,
			createSettingInput(
				pieces.get(select.value),
				piecesData.get(select.value),
			),
		);
	};

	P.setStyles(panelRef, {
		position: 'fixed',
		bottom: '0px',
		width: '100%',
		background: 'white',
		boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
	});

	return (
		<div ref={panelRef}>
			<select onChange={onChange} value={keys[0]}>
				{keys.map((name) => (
					<option value={name}>{name}</option>
				))}
			</select>
			<div ref={settingsContainerRef}>
				{createSettingInput(
					pieces.get(defaultNamePiece),
					piecesData.get(defaultNamePiece),
				)}
			</div>
		</div>
	);
};

const createSettingPanel = (pieces: Pieces, piecesData: PiecesData) => {
	P.render(
		<SettingPanel pieces={pieces} piecesData={piecesData} />,
		document.body,
	);
};

export { createSettingPanel };
