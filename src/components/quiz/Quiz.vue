<template>
    <div v-if="isQuizOpen" class="modal-overlay" @click="$emit('closeQuiz')">
        <div class="modal-content" @click.stop>
            <div class="quizTitle">
                <h2>오늘의 퀴즈</h2>
                <hr/>
            </div>
            <div class="quizContent">
                <label><strong>{{ question }}</strong></label>
                <div>
                    <input type="radio" id="q1" v-model="radioValue" value="1">
                    <label for="q1">{{ q1 }}</label>
                </div>
                <div>
                    <input type="radio" id="q2" v-model="radioValue" value="2">
                    <label for="q2">{{ q2 }}</label>
                </div>
                <div>
                    <input type="radio" id="q3" v-model="radioValue" value="3">
                    <label for="q3">{{ q3 }}</label>
                </div>
                <div>
                    <input type="radio" id="q4" v-model="radioValue" value="4">
                    <label for="q4">{{ q4 }}</label>
                </div>
            </div>
            <div class="btnWrapper">
                <button id="submit">제출</button>
            </div>
            <div class="quizTitle">
                <span v-if="didQuiz" id="answer">정답 : <span class="answer">{{ answer }}번</span> 입니다</span>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name : 'Quiz',
    props : ['isQuizOpen'],
    data(){
        return{
            question : "",
            q1 : "",
            q2 : "",
            q3 : "",
            q4 : "",
            answer : 0,
            didQuiz : false,
            radioValue : "",
        }
    },
    updated(){
        let date = this.getDate();
        axios.get("http://localhost:9000/quiz/get", {params : {date: date}})
        .then((res)=>{
            const data = res.data;
            this.question = data.question;
            this.q1 = data.q1;
            this.q2 = data.q2;
            this.q3 = data.q3;
            this.q4 = data.q4;
            this.answer = data.answer;
        })
        .catch((err)=>{
            console.log(err);
        })
        let didQuiz = localStorage.getItem('didQuiz');
        if(didQuiz !== null){// 퀴즈 수행을 한 경우
            let didQuizDate = new Date(didQuiz);
            let getDate = new Date(date);
            if(getDate <= didQuizDate){
                this.didQuiz = true;
            } else{
                this.didQuiz = false;
            }
        }
    },
    methods : {
        getDate: function () {
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');

            const date = `${year}-${month}-${day}`;

            return date;
        },
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
        padding: 20px;
        border-radius: 8px;
        position: relative;
        width: 700px;
        /* 가로 길이 조정 */
        min-height: 600px;
        /* 세로 길이 조정 */
    }

    .quizTitle {
    text-align: center;
    }

    .quizContent, .btnWrapper{
        margin: 10px 0px 10px 0px;
    }

    .answer{
        font-weight: bold;
    }
</style>