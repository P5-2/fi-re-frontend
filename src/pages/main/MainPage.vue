<template lang="">
    <div id="mainPage">
        <HotItemList></HotItemList>
        <Tip></Tip>
    </div>
</template>
<script>
import HotItemList from '@/components/hotItem/HotItemList.vue';
import Tip from '@/components/tip/Tip.vue';

export default {
    name : 'MainPage',
    components : {HotItemList, Tip}
}
</script>
<style lang="">
    
</style>