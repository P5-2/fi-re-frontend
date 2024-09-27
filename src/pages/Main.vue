<template>
  <div id="Main">
    <Header></Header>
    <RouterView />
    <Remocon></Remocon>
    <Calculator></Calculator>
  </div>
</template>

<script>
import Header from '@/components/Main/Header.vue';
import Remocon from '@/components/Main/Remocon.vue';
import Calculator from '@/components/Main/Calculator.vue';

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
