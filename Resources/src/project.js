require = function t(e, o, n) {
	function r(l, s) {
		if (!o[l]) {
			if (!e[l]) {
				var i = "function" == typeof require && require;
				if (!s && i) return i(l, !0);
				if (c) return c(l, !0);
				var u = new Error("Cannot find module '" + l + "'");
				throw u.code = "MODULE_NOT_FOUND", u;
			}
			var a = o[l] = {
				exports: {}
			};
			e[l][0].call(a.exports, function(t) {
				var o = e[l][1][t];
				return r(o || t);
			}, a, a.exports, t, e, o, n);
		}
		return o[l].exports;
	}
	for (var c = "function" == typeof require && require, l = 0; l < n.length; l++) r(n[l]);
	return r;
}({
	HelloWorld: [function(t, e, o) {
		"use strict";
		cc._RF.push(e, "280c3rsZJJKnZ9RqbALVwtK", "HelloWorld");
		cc.Class({
			extends: cc.Component,
			properties: {
				label: {
					default: null,
					type: cc.Label
				},
				text: "Hello, World!"
			},
			onLoad: function() {
				this.label.string = this.text;
			},
			update: function(t) {}
		});
		cc._RF.pop();
	}, {}],
	testbutton: [function(t, e, o) {
		"use strict";
		cc._RF.push(e, "b6a52AhNWVJ6oIZk3VBVDFd", "testbutton");
		cc.Class({
			extends: cc.Component,
			properties: {},
			start: function() {
				this.node.on("touchend", function() {
					console.log("js --------> oc");
					var t = jsb.reflection.callStaticMethod("NativeOcClass", "callNativeUIWithTitle:andContent:", "cocos2d-js", "Yes! you call a Native UI from Reflection");
					console.log(t);
				});
			}
		});
		cc._RF.pop();
	}, {}]
}, {}, ["HelloWorld", "testbutton"]);
