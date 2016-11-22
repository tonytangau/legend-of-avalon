<template>
    <div class="container">
        <div class="row username-section">
            <div class="row">
                <div class="input-field col s6 offset-s3">
                    <input id="username" v-model="newUsername" v-on:keyup.enter="setUsername" type="text" length="10">
                    <label for="username">Enter your name</label>
                </div>
            </div>
            <div class="row user-button">
                <button class="btn waves-effect waves-light" v-on:click="setUsername">Submit
                        <!--<i class="material-icons right">done</i>-->
        </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
        username: '',
        newUsername: ''
    }
  },
  methods: {
    setUsername: function () {
        this.username = this.newUsername;
        this.$store.state.socket.emit('changeName', this.newUsername);
        this.$router.push('chat');
    }
  }
}
</script>

<style>
.username-section {
    margin-top: 30vh;
}

.user-button {
    text-align: center;
}
</style>