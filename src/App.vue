<template>
  <div id="app">
    <router-link :to="{ name: 'welcome'}"><h4 class="logo">Legend of Avalon</h4></router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Poiret+One|Raleway');

html {
  font-family: 'Raleway', sans-serif;
}

.logo {
  font-family: 'Poiret One', cursive;
  text-align: center;
  margin-top: 30px;
  color: black;
  text-shadow: 4px 4px 4px #aaa;
}

[v-cloak] {
  display: none;
}
</style>
