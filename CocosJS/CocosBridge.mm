//
//  CocosBridge.m
//  VIPX
//
//  Created by user on 2018/6/5.
//  Copyright © 2018年 VIPX. All rights reserved.
//

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
