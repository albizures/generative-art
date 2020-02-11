module.exports = {
	presets: [
		// [
		// 	'@babel/plugin-transform-runtime',
		// 	{
		// 		regenerator: true,
		// 	},
		// ],
		['@babel/preset-env', { targets: { node: 'current' } }],
		'@babel/preset-typescript',
	],
};
