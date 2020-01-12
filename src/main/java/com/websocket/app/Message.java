package com.websocket.app;

import lombok.Data;

import java.util.Date;
@Data
public class Message {
    private User user;
    private String content;
    private Date date;
    private String chanel;


}
