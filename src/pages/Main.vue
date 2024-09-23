<template>
  <div id="Main">
    <Header></Header>
    <div id="main">
      <h1>메인화면</h1>
    </div>
    <router-view />
    <Remocon></Remocon>
  </div>
</template>

<script>
import Header from "@/components/Main/Header.vue";
import Remocon from "@/components/Main/Remocon.vue";

export default {
  name: "Main",
  components: {
    Header,
    Remocon,
  },
};
</script>

<style>
#main {
  height: 2000px;
}
</style>
