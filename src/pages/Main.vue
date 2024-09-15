<template>
    <div id="Main">
        <Header></Header>
        <div id="main">
            <h1>메인화면</h1>
        </div>
        <Remocon></Remocon>
        <Calculator></Calculator>
    </div>
</template>

<script>
import Header from '@/components/main/Header.vue'
import Remocon from '@/components/main/Remocon.vue';
import Calculator from '@/components/main/Calculator.vue';

export default {
    name : "Main",
    components : {
        Header, Remocon, Calculator
    }
}
</script>

<style>
    #main{
        text-align: center;
        height: 2000px;
    }
</style>