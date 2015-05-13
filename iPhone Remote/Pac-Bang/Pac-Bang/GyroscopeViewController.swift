//
//  GyroscopeViewController.swift
//  Pac-Bang
//
//  Created by Peng Jin on 5/9/15.
//  Copyright (c) 2015 Elvin Jin. All rights reserved.
//

import UIKit
import CoreMotion

class GyroscopeViewController: UIViewController {
    let manager = CMMotionManager()
    
    @IBOutlet var itemOneButton: UIButton!
    @IBOutlet var itemTwoButton: UIButton!
    @IBOutlet var backButton: UIButton!
    
    let upThreshold = sin(5.0 / 180.0 * M_PI)
    let downThreshold = sin(45.0 / 180.0 * M_PI)
    let leftThreshold = 0 - sin(20.0 / 180.0 * M_PI)
    let rightThreshold = sin(20.0 / 180.0 * M_PI)
    
    var lastX: Double = 0
    var lastY: Double = 0
    var lastZ: Double = 0
    
    let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate

    override func viewDidLoad() {
        super.viewDidLoad()
        backButton.layer.borderColor = UIColor.whiteColor().CGColor

        manager.deviceMotionUpdateInterval = 0.1
        
        if manager.deviceMotionAvailable {
            manager.deviceMotionUpdateInterval = 0.01
            manager.startDeviceMotionUpdatesToQueue(NSOperationQueue.mainQueue()) {
                [weak self] (data: CMDeviceMotion!, error: NSError!) in
        
                // Up
                if data.gravity.x <= self?.upThreshold && self?.lastX > self?.upThreshold {
                    self?.appDelegate.moveOn(kUp)
                } else if data.gravity.x > self?.upThreshold && self?.lastX <= self?.upThreshold {
                    self?.appDelegate.moveOff(kUp)
                }
                
                // Down
                if data.gravity.x >= self?.downThreshold && self?.lastX < self?.downThreshold {
                    self?.appDelegate.moveOn(kDown)
                } else if data.gravity.x < self?.downThreshold && self?.lastX >= self?.downThreshold {
                    self?.appDelegate.moveOff(kDown)
                }
                
                // Left
                if data.gravity.y <= self?.leftThreshold && self?.lastY > self?.leftThreshold {
                    self?.appDelegate.moveOn(kLeft)
                } else if data.gravity.y > self?.leftThreshold && self?.lastY <= self?.leftThreshold {
                    self?.appDelegate.moveOff(kLeft)
                }
                
                // Right
                if data.gravity.y >= self?.rightThreshold && self?.lastY < self?.rightThreshold {
                    self?.appDelegate.moveOn(kRight)
                } else if data.gravity.y < self?.rightThreshold && self?.lastY >= self?.rightThreshold {
                    self?.appDelegate.moveOff(kRight)
                }
                
                self?.lastX = data.gravity.x
                self?.lastY = data.gravity.y
                self?.lastZ = data.gravity.z
                
//                println("----------------------------")
//                println("gravity X: \(data.gravity.x)")
//                println("gravity Y: \(data.gravity.y)")
//                println("gravity Z: \(data.gravity.z)")
//                println("----------------------------")
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func shootButtonTapped(sender: AnyObject) {
        self.appDelegate.shoot()
    }
    
    @IBAction func backButtonClicked(sender: AnyObject) {
        let alertController = UIAlertController(title: "Back clicked", message: "Stop control the game role?", preferredStyle: UIAlertControllerStyle.Alert)
        alertController.addAction(UIAlertAction(title: "Yes", style: UIAlertActionStyle.Default, handler: { (UIAlertAction) -> Void in
            self.navigationController?.popViewControllerAnimated(true)
        }))
        alertController.addAction(UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel, handler: nil))
        self.presentViewController(alertController, animated: true, completion: nil)
    }
}
