<template>
    <div v-if="isCalcResultOpen" class="modal-overlay" @click="$emit('closeCalcResult')">
        <div class="modal-content" @click.stop>
            <h2>계산 결과</h2>
        </div>
    </div>
</template>
<script>
export default {
    name : 'CalculatorResult',
    props : ['isCalcResultOpen'],
    data(){
        return{

        }
    },
}
</script>
<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 40px 20px 40px 20px;
        border-radius: 8px;
        position: relative;
        width: 800px;
    }
</style>