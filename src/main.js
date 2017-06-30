import './main.scss';
// tree-shaking 演示，只引用了utils中的haha, 使用 npm start之后可以看到压缩后的代码没有hehe这个方法（因为它没有被使用）
import {haha} from './common/utils';

import $ from 'jquery';

console.log($("body"));

haha()

var button = document.getElementById("btn");

button.addEventListener('click', (e) => {
	//以 webpack.ensure包裹的代码打包的时候会单独打包
	require.ensure([], function(require){
		var Cmpa = require('./cmps/cmpa');
		document.body.append(new Cmpa('这是cmpa'));
	}, 'extraCmp')
})