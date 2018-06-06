# Cocos2dx-js与swift项目的互相调用


本篇是上一篇配置swift-cocos2dx-js的后续，如有不清楚请查看上篇[手把手教你swift项目集成cocos2dx-js模块](https://github.com/usiege/CocosJS)，具体代码也在此处；


## 用CocosCreator创建一个场景

打开CocosCreator新建一个项目
![新建js项目][1]

在项目中如图双击scene，点击精灵
![准备添加一个事件][2]

在script上右击新建一个脚本，将脚本拖到右边的属性选择器里；
![新建一个脚本][3]

双击打开脚本，我们在里面写点东西，这里是重点，敲黑板啦！！！
```js
// onLoad () {},

    start () {
        this.node.on('touchend',()=> {
            
            console.log('start btn load , this is also a test!');
            var ret = jsb.reflection.callStaticMethod("NativeOcClass", "callNativeUIWithTitle:andContent:", "cocos2d-js", "Yes! you call a Native UI from Reflection");
            console.log(ret);
        })
    },
//解释一下上面的代码
/*
我们实际上用到的只是一个方法，即callStaticMethod；
该方法的参数：
第一个：一个OC类名；
第二个：该OC对象的方法名；
第三个：就按这个写就可以了；
第四个：js要给oc传的参数；
*/
```

这样是不是不够直观，我们把项目构建好到swift工程里看一下；

点击CocosCreator菜单栏项目，构建发布，如图设置：
![构建发布][4]

在项目目录下找到如图文件：
![这些资源要拷贝][5]

## 我们转到swift项目中去

拷贝到Resources中：
![Resources][6]

打开之前的swift项目，将Resources中的文件引入到工程里：
![引入到swift工程][7]

打开`project.js`，可以看到我们之前写的事件：
```js
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
```

接下来我们写一个接收类：
![NativeOcClass][8]

```oc
#import <Foundation/Foundation.h>

@interface NativeOcClass : NSObject

+(NSString *)callNativeUIWithTitle:(NSString *) title andContent:(NSString *)content;

@end
```

```oc
#import "NativeOcClass.h"
#import <UIKit/UIKit.h>
@implementation NativeOcClass

+(NSString *)callNativeUIWithTitle:(NSString *) title andContent:(NSString *)content{
    printf("oc file called \n!");
    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:title message:content delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"OK", nil];
    [alertView show];
    return @"oc --------> js";
}

@end
```

我们弹出一个原生的Alert，并将结果返回给js；
看控制台打印：

![打印出来喽！][9]

好了，这篇算是一个补充，余下的就自己搞吧！！！
其实该项目的套路是通过c++跟js进行绑定，跟调用lua脚本的方法如出一辙，具体可参见网上的例子，单独写一个调用的例子，就很好理解了，本篇就到这里了，谢谢！！！

  [1]: http://static.zybuluo.com/usiege/eip7mgw056j3ywf0qpgmcu8m/image_1cfabu1tj9sd14fp82d5pvfvk9.png
  [2]: http://static.zybuluo.com/usiege/ogbb2ren37w7am2h32p53tsn/image_1cfac14uf1ljp121lfu71tnq1kr4m.png
  [3]: http://static.zybuluo.com/usiege/z0pie8qzxiyvi7j3rr9bxrtm/image_1cfachupv1fk61srv1lb91sk81psj13.png
  [4]: http://static.zybuluo.com/usiege/wgrpbk4kdvdhtx45e8l1j99a/image_1cfad49r0n0qtmtca115up381g.png
  [5]: http://static.zybuluo.com/usiege/s657c8vpfggbrodfhujvj8bi/image_1cfad5eji2b7e3ttib1b1h1ig61t.png
  [6]: http://static.zybuluo.com/usiege/6wve325sa8dc6kz243yc8uwh/image_1cfad7vodl4c1oicoio140h1rm92a.png
  [7]: http://static.zybuluo.com/usiege/yxm1pf6vfk6renm786n0j5cg/image_1cfada9chggo3p11nmagb3puk2n.png
  [8]: http://static.zybuluo.com/usiege/2tdwxye3zjb2njjcscizoan6/image_1cfaddqp818un1a3fb9j13205it34.png
  [9]: http://static.zybuluo.com/usiege/o84cqc480keeaoj89vsuwqh0/image_1cfadk65g1si71n351mjq1frrqr23h.png