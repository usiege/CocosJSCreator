//
//  ViewController.swift
//  CocosJS
//
//  Created by user on 2018/6/6.
//  Copyright © 2018年 usiege. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    
    @IBAction func testAction(_ sender: Any) {
        let cocosbridge = CocosBridge.shared()
        let cocosvc = cocosbridge?.viewController
        navigationController?.pushViewController(cocosvc!, animated: true)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

