package com.websocket.app;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {


  @MessageMapping("/message")
  @SendTo("/chat/message")
  public Message greeting(Message message) throws Exception {
    //Thread.sleep(1000); // simulated delay
    return message;
  }


}