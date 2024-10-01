<template>
  <div id="Main">
    <Header></Header>
    <RouterView />
    <Remocon></Remocon>
    <Calculator></Calculator>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';
import Remocon from '@/components/main/Remocon.vue';
import Calculator from '@/components/main/Calculator.vue';
import Footer from '@/components/main/Footer.vue';

export default {
  name: 'Main',
  components: {
    Header,
    Remocon,
    Calculator,
    Footer
  },
};
</script>

<style>
#Main {
  text-align: center;
}
</style>
