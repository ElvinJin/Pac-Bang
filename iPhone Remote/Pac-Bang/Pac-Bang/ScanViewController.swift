//
//  ScanViewController.swift
//  Pac-Bang
//
//  Created by Peng Jin on 5/13/15.
//  Copyright (c) 2015 Elvin Jin. All rights reserved.
//

import UIKit
import AVFoundation
import MBProgressHUD

class ScanViewController: UIViewController {

    @IBOutlet var scanButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.scanButton.layer.borderColor = UIColor.whiteColor().CGColor
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func didReadQRCode(username: NSString, sessionId: NSString) {
        println("Username: \(username)")
        println("Session ID: \(sessionId)")
        var hud = MBProgressHUD.showHUDAddedTo(self.view, animated: true)
        hud.detailsLabelText = "Connecting"
    }

    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "scan" {
            var vc = segue.destinationViewController as? ScanCameraViewController
            vc?.mainScanVC = self
        }
    }

}
