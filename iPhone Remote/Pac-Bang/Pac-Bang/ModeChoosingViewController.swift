//
//  ModeChoosingViewController.swift
//  Pac-Bang
//
//  Created by Peng Jin on 5/13/15.
//  Copyright (c) 2015 Elvin Jin. All rights reserved.
//

import UIKit

class ModeChoosingViewController: UIViewController {

    @IBOutlet var buttonControlButton: UIButton!
    @IBOutlet var gravityControlButton: UIButton!
    @IBOutlet var disconnectButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        buttonControlButton.layer.borderColor = UIColor.whiteColor().CGColor
        gravityControlButton.layer.borderColor = UIColor.whiteColor().CGColor
        disconnectButton.layer.borderColor = UIColor.whiteColor().CGColor
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func disconnectButtonClicked(sender: AnyObject) {
        let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
        appDelegate.socket.close(fast: true)
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
