//
//  NavDelX.m
//  del_X
//
//  Created by shen xiaocheng on 11/12/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(NavDelX, NSObject)
RCT_EXTERN_METHOD(renderNaviDelX:(nonnull NSNumber *)originLat oriLon:(nonnull NSNumber *)originLon oriName:(NSString *)originName destLat:(nonnull NSNumber *)destinationLat destLon:(nonnull NSNumber *)destinationLon destName:(NSString *)destinationName)
@end
