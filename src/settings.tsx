import h, { append, replaceContent, setStyles } from './utils/h';
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
		const id = data.name + '-' + setting;
		const value = settings[setting];
		const type = typeof value;
		const onChange = (event: Event) => {
			const input = event.target as HTMLInputElement;

			piece.updateSetting(
				setting,
				type === 'number' ? Number(input.value) : input.value,
			);
		};

		return (
			<div>
				<label htmlFor={id}>{setting}</label>
				<input onChange={onChange} type={type} id={id} value={value} />
			</div>
		);
	});
};

const createSettingPanel = (pieces: Pieces, piecesData: PiecesData) => {
	const keys = Array.from(pieces.keys());
	const defaultNamePiece = keys[0];

	const settingsContainer = (
		<div>
			{createSettingInput(
				pieces.get(defaultNamePiece),
				piecesData.get(defaultNamePiece),
			)}
		</div>
	);

	const onChange = (event: Event) => {
		const select = event.target as HTMLSelectElement;

		replaceContent(
			settingsContainer,
			createSettingInput(
				pieces.get(select.value),
				piecesData.get(select.value),
			),
		);
	};

	const panel = (
		<div>
			<select onChange={onChange} value={keys[0]}>
				{keys.map((name) => (
					<option value={name}>{name}</option>
				))}
			</select>
			{settingsContainer}
		</div>
	);

	setStyles(panel, {
		position: 'fixed',
		bottom: '0px',
		width: '100%',
		background: 'white',
		boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
	});

	append(panel, document.body);
};

export { createSettingPanel };
