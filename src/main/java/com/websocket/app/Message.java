package com.websocket.app;

import lombok.Data;

import java.util.Date;
@Data
public class Message {
    User user;
    String content;
    Date date;

}
