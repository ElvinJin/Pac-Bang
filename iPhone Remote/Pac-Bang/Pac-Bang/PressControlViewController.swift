//
//  PressControlViewController.swift
//  Pac-Bang
//
//  Created by Peng Jin on 5/9/15.
//  Copyright (c) 2015 Elvin Jin. All rights reserved.
//

import UIKit

class PressControlViewController: UIViewController {
    
    @IBOutlet var backButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        backButton.layer.borderColor = UIColor.whiteColor().CGColor
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func backButtonClicked(sender: AnyObject) {
        self.navigationController?.popViewControllerAnimated(true)
    }
    
    @IBAction func moveEnter(sender: UIButton) {
        switch sender.tag {
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

    @IBAction func moveExit(sender: UIButton) {
        switch sender.tag {
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
