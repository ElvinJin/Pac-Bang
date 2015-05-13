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
    let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
    var currentUsername: String = ""
    var currentSession: String = ""

    override func viewDidLoad() {
        super.viewDidLoad()

        self.scanButton.layer.borderColor = UIColor.whiteColor().CGColor
        self.addHandlers()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func didReadQRCode(username: String, sessionId: String) {
        println("Username: \(username)")
        println("Session ID: \(sessionId)")
        currentUsername = username
        currentSession = sessionId
        
        var hud = MBProgressHUD.showHUDAddedTo(self.view, animated: true)
        hud.detailsLabelText = "Connecting"
        
        appDelegate.socket.connect(timeoutAfter: 10) { () -> Void in
            MBProgressHUD.hideAllHUDsForView(self.view, animated: false)
        }
        
        var params = ["con":["username":"\(self.currentUsername)", "session":"\(self.currentSession)"],
            "type":"iOSAttach",
            "t":"\(NSDate().timeIntervalSince1970 * 1000.0)"
        ]
    }
    
    func addHandlers() {
        appDelegate.socket.on("connect", callback: { [weak self] (data, ack) -> Void in
            var content = ["username":"\(self!.currentUsername)", "session":"\(self!.currentSession)"]
            var params = ["con": content,
                "type":"iOSAttach",
                "t":"\(NSDate().timeIntervalSince1970 * 1000.0)"
            ]
            self?.appDelegate.socket.emit("message", params)
            })
        
        appDelegate.socket.on("iOSAttachSucceeded", callback: { [weak self] (data, ack) -> Void in
            MBProgressHUD.hideAllHUDsForView(self?.view, animated: false)
            self?.performSegueWithIdentifier("chooseMode", sender: self)
            })
        
        appDelegate.socket.on("iOSAttachFailed", callback: { [weak self] (data, ack) -> Void in
            MBProgressHUD.hideAllHUDsForView(self?.view, animated: false)
            var hud = MBProgressHUD.showHUDAddedTo(self?.view, animated: true)
            hud.detailsLabelText = "Invalid QR Code"
            hud.hide(true, afterDelay: 2)
            self?.appDelegate.socket.close(fast: true)
            })
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
