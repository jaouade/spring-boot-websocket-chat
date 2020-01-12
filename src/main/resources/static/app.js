var stompClient = null;

function setConnected(connected) {
    if (connected) {
        connectAndAddUserToChat();
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
        stompClient.debug = null;
        stompClient.connect({}, function (frame) {
            setConnected(true);
            stompClient.subscribe('/chat/connection', function (message) {
                showUserStatus(JSON.parse(message.body));
            });
            stompClient.subscribe('/chat/message', function (message) {
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

function connectAndAddUserToChat() {
    if ($('#messages').length === 0) {
        let messages = '<div id="messages" class="msg_history"></div>';
        $('#messagesHolder').append(messages);
    }
    $('#messageForm').show();
    let $user = $("#user");
    localStorage.setItem("user", $user.val().trim());
    $user.hide();
    stompClient.send("/app/connect", {}, JSON.stringify(
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
    stompClient.send("/chat/message", {}, JSON.stringify(
        {
            'user': {
                'username': localStorage.getItem("user")
            },
            'content': $message.val(),
            'date': new Date()
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
            '                    </div>'
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
    /*$("#send").click(function () {
        send();
    });*/
    $('#messageForm').hide();
    //connect();
    $(document).on('keypress', function (e) {
        if (e.which === 13 && $('#message').val().trim() !== '') {
            send()
        }
    });
});