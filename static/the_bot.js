'use strict';
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
var Messenger = function () {
    function Messenger() {
        _classCallCheck(this, Messenger);
        this.messageList = [];
        this.deletedList = [];
        this.me = 1;
        this.them = 5;
        this.onreceive = function (message) {
            return console.log('received: ' + message.text);
        };
        this.onSend = function (message) {
            return console.log('Sent: ' + message.text);
        };
        this.onDelete = function (message) {
            return console.log('Deleted: ' + message.text);
        };
    }

    Messenger.prototype.send = function send() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        text = this.filter(text);
        if (this.validate(text)) {
            var message = {
                user: this.me,
                text: text,
                time: new Date().getTime()
            };
            this.messageList.push(message);
            this.onSend(message);
        }
    };
    Messenger.prototype.receive = function receive() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        text = this.filter(text);
        if (this.validate(text)) {
            var message = {
                user: this.them,
                text: text,
                time: new Date().getTime()
            };
            this.messageList.push(message);
            this.onreceive(message);
        }
    };
    Messenger.prototype.delete = function _delete(index) {
        index = index || this.messageLength - 1;
        var deleted = this.messageLength.pop();
        this.deletedList.push(deleted);
        this.onDelete(deleted);
    };
    Messenger.prototype.filter = function filter(input) {
        var output = input.replace('bad input', 'good output');
        return output;
    };
    Messenger.prototype.validate = function validate(input) {
        return !!input.length;
    };
    return Messenger;
}();
var BuildHTML = function () {
    function BuildHTML() {
        _classCallCheck(this, BuildHTML);
        this.messageWrapper = 'message-wrapper';
        this.circleWrapper = 'circle-wrapper';
        this.textWrapper = 'text-wrapper';
        this.meClass = 'me';
        this.themClass = 'them';
    }

    BuildHTML.prototype._build = function _build(text, who) {
        if(who == "me") {
            return '<div class="' + this.messageWrapper + ' ' + this[who + 'Class'] + '">\n              <div class="' + this.circleWrapper + ' animated bounceIn" style="background-image: url(\'./static/ic_user.png\') !important;" ></div>\n              <div class="' + this.textWrapper + '">...</div>\n            </div>';
        }else{
            return '<div class="' + this.messageWrapper + ' ' + this[who + 'Class'] + '">\n              <div class="' + this.circleWrapper + ' animated bounceIn" style="background-image: url(\'./static/ic_robot.png\') !important;" ></div> \n              <div class="' + this.textWrapper +  '">...</div>\n            </div>';
        }
    };
    BuildHTML.prototype.me = function me(text) {
        return this._build(text, 'me');
    };
    BuildHTML.prototype.them = function them(text) {
        return this._build(text, 'them');
    };
    return BuildHTML;
}();


$(document).ready(function () {
    
    var namespace = '/';
    var socket = io.connect('http://localhost:3000/');
    socket.on('connect', function () {

        setTimeout(sendHeartbeat, 10000);

     /*   setTimeout(function () {
            socket.emit('communicate', {data: 'conversation_start_x'});
        }, 1500);  */


    });

    socket.on('bot_response', function (msg) {
        console.log('response')
        messenger.receive(msg.data)
        scrollBottom();
    });

    socket.on('pong', function (msg) {
    });

    var messenger = new Messenger();
    var buildHTML = new BuildHTML();
    var $input = $('#input');
    var $send = $('#send');
    var $content = $('#content');
    var $inner = $('#inner');

    function sendHeartbeat() {
        setTimeout(sendHeartbeat, 10000);
        socket.emit('ping');
    }

    function safeText(text) {
        $content.find('.message-wrapper').last().find('.text-wrapper').html(text);
    }

    function animateText() {
        console.log('animate')
        setTimeout(function () {
            console.log('animate timeout')
            $content.find('.message-wrapper').last().find('.text-wrapper').addClass('animated fadeIn');
        }, 350);
    }

    function scrollBottom() {
        $($inner).animate({scrollTop: $($content).offset().top + 9999999}, {
            queue: false,
            duration: 'ease'
        });
    }

    function buildSent(message) {
        console.log('sending: ', message.text);
        $content.append(buildHTML.me(message.text));
        safeText(message.text);
        animateText();
        scrollBottom();
        console.log('buildSent')
    }

    function buildreceived(message) {
        console.log('receiving: ', message.text);
        $content.append(buildHTML.them(message.text));
        safeText(message.text);
        animateText();
        scrollBottom();
    }

    function sendMessage() {
        var text = $input.val();
        messenger.send(text);
        setTimeout(function () {
            socket.emit('communicate', {data: text});
        },500);
        $input.val('');
        $input.focus();
        scrollBottom();
    }

    messenger.onSend = buildSent;
    messenger.onreceive = buildreceived;


    setTimeout(function () {
        messenger.receive('Hi, I\'m playbook bot. You can ask for links,WG\'s,PDL,team contact details,..etc.');
    }, 5000);

    $input.focus();

    $send.on('click', function (e) {
        sendMessage();
    });

    $input.on('keydown', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            e.preventDefault();
            sendMessage();
        }
    });
});