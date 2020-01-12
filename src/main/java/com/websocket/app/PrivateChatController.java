package com.websocket.app;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PrivateChatController {



  @MessageMapping("/private/message")
  @SendToUser("/private/chat/message.{chanelId}")
  public Message message(@Payload Message message, @DestinationVariable String chanelId) {
    System.out.println(chanelId);
    System.out.println(message);
    return message;
  }


}