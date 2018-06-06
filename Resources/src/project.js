require = function t(e, i, n) {
function c(o, r) {
if (!i[o]) {
if (!e[o]) {
var a = "function" == typeof require && require;
if (!r && a) return a(o, !0);
if (s) return s(o, !0);
var h = new Error("Cannot find module '" + o + "'");
throw h.code = "MODULE_NOT_FOUND", h;
}
var u = i[o] = {
exports: {}
};
e[o][0].call(u.exports, function(t) {
var i = e[o][1][t];
return c(i || t);
}, u, u.exports, t, e, i, n);
}
return i[o].exports;
}
for (var s = "function" == typeof require && require, o = 0; o < n.length; o++) c(n[o]);
return c;
}({
Game: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "0486fOqHrJN+6c5PQg5FHh9", "Game");
var n = t("Player");
t("ScoreFX"), t("Star"), cc.Class({
extends: cc.Component,
properties: {
starPrefab: {
default: null,
type: cc.Prefab
},
scoreFXPrefab: {
default: null,
type: cc.Prefab
},
maxStarDuration: 0,
minStarDuration: 0,
ground: {
default: null,
type: cc.Node
},
player: {
default: null,
type: n
},
scoreDisplay: {
default: null,
type: cc.Label
},
scoreAudio: {
default: null,
url: cc.AudioClip
},
btnNode: {
default: null,
type: cc.Node
},
gameOverNode: {
default: null,
type: cc.Node
},
controlHintLabel: {
default: null,
type: cc.Label
},
keyboardHint: {
default: "",
multiline: !0
},
touchHint: {
default: "",
multiline: !0
}
},
onLoad: function() {
this.groundY = this.ground.y + this.ground.height / 2;
this.currentStar = null;
this.currentStarX = 0;
this.timer = 0;
this.starDuration = 0;
this.isRunning = !1;
var t = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
this.controlHintLabel.string = t;
this.starPool = new cc.NodePool("Star");
this.scorePool = new cc.NodePool("ScoreFX");
},
onStartGame: function() {
this.resetScore();
this.isRunning = !0;
this.btnNode.setPositionX(3e3);
this.gameOverNode.active = !1;
this.player.startMoveAt(cc.p(0, this.groundY));
this.spawnNewStar();
},
spawnNewStar: function() {
var t = null;
t = this.starPool.size() > 0 ? this.starPool.get(this) : cc.instantiate(this.starPrefab);
this.node.addChild(t);
t.setPosition(this.getNewStarPosition());
t.getComponent("Star").init(this);
this.startTimer();
this.currentStar = t;
},
despawnStar: function(t) {
this.starPool.put(t);
this.spawnNewStar();
},
startTimer: function() {
this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
this.timer = 0;
},
getNewStarPosition: function() {
this.currentStar || (this.currentStarX = cc.randomMinus1To1() * this.node.width / 2);
var t = 0, e = this.groundY + cc.random0To1() * this.player.jumpHeight + 50, i = this.node.width / 2;
t = this.currentStarX >= 0 ? -cc.random0To1() * i : cc.random0To1() * i;
this.currentStarX = t;
return cc.p(t, e);
},
gainScore: function(t) {
this.score += 1;
this.scoreDisplay.string = "Score: " + this.score.toString();
var e = this.spawnScoreFX();
this.node.addChild(e.node);
e.node.setPosition(t);
e.play();
cc.audioEngine.playEffect(this.scoreAudio, !1);
},
resetScore: function() {
this.score = 0;
this.scoreDisplay.string = "Score: " + this.score.toString();
},
spawnScoreFX: function() {
var t;
if (this.scorePool.size() > 0) return (t = this.scorePool.get()).getComponent("ScoreFX");
(t = cc.instantiate(this.scoreFXPrefab).getComponent("ScoreFX")).init(this);
return t;
},
despawnScoreFX: function(t) {
this.scorePool.put(t);
},
update: function(t) {
this.isRunning && (this.timer > this.starDuration ? this.gameOver() : this.timer += t);
},
gameOver: function() {
this.gameOverNode.active = !0;
this.player.enabled = !1;
this.player.stopMove();
this.currentStar.destroy();
this.isRunning = !1;
this.btnNode.setPositionX(0);
}
});
cc._RF.pop();
}, {
Player: "Player",
ScoreFX: "ScoreFX",
Star: "Star"
} ],
Player: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "c10bbPdGYhDWaLoKLV38bHf", "Player");
cc.Class({
extends: cc.Component,
properties: {
jumpHeight: 0,
jumpDuration: 0,
squashDuration: 0,
maxMoveSpeed: 0,
accel: 0,
jumpAudio: {
default: null,
url: cc.AudioClip
}
},
onLoad: function() {
this.enabled = !1;
this.accLeft = !1;
this.accRight = !1;
this.xSpeed = 0;
this.minPosX = -this.node.parent.width / 2;
this.maxPosX = this.node.parent.width / 2;
this.jumpAction = this.setJumpAction();
this.setInputControl();
},
setInputControl: function() {
var t = this;
cc.eventManager.addListener({
event: cc.EventListener.KEYBOARD,
onKeyPressed: function(e, i) {
switch (e) {
case cc.KEY.a:
case cc.KEY.left:
t.accLeft = !0;
t.accRight = !1;
break;

case cc.KEY.d:
case cc.KEY.right:
t.accLeft = !1;
t.accRight = !0;
}
},
onKeyReleased: function(e, i) {
switch (e) {
case cc.KEY.a:
case cc.KEY.left:
t.accLeft = !1;
break;

case cc.KEY.d:
case cc.KEY.right:
t.accRight = !1;
}
}
}, t.node);
cc.eventManager.addListener({
event: cc.EventListener.TOUCH_ONE_BY_ONE,
onTouchBegan: function(e, i) {
if (e.getLocation().x >= cc.winSize.width / 2) {
t.accLeft = !1;
t.accRight = !0;
} else {
t.accLeft = !0;
t.accRight = !1;
}
return !0;
},
onTouchEnded: function(e, i) {
t.accLeft = !1;
t.accRight = !1;
}
}, t.node);
},
setJumpAction: function() {
var t = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut()), e = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn()), i = cc.scaleTo(this.squashDuration, 1, .6), n = cc.scaleTo(this.squashDuration, 1, 1.2), c = cc.scaleTo(this.squashDuration, 1, 1), s = cc.callFunc(this.playJumpSound, this);
return cc.repeatForever(cc.sequence(i, n, t, c, e, s));
},
playJumpSound: function() {
cc.audioEngine.playEffect(this.jumpAudio, !1);
},
getCenterPos: function() {
return cc.p(this.node.x, this.node.y + this.node.height / 2);
},
startMoveAt: function(t) {
this.enabled = !0;
this.xSpeed = 0;
this.node.setPosition(t);
this.node.runAction(this.setJumpAction());
},
stopMove: function() {
this.node.stopAllActions();
},
update: function(t) {
this.accLeft ? this.xSpeed -= this.accel * t : this.accRight && (this.xSpeed += this.accel * t);
Math.abs(this.xSpeed) > this.maxMoveSpeed && (this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed));
this.node.x += this.xSpeed * t;
if (this.node.x > this.node.parent.width / 2) {
this.node.x = this.node.parent.width / 2;
this.xSpeed = 0;
} else if (this.node.x < -this.node.parent.width / 2) {
this.node.x = -this.node.parent.width / 2;
this.xSpeed = 0;
}
}
});
cc._RF.pop();
}, {} ],
ScoreAnim: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "b1f9e88YHdGr7qD17shtr2w", "ScoreAnim");
cc.Class({
extends: cc.Component,
init: function(t) {
this.scoreFX = t;
},
hideFX: function() {
this.scoreFX.despawn();
}
});
cc._RF.pop();
}, {} ],
ScoreFX: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "dd18c67pr9OM5wJb/yY6Onf", "ScoreFX");
cc.Class({
extends: cc.Component,
properties: {
anim: {
default: null,
type: cc.Animation
}
},
init: function(t) {
this.game = t;
this.anim.getComponent("ScoreAnim").init(this);
},
despawn: function() {
this.game.despawnScoreFX(this.node);
},
play: function() {
this.anim.play("score_pop");
}
});
cc._RF.pop();
}, {} ],
Star: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "21890Xr4RBJlqTJhmXJ/f5s", "Star");
cc.Class({
extends: cc.Component,
properties: {
pickRadius: 0,
game: {
default: null,
serializable: !1
}
},
onLoad: function() {
this.enabled = !1;
},
init: function(t) {
this.game = t;
this.enabled = !0;
this.node.opacity = 255;
},
reuse: function(t) {
this.init(t);
},
getPlayerDistance: function() {
var t = this.game.player.getCenterPos();
return cc.pDistance(this.node.position, t);
},
onPicked: function() {
var t = this.node.getPosition();
this.game.gainScore(t);
this.game.despawnStar(this.node);
},
update: function(t) {
if (this.getPlayerDistance() < this.pickRadius) this.onPicked(); else {
var e = 1 - this.game.timer / this.game.starDuration;
this.node.opacity = 50 + Math.floor(205 * e);
}
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Game", "Player", "ScoreAnim", "ScoreFX", "Star" ]);