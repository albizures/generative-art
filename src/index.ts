import './pieces/*.ts';
import { pieces, piecesData } from './Piece';

const list = Array.from(pieces).sort(([a], [b]) => {
	if (a > b) {
		return -1;
	}
	if (b > a) {
		return 1;
	}
	return 0;
});

const [wall] = document.getElementsByClassName('wall');

list.forEach(([, item]) => item.attach(wall));

const showSettingsPanel = () => {
	import('./settings').then(({ createSettingPanel }) => {
		createSettingPanel(pieces, piecesData);
	});
};

if (location.search.includes('showSettingsPanel')) {
	showSettingsPanel();
}

Object.assign(window, { showSettingsPanel });
