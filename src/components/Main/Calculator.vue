<template>
  <div id="floating-desc" class="floating-desc">
    ! 계산기 탭을 여는 버튼입니다.
  </div>
  <div id="floating-arrow" class="floating-arrow"></div>
  <button type="button" class="floating-btn" @click="openTab" @mouseover="btnOver" @mouseout="btnOut">
    <img src="@/assets/calculator/calc.png" width="30" height="30"/>
  </button>
  <div id="sideTab" class="side-tab">
    <a href="javascript:void(0)" class="close-btn" @click="closeTab">&times;</a>
    <div class="cal-wrapper">
      <h3>계산기</h3>
      <h6>미래 자산을 계산해보세요</h6>
    </div>
    <div class="cal-wrapper">
      <div class="mb-3">
        <label class="fs-5">투자 개월 수 :</label>
        <input
          type="text"
          class="month-input"
          v-model="temp_month"
          @input="setMonthHandler()"
        />
      </div>
      <button class="btn btn-light" @click="cal_click">계산하기</button>
      <br />
      <div class="mt-3 fs-4">
        <div>결과 :<br> <b id="result">0원</b></div>
      </div>
    </div>

    <div class="cal-wrapper">
      <label>월 저금액(원)</label> <br>
      <input
        type="text"
        class="save-input"
        v-model="temp_monthlySave"
        @input="setMonthlySaveHandler()"
      />
    </div>

    <div class="cal-wrapper">
      <!-- 금 투자 -->
      <h3>금</h3>
      <label>금 투자금액(원)</label> <br>
      <input
        type="text"
        class="save-input"
        v-model="temp_gold"
        @input="setGoldHandler()"
      />
    </div>
    <div class="finance-wrapper">
      <div class="cal-wrapper">
        <!-- 예적금 상품 -->
        <h3>예적금</h3>
        <ol v-for="(savings, index) in savingslist" :key="savings.prdNo">
          <li class="savingWrapper">
            <button
              type="button"
              class="x-btn btn-close"
              aria-label="Close"
              @click="removeSavings(savings.prdNo, index)"
            ></button>
            <b class="b-pname">{{ savings.pname }}</b> <br />
            <hr />
            이율 : <b>{{ savings.minRate }}</b
            ><br />
            금액 : <b>{{ savings.subAmount }}</b> <br />
            기간 : <b>{{ savings.subPeriod }}개월</b> <br />
            투자금액 :
            <input
              type="text"
              v-model="temp_savingsAmounts[index]"
              @input="
                setSavingsAmountHandler(
                  savings.prdNo,
                  temp_savingsAmounts[index]
                )
              "
            />
          </li>
        </ol>
      </div>
      <div class="cal-wrapper">
        <!-- 펀드 상품 -->
        <h3>펀드</h3>
        <ol v-for="(fund, index) in fundlist" :key="fund.prdNo">
          <li class="savingWrapper">
            <button
              type="button"
              class="x-btn btn-close"
              aria-label="Close"
              @click="removeFund(fund.prdNo, index)"
            ></button>
            <b class="b-pname">{{ fund.pname }}</b> <br />
            <hr />
            누적이율 : <b>{{ fund.rate }}</b> <br />
            투자금액 :
            <input
              type="text"
              v-model="temp_fundAmounts[index]"
              @input="setFundAmountHandler(fund.prdNo, temp_fundAmounts[index])"
            />
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
<script>
import { calculatorStore } from '@/stores/calculator.js';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'Calculator',
  data() {
    return {
      clicked: false,
      options: {
        duration: 500,
      },
      temp_month: 0,
      temp_gold: 0,
      temp_monthlySave: 0,
      temp_savingsAmounts: [],
      temp_fundAmounts: [],
    };
  },
  computed: {
    ...mapState(calculatorStore, [
      'monthly_save',
      'savingslist',
      'fundlist',
      'gold',
      'goldRate',
      'month',
    ]),
  },
  created() {
    this.temp_month = this.month;
    this.temp_gold = this.gold;
    this.temp_monthlySave = this.monthly_save;
    this.temp_savingsAmounts = this.savingslist.map((savings) => {
      return savings.amount;
    });
    this.temp_fundAmounts = this.fundlist.map((fund) => {
      return fund.amount;
    });
  },
  methods: {
    btnClick: function () {
      let wrapper = document.getElementById('calculator-wrapper');
      let btn = document.getElementById('calculator-btn');
      let keyframes;
      if (this.clicked) {
        //계산기가 올라와 있으므로 내려야함
        this.clicked = false;
        keyframes = {
          transform: ['translate(-50%, 180px)'],
        };
        wrapper.animate(keyframes, this.options);
        setTimeout(function () {
          wrapper.style.transform = 'translate(-50%, 180px)';
        }, 450);
        btn.textContent = '계산기 ↑';
      } else {
        //계산기가 내려와 있으므로 올려야함
        this.clicked = true;
        keyframes = {
          transform: ['translate(-50%, 0)'],
        };
        wrapper.animate(keyframes, this.options);
        setTimeout(function () {
          wrapper.style.transform = 'translate(-50%, 0)';
        }, 450);
        btn.textContent = '계산기 ↓';
      }
    },
    ...mapActions(calculatorStore, [
      'calculate',
      'setMonth',
      'setGold',
      'setMonthlySave',
      'setFundAmount',
      'setSavingsAmount',
      'removeSavings',
      'removeFund',
    ]),
    cal_click: function () {
      let result = this.calculate();
      console.log(result);
      result += '원';
      document.getElementById('result').textContent = result;
    },
    setMonthHandler: function () {
      this.setMonth(this.temp_month);
    },
    setGoldHandler: function () {
      this.setGold(this.temp_gold);
    },
    setMonthlySaveHandler: function () {
      this.setMonthlySave(this.temp_monthlySave);
    },
    setFundAmountHandler: function (prdNo, amount) {
      this.setFundAmount(prdNo, amount);
    },
    setSavingsAmountHandler: function (prdNo, amount) {
      this.setSavingsAmount(prdNo, amount);
    },
    openTab : function(){
      document.getElementById("sideTab").style.width = "350px";  /* 탭의 너비를 설정 */
    },
    closeTab : function(){
      document.getElementById("sideTab").style.width = "0";  /* 탭을 닫을 때 너비를 0으로 설정 */
    },
    btnOver : function(){
      let $floatingDesc = document.getElementById("floating-desc");
      let $floatingArrow = document.getElementById("floating-arrow");

      $floatingDesc.style.display = "block";
      $floatingArrow.style.display = "block";
    },
    btnOut : function(){
      let $floatingDesc = document.getElementById("floating-desc");
      let $floatingArrow = document.getElementById("floating-arrow");

      $floatingDesc.style.display = "none";
      $floatingArrow.style.display = "none";
    }
  },
};
</script>
<style scoped>
#calculator-wrapper {
  position: fixed;
  left: 50%;
  transform: translate(-50%, 180px);
  bottom: 0px;
}
#calculator-btn {
  cursor: pointer;
  margin-left: 1200px;
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: white;
  background-color: #4b5664;
}
#calculator {
  border-radius: 20px;
  background-color: #4b5664;
  margin: auto;
  width: 1600px;
  height: 200px;
  padding: 10px;
  display: flex;
  justify-content: space-evenly;
}
.cal-wrapper {
  margin: auto;
  color: whitesmoke;
  text-align: center;
  width: 300px;
  margin-bottom: 30px;
}
.finance-wrapper{
  overflow-y: auto;
  height: 350px;
}
ol, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.savingWrapper {
  width: 270px;
  margin : auto;
  border: 2px solid black;
  background-color: #fefefe;
  border-radius: 10px;
  /*#f9ba21*/
  color: black;
  padding: 10px;
  margin-bottom: 5px;
}
.savingWrapper input {
  border-radius: 5px;
  padding: 3px;
  border-width: 1px;
  width: 120px;
  font-size: 14px;
}
.x-btn {
  float: right;
}
.b-pname {
  float: left;
}
.month-input {
  margin-left: 5px;
  width: 80px;
  border-radius: 5px;
  padding: 3px;
  text-align: center;
}
.side-tab {
  height: 100%;
  width: 0;
  position: fixed;
  top: 0;
  right: 0;
  background-color: #333;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  color: whitesmoke;
  z-index: 101;
}

/* 슬라이드 탭 안의 내용 스타일 */
.side-tab a {
  padding: 10px 10px;
  text-decoration: none;
  font-size: 25px;
  color: white;
  display: block;
  transition: 0.3s;
}

.side-tab a:hover {
  background-color: #575757;
}

/* 닫기 버튼 스타일 */
.side-tab .close-btn {
  position: absolute;
  top: 20px;
  right: 25px;
  font-size: 36px;
}


/* 본문에 슬라이드 탭과 겹치는 내용 */
.main-content {
  padding: 20px;
}

.floating-btn {
    background-color: #333;
    color : white;
    position: fixed;
    width: 60px;
    height: 60px;
    border-radius: 100%;
    bottom: 30px;
    right: 30px;
    z-index: 100;
}
.floating-desc{
  border-radius: 10px;
  background-color: white;
  border : 1px solid #333;
  font-size: 14px;
  position : fixed;
  bottom: 110px;
  right : 30px;
  padding : 10px;
  display: none;
  transform: 0.2s;
}
.floating-arrow{
  width: 0;
  height: 0;
  border-bottom: 10px solid transparent;;
  border-top: 10px solid #333;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  position : fixed;
  right : 50px;
  bottom : 90px;
  display: none;
  transform: 0.2s;
}
.floating-btn:hover{
  background-color: #444;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}
.floating-btn:active{
  transform: scale(1.2);
}
.save-input{
  border-radius: 10px;
  width: 150px;
  padding: 5px;
}
</style>
