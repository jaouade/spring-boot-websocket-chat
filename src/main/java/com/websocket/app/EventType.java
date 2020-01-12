package com.websocket.app;

import java.io.Serializable;

public enum EventType implements Serializable {
    JOIN,LEAVE;
    public String getType(){
        return this.name();
    }
}
