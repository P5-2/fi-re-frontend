<template>
  <div id="Main">
    <Header></Header>
    <RouterView />
    <Remocon></Remocon>
    <Calculator></Calculator>
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';
import Remocon from '@/components/main/Remocon.vue';
import Calculator from '@/components/main/Calculator.vue';

export default {
  name: 'Main',
  components: {
    Header,
    Remocon,
    Calculator,
  },
};
</script>

<style>
#Main {
  text-align: center;
}
</style>
