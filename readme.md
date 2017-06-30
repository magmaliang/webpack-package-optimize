## 概述

主要演示 webpack2 打包方面的优化。其环境就是当前项目，可以直接运行以体验。

## code-splitting

### css

如果将css和js包混在一起打成一个大包，则需要等待主包加载完才会插入js。这样主要有两个弊端：

1. 在css的模块加载完之前，界面上无法应用样式。
2. 没有利用浏览器并发加载资源的特性。css这种和js无关的资源其实分开加载较好，它并没有什么依赖。

extract-text-webpack-plugin 可以将所有css单独抽离打成一个包，配置如下：

```javascript
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// module 的rules结点
rules: [
	{
		test: /\.css$/,
		use: ExtractTextPlugin.extract({
			use: 'css-loader'
		})
	}
	, {
		test: /\.scss$/,
		use: ExtractTextPlugin.extract({
			fallbackLoader: "style-loader",
			loader: "css-loader!sass-loader",
		})
	}
]

// plugins 结点 
plugins: [new ExtractTextPlugin('styles.css')]

```

### js

js 的 code splitting 主要的思想是将首屏或者主逻辑不需要的包单独打包，在需要他们的时候再去加载。这并不需要如何去配置，只是在引入模块的时候使用特殊语法即可。

```javascript
// 假设在点击一个 #tbn 的元素的时候，需要加载一个组件CmpA, 然后随便渲染在什么地方去吧~
var button = document.getElementById("btn");

button.addEventlistener('click', (e) => {
	//以 webpack.ensure包裹的代码打包的时候会单独打包
	webpack.ensure([], function(){
		var Cmpa = require('./cmps/cmpa');
		document.body.append(new Cmpa);
	}, 'extraCmp')
})

```

这样点击这个 #btn 元素的时候，extraCmpa 这个 bundle 就会加载。在本目录执行 webpack 生成release后打开目录下的index.html可以看到效果。


## tree-shaking

这尼玛的不好翻译，就叫树筛选吧。webpack2 在打包时会给没有用的模块内部对象打上标记，然后在执行webpack命令的时候使用 **--optimize-minimize** 这个选项，压缩之后的代码便没有多余的模块。

在本项目中，入口文件 **src/main.js** 中只引用了 **src/common/utils** 的部分对象，执行 npm start 后观察 release下的main.js可以发现，只打包了utils中的部分代码。

ps: 和babel结合使用的时候比较恶心，请看下面参考文章的第一篇。

参考：[http://2ality.com/2015/12/webpack-tree-shaking.html](http://2ality.com/2015/12/webpack-tree-shaking.html)
<br/>
[https://webpack.js.org/guides/tree-shaking/#components/sidebar/sidebar.jsx](https://webpack.js.org/guides/tree-shaking/#components/sidebar/sidebar.jsx)

## external

假设有这样一想场景：

>项目有两个组件包，都是react组件，因为某种原因不能合并成一个包。这样必须把react提成公共部分，在两个包之前加载。

external 的作用就是打包时不打包其指定的依赖，转而从全局环境中读。


