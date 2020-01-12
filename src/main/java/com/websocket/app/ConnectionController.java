package com.websocket.app;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ConnectionController {


    @MessageMapping("/connect")
    @SendTo("/chat/connection")
    public User connect(User user) throws Exception {
        //Thread.sleep(1000); // simulated delay//
        return user;
    }

}