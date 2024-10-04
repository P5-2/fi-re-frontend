<template>
    <div v-if="isQuizOpen" class="modal-overlay" @click="$emit('closeQuiz')">
        <div class="modal-content" @click.stop>
            <div class="quizTitle">
                <h2>오늘의 퀴즈</h2>
                <hr/>
            </div>
            <div class="quizContent" id="content">
                <div class="question"><strong>Q. {{ question }}</strong></div>
                <div>
                    <input type="radio" id="q1" v-model="radioValue" value="1">
                    <label for="q1" class="select">1. {{ q1 }}</label>
                </div>
                <div>
                    <input type="radio" id="q2" v-model="radioValue" value="2">
                    <label for="q2" class="select">2. {{ q2 }}</label>
                </div>
                <div>
                    <input type="radio" id="q3" v-model="radioValue" value="3">
                    <label for="q3" class="select">3. {{ q3 }}</label>
                </div>
                <div>
                    <input type="radio" id="q4" v-model="radioValue" value="4">
                    <label for="q4" class="select">4. {{ q4 }}</label>
                </div>
                <div class="btnWrapper">
                    <span v-if="didQuiz" id="didQuiz">정답입니다</span>
                    <button v-else id="submit" class="btn btn-success" @click="submit">제출</button>
                </div>
            </div>
            <div class="quizTitle">
                <span v-if="didQuiz" id="answer">정답 : <span class="answer">{{ answer }}번</span></span>
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
    beforeUpdate(){
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
            didQuiz = JSON.parse(didQuiz);
            let didQuizDate = new Date(didQuiz.date);
            let getDate = new Date(date);
            if(getDate <= didQuizDate){ //퀴즈를 수행함
                this.didQuiz = true;
            } else{ //퀴즈를 수행하지 않음
                this.didQuiz = false;
            }
        }else{
            this.didQuiz = false;
        }
    },
    updated(){
        if(this.didQuiz){
            let result = JSON.parse(localStorage.getItem('didQuiz')).result;
            let $didQuiz = document.getElementById('didQuiz');
            if($didQuiz !== null){
                $didQuiz.textContent = result+"입니다.";
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
        submit : async function(){
            if(confirm("제출하시겠습니까?")){
                this.didQuiz = true;
                let date = this.getDate();
                if(this.answer == this.radioValue){//정답
                    let data = {'date' : date, 'result' : '정답'}
                    localStorage.setItem('didQuiz', JSON.stringify(data));
                }else{
                    let data = {'date' : date, 'result' : '오답'}
                    localStorage.setItem('didQuiz', JSON.stringify(data));
                }
                
                let accessToken = localStorage.getItem('token');
                await axios.post(
                `http://localhost:9000/exp`,
                    {
                        page: 'quiz', // 현재 페이지 이름
                    },
                    {
                        headers: {
                        Authorization: `Bearer ${accessToken}`, 
                        },
                    }
                );
            }
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
        padding: 40px 20px 40px 20px;
        border-radius: 8px;
        position: relative;
        width: 700px;
    }

    .quizTitle {
    text-align: center;
    font-size: 28px;
    }

    .quizContent{
        margin: 20px 0px 20px 0px;
    }
    .btnWrapper {
        margin-top: 15px;
    }
    #submit {
        font-size : 20px;
        border-radius: 10px;
        width: 100px;
    }
    .question{
        width: 550px;
        margin: auto;
        font-size: 26px;
        margin-bottom: 10px;
    }
    .select{
        font-size: 20px;
        text-align: left;
        width: 450px;
        margin: auto;
        border-radius: 10px;
        padding : 5px 15px 5px 15px;
        cursor : pointer;
        display: inline-block;
        margin-bottom: 5px;
    }
    .select label{
        cursor: pointer;
    }
    .select:hover{
        background-color: #DBE2EF;
    }
    .answer{
        font-weight: bold;
    }
    #didQuiz{
        font-size: 24px;
        color: #3F72AF;
    }
    [type="radio"] {
        vertical-align: middle;
        appearance: none;
    }
    [type="radio"]:checked + .select{
        background-color: #3F72AF;
        color: white;
    }
</style>