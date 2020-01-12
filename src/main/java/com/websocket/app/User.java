package com.websocket.app;

import lombok.Data;

@Data
public class User {
   private String username;
   private EventType eventType;
}
