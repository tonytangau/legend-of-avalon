<template>
    <div>
        Game is on
    </div>
</template>

<script>
export default {
  name: 'game',
  data () {
    return {
    }
  },
  created: function () {
      this.socketEvents();
  },
  methods: {
    socketEvents: function () {
        var vm = this;

        // this.$store.state.socket.on('chat', function (msg) {
        //     vm.groupMessages.push({
        //         text: msg.text,
        //         user: msg.user
        //     });

        //     scrollToBottom();
        // });

        // this.$store.state.socket.on('status', function (msg) {
        //     vm.groupMessages.push({
        //         text: msg,
        //         classNames: "blue lighten-5"
        //     });

        //     scrollToBottom();
        // });
    }
  }
}
</script>