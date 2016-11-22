<template>
    <div class="container">
        <div class="row messages-section">
            <div class="row">
                <h4 class="col s6 orange-text text-darken-3">Legend of Avalon {{ready ? "[READY]" : ""}}</h4>
                <div class="col s6">
                    <div class="switch right ready-switch">
                        <label>
                        Wait..
                        <input type="checkbox" v-model="ready" v-on:change="setReady" :disabled="ready">
                        <span class="lever"></span>
                        Ready
                        </label>
                    </div>
                </div>
            </div>

            <ul id="messages" class="collection">
                <li v-bind:class="['collection-item', message.classNames]" v-for="message in groupMessages" v-cloak>
                    <span class="orange-text text-darken-4" v-if=message.user>{{ message.user }}:</span>
                    <span class="text-item">{{ message.text }}</span>
                </li>
            </ul>
        </div>

        <div class="row">
            <div class="input-field col s11">
                <input id="msg" v-model="newMessage" v-on:keyup.enter="sendMessage" type="text" autocomplete="off" />
                <label for="msg">Message</label>
            </div>
            <button class="btn-floating waves-effect waves-light red message-add right" v-on:click="sendMessage">
                <!--<i class="material-icons">add</i>-->
                +
            </button>
        </div>
    </div>
</template>

<script>

var scrollToBottom = function () {
    $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")});    
}

export default {
  name: 'chat',
  data () {
    return {
        newMessage: '',
        groupMessages: [],
        ready: false
    }
  },
  created: function () {
      this.socketEvents();
  },
  methods: {
    sendMessage: function (event) {
        this.$store.state.socket.emit('chat', {
            text: this.newMessage
        });
        this.newMessage = '';
    },
    setReady: function () {
        if(this.ready) {
            this.$store.state.socket.emit('isReady');
        }
    },
    socketEvents: function () {
        var vm = this;

        this.$store.state.socket.on('chat', function (msg) {
            vm.groupMessages.push({
                text: msg.text,
                user: msg.user
            });

            scrollToBottom();
        });

        this.$store.state.socket.on('status', function (msg) {
            vm.groupMessages.push({
                text: msg,
                classNames: "blue lighten-5"
            });

            scrollToBottom();
        });
    }
  }
}
</script>

<style>
#messages {
    max-height: 70vh;
    overflow-y: auto;
}

.messages-section {
    height: 80vh;
    margin-top: 30px;
}

.message-add {
    margin-top: 15px;
    margin-right: 10px;
}

.text-item {
    word-wrap: break-word;
}

.ready-switch {
    margin-top: 30px;
    margin-right: 10px;
}
</style>