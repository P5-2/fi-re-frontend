<template lang="">
    <div id="Remocon">
        <ul>
            <li>
                <a href="/">
                    <img src="@/assets/remocon/home.png" width="48" height="48">
                </a>
            </li>
            <li>
                <a href="/member/info">
                    <img src="@/assets/remocon/info.png" width="48" height="48"> <br>
                    내 정보
                </a>
            </li>
            <li>
                <a href="/">
                    <img src="@/assets/remocon/shopping.png" width="48" height="48"> <br>
                    비교하기
                </a>
            </li>
            <li>
                <a href="/">
                    <img src="@/assets/remocon/survey.png" width="48" height="48"> <br>
                    설문조사
                </a>
            </li>
            <li>
                <a href="/">
                    <img src="@/assets/remocon/recommend.png" width="48" height="48"> <br>
                    추천상품
                </a>
            </li>
            <li>
                <a @click="openQuiz">
                    <img src="@/assets/remocon/quiz.png" width="48" height="48"> <br>
                    오늘의<br>퀴즈
                </a>
            </li>
        </ul>
    </div>
    <!-- 퀴즈 모달 창 -->
    <div v-if="isQuizOpen" class="modal-overlay" @click="closeQuiz">
        <div class="modal-content">
            <div class="quizTitle">
                {{fnceDictNm}}
            </div>
            <div class="quizContent">
                {{ksdFnceDictDescContent}}
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name : "Remocon",
    data(){
        return {
            isQuizOpen : false,
            fnceDictNm : "금융용어",
            ksdFnceDictDescContent : "용어설명"
        }
    },
    methods : {
        openQuiz : async function(){
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');

            const date = `${year}-${month}-${day}`;
            console.log(date);
            let res = await axios.get("http://localhost:9000/financeWord/get", {params : {date : date}});

            let data = res.data;

            this.fnceDictNm = data.fnceDictNm;
            this.ksdFnceDictDescContent = data.ksdFnceDictDescContent;

            this.isQuizOpen = true;
        },
        closeQuiz : function(){
            this.isQuizOpen = false;
        }
    }
}
</script>
<style scoped>
    #Remocon{
        position : fixed;
        top : 50%;
        right : 45px;
        transform: translate(0, -50%);
    }
    ul, li{
        list-style: none;
        padding: 0px;
    }
    ul{
        background-color: #dedede;
        border-radius: 5px;
        width: 86px;
    }
    li{
        margin: auto;
        width: 80%;
        font-size: 14px;
        text-align: center;
        padding:5px;
    }
    li:not(:last-child){
        border-bottom: 1px #909090 solid;
    }
    a{
        text-decoration: none;
        color : black
    }
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
    .modal-content{
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        position: relative;
        width: 500px;
        /* 가로 길이 조정 */
        min-height: 400px;
        /* 세로 길이 조정 */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>