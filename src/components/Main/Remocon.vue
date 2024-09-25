<template lang="">
  <div id="Remocon">
    <ul>
      <li>
        <a href="/">
          <img src="@/assets/remocon/home.png" width="48" height="48" />
        </a>
      </li>
      <li>
        <a href="/member/info">
          <img src="@/assets/remocon/info.png" width="48" height="48" /> <br />
          내 정보
        </a>
      </li>
      <li>
        <a href="/">
          <img src="@/assets/remocon/shopping.png" width="48" height="48" />
          <br />
          비교하기
        </a>
      </li>
      <li>
        <a href="/survey/start">
          <img src="@/assets/remocon/survey.png" width="48" height="48" />
          <br />
          설문조사
        </a>
      </li>
      <li>
        <a href="/">
          <img src="@/assets/remocon/recommend.png" width="48" height="48" />
          <br />
          추천상품
        </a>
      </li>
      <li>
        <a @click="openQuiz">
          <img src="@/assets/remocon/quiz.png" width="48" height="48" /> <br />
          오늘의<br />퀴즈
        </a>
      </li>
    </ul>
  </div>
  <!-- 퀴즈 모달 창 -->
  <div v-if="isQuizOpen" class="modal-overlay" @click="closeQuiz">
    <div class="modal-content" @click.stop>
      <div id="quizTitle">
        <h2>오늘의 퀴즈</h2>
        <hr />
      </div>
      <div class="quizContent">
        {{ ksdFnceDictDescContent }}
      </div>
      <div id="quizInput" class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="위에서 설명하는 단어를 입력해주세요"
          v-model="answer"
        />
        <div id="btnWrapper">
          <button id="submit" class="btn btn-primary" @click="submitAnswer">
            제출
          </button>
          <button class="btn btn-secondary" @click="getAnswer">정답보기</button>
        </div>
      </div>
      <div class="quizTitle">
        정답 : <label id="answer">{{ fnceDictNm }}</label>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'Remocon',
};
</script>
<style scoped>
#Remocon {
  position: fixed;
  top: 50%;
  right: 45px;
  transform: translate(0, -50%);
}
ul,
li {
  list-style: none;
  padding: 0px;
}
ul {
  background-color: #dedede;
  border-radius: 5px;
  width: 86px;
}
li {
  margin: auto;
  width: 80%;
  font-size: 14px;
  text-align: center;
  padding: 5px;
}
li:not(:last-child) {
  border-bottom: 1px #909090 solid;
}
a {
  text-decoration: none;
  color: black;
}
</style>
