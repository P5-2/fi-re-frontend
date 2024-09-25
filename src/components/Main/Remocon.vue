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
        <div class="modal-content" @click.stop>
            <div id="quizTitle">
                <h2>오늘의 퀴즈</h2>
                <hr>
            </div>
            <div class="quizContent">
                {{ksdFnceDictDescContent}}
            </div>
            <div id="quizInput" class="form-group">
                <input type="text" class="form-control" placeholder="위에서 설명하는 단어를 입력해주세요" v-model="answer">
                <div id="btnWrapper">
                    <button id="submit" class="btn btn-primary" @click="submitAnswer">제출</button>
                    <button class="btn btn-secondary" @click="getAnswer">정답보기</button>
                </div>
            </div>
            <div class="quizTitle">
                정답 : <label id="answer">{{fnceDictNm}}</label>
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
            ksdFnceDictDescContent : "용어설명",
            answer : ""
        }
    },
    methods : {
        openQuiz : async function(){
            const date = this.getDate();
            console.log(date);
            let res = await axios.get("http://localhost:9000/financeWord/get", {params : {date : date}});

            let data = res.data;
            this.fnceDictNm = data.fnceDictNm;
            this.ksdFnceDictDescContent = data.ksdFnceDictDescContent;

            this.isQuizOpen = true;
        },
        closeQuiz : function(){
            this.isQuizOpen = false;
        },
        getDate : function(){
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');

            const date = `${year}-${month}-${day}`;

            return date;
        },
        getAnswer : function(){
            if(confirm("정답을 보시겠습니까?")){
                this.answerProcess();
            }
        },
        answerProcess : function(){
            let $answer = document.getElementById("answer");
            $answer.style.display = "inline";

            let $quizInput = document.getElementById("quizInput");
            $quizInput.style.pointerEvents = "none";
        },
        submitAnswer : function(){
            let myData = this.fnceDictNm + "(더미)";
            console.log(myData);
            if(myData.includes("(")){ //괄호가 있으면 괄호 뺴고 추출하기
                myData = myData.substring(0, myData.indexOf("("));
                console.log(myData);
            }
            if(myData === this.answer){
                alert("정답입니다");
                this.answerProcess();
            }else{
                alert("오답입니다")
            }
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
        width: 700px;
        /* 가로 길이 조정 */
        min-height: 600px;
        /* 세로 길이 조정 */
    }
    #quizTitle{
        text-align: center;
    }
    .quizContent, #quizInput, #btnWrapper{
        margin : 10px 0px 10px 0px;
    }
    #submit{
        margin-right: 30px;
    }
    #answer{
        font-weight: bold;
        display: none;
    }
</style>