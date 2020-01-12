package com.websocket.app;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {
    @GetMapping("/private")
    public String privateChat(){
        return "private";
    }
}
