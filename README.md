# 手把手教你swift项目集成cocos2dx-js模块


前几天在swift项目中集成了Lua模块，使得在swift工程中用Lua写游戏逻辑成为了可能，具体工程及配置见[手把手教你swift项目添加cocos2dx-lua](https://github.com/usiege/CocosLua)，由于公司最近要把js做的小游戏集成到iOS原生应用中，于是我们将解锁另外一个场景，好了，下面开始；

## 同样的，首先你得有一个swift项目
我们从头开始，建立一个swift项目；我们默认你已经可以自己创建一个全新的swift项目了，这很简单，不是么？
![swift项目结构][1]

## 我们用Cocos2dx创建一个JS的项目
这里我们给出两种方式创建，无论哪一种，我们的集成过程都大致相同，你可以选择任何一种你认为可用的方式；

### CocosCreator方法集成
我们最终需要的是如图下的这种目录结构，如果你已经知道这些东西是怎么弄出来的，那么，请跳过本段：
![JS项目结构][2]

新建一个CocosCreator项目，在里面完成所有JS的逻辑，你也可以先设置一个空的项目，我们先把工程集成完成；
![CocosCreator工程][3]

成功后我们点击项目--->构建发布：
![构建发布][4]

发布平台选择iOS，选择一个本地发布路径；模板选择deafault，这个模式下会生成需要的cocos2dx文件夹，我们需要这个库文件夹；暂时不要勾选加密，加密的没有经过实践；

![构建选项，划重点][5]

构建好了就会生成上面的JS项目类似结构；

### 命令行方式集成
这种方式类似于Lua集成方式，具体请参照[手把手教你swift项目添加cocos2dx-lua](https://github.com/usiege/CocosLua)中的**创建一个cocos2dx-lua项目**部分，只需要将命令行中的语言改为js就可以了：
```
$ ./cocos new Nothing-lua -p com.charles.nothing -l js -d /Users/dizi/Desktop
```

## 开始集成

1. 拷贝cocos2dx
我们需要将`frameworks--->cocos2d-x`拷贝到swift目录下，注意，gitignore（自行google）：
![拷贝cocos2d-x][6]

2. 拷贝Classes
我们需要将`frameworks/runtime-src/Classes`拷贝到swift目录下:
![拷贝Classes][7]

3. Resources
swift项目下建立`Resources`文件夹，将js项目资源拷贝到该目录下，如图：
![拷贝资源][8]
还有一件重要的事情，这里有一个JS依赖文件夹，需要被引入，如图：
![JS依赖][9]

4. 建立工程依赖
打开swift项目，引入资源：
![不要问我那些蓝色文件与黄色文件的区别][10]
添加依赖工程，打开swift项目，找到我们上面拷贝的cocos2d-x，在`cocos2d-x/build`下找到`cocos2d_libs.xcodeproj`，拖到工程中；
![cocos2d_libs.xcodeproj][11]
在`cocos2d-x/cocos/scripting/js-bindings/proj.ios_mac/`下找到`cocos2d_js_bindings.xcodeproj`拖到工程中；
![cocos2d_js_bindings.xcodeproj][12]
完成后如图：
![JS依赖][13]

5. 配置参数
这项也很重要：
![Enable Bitcode][14]
在工程`Build Phases`添加依赖：
![添加依赖][15]
差点忘了一步，添加依赖库：
![frameworks][16]
在工程`Build Settings--->Header search paths`中添加路径:
![Be patient!][17]
在添加路径的过程中你需要非常的耐心，因为有可能由于cocos2dx不同的版本会出现需要不同的文件的情况，所以，请仔细查找添加到里面就可以了；

6. build成功，我需要一张图来庆祝一下！！！
![Congratulations!][18]

## 我们来写点代码跑我们的JS

首先我们需要一个桥接文件把C++的初始化操作完成；这里我们需要用OC的桥接类来完成这个任务，我自己创建了一个叫做`CocosBridge`的类，成生后我们**把.m改为.mm**，这个过程会自动生成一个桥接文件，如果没有自动生成，那么你需要再添加一个`CocosJS-Bridge-Header.h`的头文件，并把该文件的路径设置到`build settings`，如下：
![CocosBridge][19]
![CocosJS-Bridge-Header.h][20]

下面我直接上代码了，具体过程自己体会，之后我们一起来研究；

```objective-c
#import <Foundation/Foundation.h>
#import "CocosViewController.h"

@interface CocosBridge : NSObject

+ (instancetype)shared;

@property(nonatomic) CocosViewController* viewController;

- (void)detoryCocos;

@end
```
```objective-c
#import "CocosBridge.h"

#import "cocos2d.h"
#import "AppDelegate.h"
#import "CocosViewController.h"

@interface CocosBridge()
{
    cocos2d::Application *_app;
}
@end

static AppDelegate* _cocosDelegate = nil;
@implementation CocosBridge

- (instancetype)init
{
    self = [super init];
    if (self) {
        _cocosDelegate = new AppDelegate();
        
        //cocos2d initiatial
        self.setupCocos;
    }
    return self;
}

static CocosBridge* _bridge = nil;

+ (instancetype)shared {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _bridge = [[CocosBridge alloc] init];
    });
    return _bridge;
}


- (void)setupCocos {
    
    cocos2d::Application *app = cocos2d::Application::getInstance();
    
    // Initialize the GLView attributes
    app->initGLContextAttrs();
    cocos2d::GLViewImpl::convertAttrs();
    
    CocosViewController* cocosvc = [[CocosViewController alloc] init];
    cocosvc.wantsFullScreenLayout = YES;
    
    cocos2d::GLView *glview = cocos2d::GLViewImpl::createWithEAGLView((__bridge void *)cocosvc.view);
    cocos2d::Director::getInstance()->setOpenGLView(glview);
    
    app->run();
    
    self.viewController = cocosvc;
    _app = app;
}

- (void)detoryCocos {
    _app->destroyInstance();
}
@end
```

```objective-c
#import <UIKit/UIKit.h>

@interface CocosViewController : UIViewController {
    
}
- (BOOL) prefersStatusBarHidden;

@end
```
```objective-c

#import "CocosViewController.h"
#import "cocos2d.h"
#import "platform/ios/CCEAGLView-ios.h"

#import "CocosBridge.h"

@implementation CocosViewController


// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
    // Initialize the CCEAGLView
    CCEAGLView *eaglView = [CCEAGLView viewWithFrame: [UIScreen mainScreen].bounds
                                         pixelFormat: (__bridge NSString *)cocos2d::GLViewImpl::_pixelFormat
                                         depthFormat: cocos2d::GLViewImpl::_depthFormat
                                  preserveBackbuffer: NO
                                          sharegroup: nil
                                       multiSampling: NO
                                     numberOfSamples: 0 ];
    
    // Enable or disable multiple touches
    [eaglView setMultipleTouchEnabled:NO];
    
    // Set EAGLView as view of RootViewController
    self.view = eaglView;
    
    
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    CocosBridge* cb = CocosBridge.shared;
//    cb.detoryCocos;
}


// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (NSUInteger) supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAllButUpsideDown;
}
#endif

- (BOOL) shouldAutorotate {
    return YES;
}

- (void)didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation {
    [super didRotateFromInterfaceOrientation:fromInterfaceOrientation];

    auto glview = cocos2d::Director::getInstance()->getOpenGLView();

    if (glview)
    {
        CCEAGLView *eaglview = (__bridge CCEAGLView *)glview->getEAGLView();

        if (eaglview)
        {
            CGSize s = CGSizeMake([eaglview getWidth], [eaglview getHeight]);
            cocos2d::Application::getInstance()->applicationScreenSizeChanged((int) s.width, (int) s.height);
        }
    }
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}
@end
```

然后我们在`ViewController`里添加一个按钮，推出我们的JS页面，上图吧：

```
    @IBAction func testAction(_ sender: Any) {
        let cocosbridge = CocosBridge.shared()
        let cocosvc = cocosbridge?.viewController
        navigationController?.pushViewController(cocosvc!, animated: true)
    }
```
![完成！！！][21]

### 如果你想知道在这个工程中js和oc是如何互相调用的，那么我们请看这篇：
[本篇还有后续](https://github.com/usiege/CocosJS/blob/master/README2.md)


  [1]: http://static.zybuluo.com/usiege/yqrdvidd7epqxjltfvrgtysf/image_1cf9dr09f7f8urifpm3pa4bg9.png
  [2]: http://static.zybuluo.com/usiege/u8yfh2zybhytwrsgqvf6e1xh/image_1cf9g35u31c6chvamcu1idd3ntm.png
  [3]: http://static.zybuluo.com/usiege/i5z30x4o549nw7mmtahlxoa0/image_1cf9geajn1792k431mvi2kg9j313.png
  [4]: http://static.zybuluo.com/usiege/wwurwri3ebcrx05xifr0qjbo/image_1cf9gt11812enkm0d3c99c3qk1g.png
  [5]: http://static.zybuluo.com/usiege/rp9h61z9a4x1sc4hv9yfgkc5/image_1cf9h3npfmmhmhd9ii1v0ama41t.png
  [6]: http://static.zybuluo.com/usiege/qnh2f78lggzej9eb7szdpeab/image_1cf9hjta01op51vs51bgg1dspc0f2a.png
  [7]: http://static.zybuluo.com/usiege/28hogjpi5vd1mv4zo9ure6cf/image_1cf9hr2oj1i831c80hac1e8fo12n.png
  [8]: http://static.zybuluo.com/usiege/zs8ni480pwkcue4rk166s83u/image_1cf9huoo9go8e6rokaqau5c034.png
  [9]: http://static.zybuluo.com/usiege/rf8zn4sz6wixtn3wwutxb9x9/image_1cf9shqh9a82edna2otdgp79p.png
  [10]: http://static.zybuluo.com/usiege/9y76gy2qcdo22c3dwfuzb8p7/image_1cf9ib072nr61qafeku190k25o4h.png
  [11]: http://static.zybuluo.com/usiege/dyf807hcs0z74z34y60wp9cr/image_1cf9igoo21m72vai10771bts3hu4u.png
  [12]: http://static.zybuluo.com/usiege/b3nb4j8migx2fl5tijy59bq5/image_1cf9ijkqiqjmjcoqhcgsiqr5r.png
  [13]: http://static.zybuluo.com/usiege/1sz3tj86m6ymblkc20v1yr1u/image_1cf9se04j17hf1nnek1lu48lne7s.png
  [14]: http://static.zybuluo.com/usiege/pp6tlmwat1zmh5hbc0ay2uft/image_1cf9k76sq1vjq1vve165k6u11n7g7f.png
  [15]: http://static.zybuluo.com/usiege/bdqt1d7a6faf38vnkihztfrn/image_1cf9ioqa1cu4kud2l1gj1n4f6l.png
  [16]: http://static.zybuluo.com/usiege/lltp9d8slxs5bdnm29869o6b/image_1cf9k5th5vef1t4tsjvtib1f1772.png
  [17]: http://static.zybuluo.com/usiege/j17pj8orqs1xcahjyds5em6n/image_1cf9sn6t8qqr6n61lma1l50luna6.png
  [18]: http://static.zybuluo.com/usiege/8aput74ae6gwq7axtqmsrjto/image_1cf9sqhc1v0k7fr1r3a1o1obs7aj.png
  [19]: http://static.zybuluo.com/usiege/u0ks9mrt4znuz1me2weo0413/image_1cf9t8m9c170liqf873i228b8b0.png
  [20]: http://static.zybuluo.com/usiege/f90ncmtsewljse3xyjw3cwl6/image_1cf9t9bq9r5i17qqu80s25f7gbd.png
  [21]: http://static.zybuluo.com/usiege/w0wl0yqcq34qx246h7zfk2p9/image_1cf9v50dlcfn13h1n2c1e2d1ggucq.png