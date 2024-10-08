<template lang="">
    <div v-if="isOptionsOpen" class="modal-overlay" @click="$emit('closeOptions')">
        <div class="modal-content" @click.stop>
            <div class="quizTitle">
                <h4>옵션을 선택하세요</h4>
                <hr/>
            </div>
            <div class="quizContent" id="content">
                <table>
                    <tbody>
                        <tr v-for="(option, index) in options">
                            <td>
                                <input type="radio" :id="index" v-model="radioValue" :value="index" style="width:16px; height:16px;">
                                <label :for="index" class="select">{{ index+1 }}. <b>{{option.intr_rate}}% ~ {{option.intr_rate2}}% </b>({{ option.save_trm }}개월)</label>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- <div v-for="(option, index) in options">
                    <input type="radio" :id="index" v-model="radioValue" :value="index" style="width:16px; height:16px;">
                    <label :for="index" class="select">{{ index+1 }}. {{ option.save_trm }}개월</label>
                </div> -->
                <div class="btnWrapper">
                    <button id="submit" class="btn btn-success" @click="$emit('submit', radioValue)">선택</button>
                </div>
                </div>
            </div>
    </div>
</template>
<script>
export default {
    name : 'OptionsCheckBox',
    props : ['isOptionsOpen', 'options'],
    data(){
        return{
            radioValue : ''
        }
    },
    methods :{
        submit : function(){
            console.log(this.radioValue);
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
        width: 500px;
    }
    .quizContent{
        margin: 10px 0px 10px 0px;
    }
    .btnWrapper {
        margin-top: 15px;
    }
    .select{
        font-size : 20px;
    }
    table{
        margin:auto;
    }
    td{
        text-align: left
    }
</style>