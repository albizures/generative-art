import './pieces/*.ts';
import { pieces } from './Piece';

const list = Array.from(pieces).sort(([a], [b]) => {
	if (a > b) {
		return -1;
	}
	if (b > a) {
		return 1;
	}
	return 0;
});

Object.assign(window, { pieces });

list.forEach(([, item]) => item.attach());
