<template>
    <div class="container">
        <div class="row role-detail">
            <div class="col s12 m6 offset-m3">
                <div class="card horizontal">
                    <div class="card-image">
                        <img :src="'static/' + role.image">
                    </div>
                    <div class="card-stacked">
                        <div class="card-content valign-wrapper">
                            <h3 class="valign">{{role.name}}</h3>
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

.card-content h3 {
    font-family: 'Poiret One', cursive;
}

.start-btn {
    width: 100%;
}
</style>