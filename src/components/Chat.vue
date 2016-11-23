<template>
    <div class="container">
        <div class="row">
            <div class="col s12">
                <div class="switch ready-switch">
                    <label>
                    Wait..
                    <input type="checkbox" v-model="ready" v-on:change="setReady" :disabled="ready">
                    <span class="lever"></span>
                    I'm Ready!
                    </label>
                </div>
            </div>
        </div>
        <div class="row">
            <ul id="messages" class="collection col s12">
                <li v-bind:class="['collection-item', message.classNames]" v-for="message in groupMessages" v-cloak>
                    <span class="orange-text text-darken-4" v-if=message.user>{{ message.user }}:</span>
                    <span class="text-item">{{ message.text }}</span>
                </li>
            </ul>
        </div>

        <div class="row">
            <div class="input-field col s10">
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

        this.$store.state.socket.on('starting', function (msg) {
            vm.groupMessages.push({
                text: msg,
                classNames: "blue lighten-5"
            });

            vm.$router.push('game');
        });
    }
  }
}
</script>

<style>
#messages {
    height: 40vh;
    overflow-y: auto;
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
    text-align: center;
}
</style>