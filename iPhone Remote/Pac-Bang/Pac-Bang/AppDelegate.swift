//
//  AppDelegate.swift
//  Pac-Bang
//
//  Created by Peng Jin on 5/8/15.
//  Copyright (c) 2015 Elvin Jin. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift
import AudioToolbox

let kUp = 0
let kDown = 1
let kLeft = 2
let kRight = 3

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
//    let socket = SocketIOClient(socketURL: "heygirls.cloudapp.net")
    let socket = SocketIOClient(socketURL: "192.168.213.96:3000")

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        self.addHandlers()

        return true
    }

    func applicationWillResignActive(application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }
    
    func applicationWillEnterForeground(application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    }
    
    func applicationDidBecomeActive(application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }
    
    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
    
    func addHandlers() {
        self.socket.on("disconnect", callback: { [weak self] (data, ack) -> Void in
            let mainNav = self?.window?.rootViewController as! UINavigationController
            mainNav.popToRootViewControllerAnimated(true)
            })
        
        self.socket.on("iOSHit", callback: { (data, ack) -> Void in
            AudioServicesPlayAlertSound(SystemSoundID(kSystemSoundID_Vibrate))
        })
    }
    
    func moveOn(direction: Int) {
        var data = NSMutableDictionary()
        data["type"] = "on"
        
        switch direction {
        case kUp:
            data["direction"] = "up"
            print("Up")
            break
        case kDown:
            data["direction"] = "down"
            print("Down")
            break
        case kLeft:
            data["direction"] = "left"
            print("Left")
            break
        case kRight:
            data["direction"] = "right"
            print("Right")
            break
        default:
            break
        }
        println(" enter")
        
        var params = ["con": data,
            "type":"iOSMove",
            "t":"\(Int(NSDate().timeIntervalSince1970 * 1000.0))"
        ]
        self.socket.emit("message", params)
    }
    
    func moveOff(direction: Int) {
        var data = NSMutableDictionary()
        data["type"] = "off"

        switch direction {
        case kUp:
            data["direction"] = "up"
            print("Up")
            break
        case kDown:
            data["direction"] = "down"
            print("Down")
            break
        case kLeft:
            data["direction"] = "left"
            print("Left")
            break
        case kRight:
            data["direction"] = "right"
            print("Right")
            break
        default:
            break
        }
        println(" exit")
        
        var params = ["con": data,
            "type":"iOSMove",
            "t":"\(Int(NSDate().timeIntervalSince1970 * 1000.0))"
        ]
        self.socket.emit("message", params)
    }
    
    func shoot() {
        var params = ["type":"iOSShoot",
            "t":"\(Int(NSDate().timeIntervalSince1970 * 1000.0))"
        ]
        self.socket.emit("message", params)

    }

}

