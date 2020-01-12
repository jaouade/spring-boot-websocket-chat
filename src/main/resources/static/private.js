var stompClient = null;

function setConnected(connected) {
    if (connected) {
        connectAndAddContactsToChat();
        $('#disconnect').show();
        $('#connect').hide();
    } else {
        disconnectAndRemoveUserFromChat();
        $('#disconnect').hide();
        $('#connect').show();
    }


}

function connect() {
    if ($('#user').val().trim() === '') {
        alert("username must be valid.")
    } else {
        let socket = new SockJS('/gs-guide-websocket');
        stompClient = Stomp.over(socket);
        //stompClient.debug = null;
        stompClient.connect({}, function (frame) {
            setConnected(true);
            stompClient.subscribe('private/chat/connection.' + $('#user').val(), function (message) {
                showUserStatus(JSON.parse(message.body));
            });
            stompClient.subscribe('private/chat/message.' + $('#user').val(), function (message) {
                showMessage(JSON.parse(message.body));
            });

        });
    }


}

function disconnect() {
    setConnected(false);
    if (stompClient !== null) {
        stompClient.disconnect();
    }

}

function selectedUser(username) {
    $('li').removeClass('active');
    $('#chat-with').remove();
    $('#chatter').append('<div id="chat-with" class="user_info">' +
        '                                        <span>' + username.toUpperCase() + '</span>' +
        '                                        <p>1767 Messages</p>' +
        '                                    </div>');
    $('#' + username).addClass('active');
    localStorage.setItem("selected", username);

}

function connectAndAddContactsToChat() {

    $.get("/user/" + localStorage.getItem('user'), function (user) {
        user.friends.forEach((user) => {

            let contact = '<li onclick="selectedUser(this.id)" id="' + user.username + '">' +
                '                                <div class="d-flex bd-highlight">' +
                '                                    <div class="img_cont">' +
                '                                        <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img">' +
                '                                        <span class="online_icon"></span>' +
                '                                    </div>' +
                '                                    <div class="user_info">' +
                '                                        <span>' + user.username + '</span>' +
                '                                        <p>Online</p>' +
                '                                    </div>' +
                '                                </div>' +
                '                            </li>';
            $('#contacts').append(contact);
        });
    });
    $('#messageForm').show();
    let $user = $("#user");
    localStorage.setItem("user", $user.val().trim());
    $user.hide();
    stompClient.send("/app/private/connection." + $('#user').val(), {}, JSON.stringify(
        {
            username: localStorage.getItem("user"),
            eventType: "JOIN"
        }
    ));


}

function disconnectAndRemoveUserFromChat() {
    $("#messageForm").hide();
    $('#messages').remove();
    let $user = $("#user");
    $user.val('');
    $user.show();
    stompClient.send("/app/connect", {}, JSON.stringify(
        {
            username: localStorage.getItem("user"),
            eventType: "LEAVE"

        }
    ));
    localStorage.removeItem("user");
}

function send() {
    let $message = $('#message');
    stompClient.send("/app/private/message", JSON.stringify(
        {
            chanelId: localStorage.getItem("user") /*localStorage.getItem("selected")*/,
            message: {
                'user': {
                    'username': localStorage.getItem("user")
                },
                'content': $message.val(),
                'date': new Date()
            }
        }
    ));
    $message.val('');
}

function showUserStatus(user) {

    if (user.username !== localStorage.getItem("user")) {
        let message;
        if (user.eventType === "LEAVE") {
            message = '<div style="text-align: center;height: fit-content;display: block;' +
                '  margin-left: auto;' +
                '  margin-right: auto;;padding:0 0;width: fit-content" class="alert alert-warning" role="alert">' + user.username + ' left the conversation</div>';
        } else {
            message = '<div  style="text-align: center;height: fit-content;display: block;' +
                '  margin-left: auto;' +
                '  margin-right: auto;;padding:0 0;width: fit-content" class="alert alert-success" role="alert" >' + user.username + ' joined the conversation</div>';
        }
        $("#messages").append(message);
    }

}

function showMessage(message) {
    let $messages = $('#messages');
    if (localStorage.getItem("user") === message.user.username) {
        let messageBody = '<div class="outgoing_msg">' +
            '              <div class="sent_msg">' +
            '                <p style="overflow-wrap: break-word;">' + message.content + '</p>' +
            '                <span class="time_date">' + moment(new Date(message.date)).fromNow() + '</span> </div>' +
            '            </div>';
        $messages.append(messageBody);
    } else {
        let messageBody = '<div class="incoming_msg">' +
            '                        <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>' +
            '                        <div class="received_msg">' +
            '                            <div class="received_withd_msg">' +
            '                                <p style="overflow-wrap: break-word;">' + message.content + '</p>' +
            '                                <span class="time_date">' + moment(new Date(message.date)).fromNow() + '</span></div>' +
            '                        </div>' +
            '                    </div>';
        $messages.append(messageBody);
    }
    $messages.animate({
        scrollTop: $messages[0].scrollHeight - $messages[0].clientHeight
    });
    //$messages.css({'overflow':'hidden'});
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    $('#disconnect').hide();
    $("#send").click(function () {
        send();
    });
    $('#messageForm').hide();
    //connect();
    $(document).on('keypress', function (e) {
        if (e.which === 13 && $('#message').val().trim() !== '') {
            send()
        }
    });
});