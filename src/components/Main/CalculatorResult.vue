<template>
    <div v-if="isCalcResultOpen" class="modal-overlay" @click="$emit('closeCalcResult')">
        <div class="modal-content" @click.stop>
            <h2>계산 결과 : 총 <b>{{ formatCurrency(result.finalAmount) }}</b>원</h2>
            <tr></tr>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">금융상품</th>
                        <th scope="col">이율</th>
                        <th scope="col">투자 기간</th>
                        <th scope="col">투자 금액</th>
                        <th scope="col">최종 금액</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr v-for="processing in result.process">
                        <td>{{ processing.name }}</td>
                        <td>{{ processing.rate }}</td>
                        <td>{{ processing.period }}</td>
                        <td>{{ formatCurrency(processing.amount) }}</td>
                        <td>{{ formatCurrency(processing.finalAmount) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { calculatorStore } from '@/stores/calculator.js';
import { mapState } from 'pinia';

export default {
    name : 'CalculatorResult',
    props : ['isCalcResultOpen'],
    data(){
        return{

        }
    },
    computed: {
        ...mapState(calculatorStore, ['result'])
    },
    methods:{
        result_btn : function(){
            console.log(this.result);
        },
        formatCurrency :function(amount) {
            if (amount != undefined)
                return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
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
        width: 1000px;
    }
</style>