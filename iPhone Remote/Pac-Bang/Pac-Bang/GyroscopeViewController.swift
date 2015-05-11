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
    
    let upThreshold = sin(5.0 / 180.0 * M_PI)
    let downThreshold = sin(45.0 / 180.0 * M_PI)
    
    var lastX: Double = 0
    var lastY: Double = 0
    var lastZ: Double = 0
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        manager.deviceMotionUpdateInterval = 0.1
        
        if manager.deviceMotionAvailable {
            manager.deviceMotionUpdateInterval = 0.01
            manager.startDeviceMotionUpdatesToQueue(NSOperationQueue.mainQueue()) {
                [weak self] (data: CMDeviceMotion!, error: NSError!) in
                
//                println(self?.upThreshold)
//                println(self?.downThreshold)
                
                self?.lastX = data.gravity.x
                self?.lastY = data.gravity.y
                self?.lastZ = data.gravity.z
                
                println("----------------------------")
                println("gravity X: \(data.gravity.x)")
                println("gravity Y: \(data.gravity.y)")
                println("gravity Z: \(data.gravity.z)")
                println("----------------------------")
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func moveEnter(direction: Int) {
        switch direction {
        case 0:
            print("Up")
            break
        case 1:
            print("Down")
            break
        case 2:
            print("Left")
            break
        case 3:
            print("Right")
            break
        default:
            break
        }
        println(" enter")
    }
    
    func moveExit(direction: Int) {
        switch direction {
        case 0:
            print("Up")
            break
        case 1:
            print("Down")
            break
        case 2:
            print("Left")
            break
        case 3:
            print("Right")
            break
        default:
            break
        }
        println(" exit")
    }
    
    @IBAction func itemOneTapped(sender: AnyObject) {
        println("Item 1 tapped");
    }
    
    @IBAction func itemTwoTapped(sender: AnyObject) {
        println("Item 2 tapped");
    }
    
    @IBAction func shootButtonTapped(sender: AnyObject) {
        println("Shoot tapped");
    }
}
