import './pieces/*.ts';
import { pieces, piecesData } from './Piece';
import page from 'page';

const wall = document.getElementById('wall');

page('/p/:id', (event) => {
	console.log('id', event.params.id);

	pieces.get(event.params.id).attach(wall);
});

page();

const showSettingsPanel = () => {
	import('./settings').then(({ createSettingPanel }) => {
		createSettingPanel(pieces, piecesData);
	});
};

if (location.search.includes('showSettingsPanel')) {
	showSettingsPanel();
}

Object.assign(window, { showSettingsPanel });
