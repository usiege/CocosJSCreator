//
//  CocosBridge.h
//  VIPX
//
//  Created by user on 2018/6/5.
//  Copyright © 2018年 VIPX. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CocosViewController.h"

@interface CocosBridge : NSObject

+ (instancetype)shared;

@property(nonatomic) CocosViewController* viewController;

- (void)detoryCocos;

@end
