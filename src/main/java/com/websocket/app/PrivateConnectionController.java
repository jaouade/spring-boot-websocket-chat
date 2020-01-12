package com.websocket.app;

import org.springframework.data.repository.query.Param;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class PrivateConnectionController {


    List<User> userFriends = new ArrayList<>();

    @GetMapping("/user/{username}")
    public User privateChat(@PathVariable String username) {
        populateUsers();
        return userFriends.stream().filter(user1 -> user1.getUsername().equals(username)).findFirst().get();
    }

    @MessageMapping("/private/connection")
    @SendTo("/private/chat/connection.{chanelId}")
    public User connect(@Payload User user, @DestinationVariable String chanelId) {
        System.out.println(chanelId);
        populateUsers();
        return userFriends.stream().filter(user1 -> user1.getUsername().equals(user.getUsername())).findFirst().get();
    }

    private void populateUsers() {
        userFriends.addAll(
                List.of(User.builder().username("j1").friends(List.of(User.builder().username("j2").build(), User.builder().username("j3").build())).build(),
                        User.builder().username("j2").friends(List.of(User.builder().username("j3").build(), User.builder().username("j5").build())).build(),
                        User.builder().username("jx").friends(List.of(User.builder().username("jy").build(), User.builder().username("j1").build())).build()
                ));
    }

}