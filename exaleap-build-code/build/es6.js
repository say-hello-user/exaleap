import glob from 'glob';
import postcss from 'rollup-plugin-postcss';

// PostCSS plugins
import simplevars from 'postcss-simple-vars';

const topFolder = 'src/pages/'
let config = [];
let files = glob.sync(topFolder + '**/*.js');

let modeName = 'gx';
let plugins = [
	postcss({
		plugins: [
			simplevars(),
		],
		extensions: [ '.css' ]
	})
];

files.forEach(function (file) {
    //得到文件名
    let name = /.*\/(.*?\/*)\.js/.exec(file);
    if (name == null) {
        return
    }
    let folder;
    let ss = file.replace(topFolder, '').split('/');
    if (ss.length === 2) {
        folder = ss[0];
    }
    name = name[1];
    name = name.toString().replace('js/pages/', '');
    if (folder && folder !== name) {
        return;
	}
    config.push({
		input: file,
    	output: {
			file: `../${name}/dist/js/index.js`,
    		format: 'iife'
    	},
		name: modeName,
		globals: 'window',
    	plugins
    });
});

export default config;