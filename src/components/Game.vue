<template>
    <div class="container">
        <div class="row role-detail">
            <div class="col s12 m6 offset-m3">
                <div class="card horizontal">
                    <div class="card-image">
                        <img :src="'static/' + role.image">
                    </div>
                    <div class="card-stacked">
                        <div class="card-content">
                            <h1>{{role.name}}</h1>
                            <div v-if=!role.name class="progress">
                                <div class="indeterminate"></div>
                            </div>
                        </div>
                        <div class="card-action">
                            <a v-bind:class="['waves-effect waves-light btn-large start-btn', role.isEvil ? 'red' : '']">
                                <h5>Start</h5>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'game',
  data () {
    return {
        role: {}
    }
  },
  created: function () {
      this.socketEvents();
  },
  methods: {
    socketEvents: function () {
        var vm = this;

        this.$store.state.socket.on('assign', function (character) {
            vm.role = character;
        });

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

<style>
    .role-detail {
        margin-top: 20vh;
    }

    .card-content {
        text-align: center;
    }

    .start-btn {
        width: 100%;
    }
</style>