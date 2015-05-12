//
//  ScanCameraViewController.swift
//  Pac-Bang
//
//  Created by Peng Jin on 5/13/15.
//  Copyright (c) 2015 Elvin Jin. All rights reserved.
//

import UIKit
import AVFoundation

class ScanCameraViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    
    var mainScanVC: ScanViewController?
    
    @IBOutlet var messageLabel: UILabel!
    var captureSession: AVCaptureSession?
    var videoPreviewLayer: AVCaptureVideoPreviewLayer?
    var qrCodeFrameView: UIView?
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let captureDevice = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo)
        var error: NSError?
        let input: AnyObject! = AVCaptureDeviceInput.deviceInputWithDevice(captureDevice, error: &error)
        
        if error != nil {
            println("\(error?.localizedDescription)")
            return
        }
        
        captureSession = AVCaptureSession()
        captureSession?.addInput(input as! AVCaptureInput)
        
        let captureMetadataOutput = AVCaptureMetadataOutput()
        captureSession?.addOutput(captureMetadataOutput)
        
        captureMetadataOutput.setMetadataObjectsDelegate(self, queue: dispatch_get_main_queue())
        captureMetadataOutput.metadataObjectTypes = [AVMetadataObjectTypeQRCode]
        
        videoPreviewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        videoPreviewLayer?.videoGravity = AVLayerVideoGravityResizeAspectFill
        videoPreviewLayer?.frame = view.layer.bounds
        videoPreviewLayer?.connection.videoOrientation = AVCaptureVideoOrientation.LandscapeLeft
        view.layer.addSublayer(videoPreviewLayer)
        
        captureSession?.startRunning()
        view.bringSubviewToFront(messageLabel)
        
        qrCodeFrameView = UIView()
        qrCodeFrameView?.layer.borderColor = UIColor.greenColor().CGColor
        qrCodeFrameView?.layer.borderWidth = 2
        view.addSubview(qrCodeFrameView!)
        view.bringSubviewToFront(qrCodeFrameView!)
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func captureOutput(captureOutput: AVCaptureOutput!, didOutputMetadataObjects metadataObjects: [AnyObject]!, fromConnection connection: AVCaptureConnection!) {
        if metadataObjects == nil || metadataObjects.count == 0 {
            qrCodeFrameView?.frame = CGRectZero
            messageLabel.text = "No QR code is detected"
            messageLabel.backgroundColor = UIColor.grayColor()

            return
        }
        
        let metadataObj = metadataObjects[0] as! AVMetadataMachineReadableCodeObject
        
        if metadataObj.type == AVMetadataObjectTypeQRCode {
            let barCodeObj = videoPreviewLayer?.transformedMetadataObjectForMetadataObject(metadataObj as AVMetadataMachineReadableCodeObject) as! AVMetadataMachineReadableCodeObject
            qrCodeFrameView?.frame = barCodeObj.bounds
            
            if metadataObj.stringValue != nil {
                messageLabel.text = metadataObj.stringValue
            }
            
            var strArray = metadataObj.stringValue.componentsSeparatedByString("+")
            if strArray.count == 2  {
                captureSession?.stopRunning()
                mainScanVC?.didReadQRCode(strArray[0], sessionId: strArray[1])
                self.dismissViewControllerAnimated(true, completion: nil)
            } else {
                messageLabel.text = "Invalid QR Code"
                messageLabel.backgroundColor = UIColor.redColor()
            }
        }
    }

}
