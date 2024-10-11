import { defineStore } from 'pinia';
import axios from 'axios';

export const calculatorStore = defineStore('calculator', {
  state: () => ({
    savingslist: [],
    fundlist: [],
    gold: 0,
    goldRate: 0, //axios를 사용하여 month 후에 금 이율 예측
    month: 0,
    result: {
      finalAmount: 0,
      process: [],
    },
  }),
  actions: {
    calculate: async function () {
      //계산함수
      console.log(this.savingslist);
      console.log(this.fundlist);
      let res = await axios.get('http://localhost:9000/gold/rate'); //미래 금 이율 가져오기
      this.goldRate = res.data;
      this.result = {
        finalAmount: 0,
        process: [],
      };
      let goldProcessing = {
        name: '금 투자',
        rate: this.goldRate,
        period: this.month,
        amount: this.gold,
        finalAmount: Math.round(
          Number(this.gold) +
            this.gold * (this.goldRate * 0.01) * (this.month / 6)
        ),
      };
      goldProcessing.rate += '(6개월 후 기준)';
      this.result.process.push(goldProcessing);
      this.result.finalAmount += Number(goldProcessing.finalAmount);

      this.savingslist.forEach((savings) => {
        //예적금 상품 계산
        if (savings.savingsDeposit.prdt_div === 'D') {
          //예금인경우
          if (savings.options[0].intr_rate_type_nm === '단리') {
            //예금, 단리인 경우
            let period = savings.options[0].save_trm;
            period = Number(this.month) <= Number(period) ? this.month : period;
            let rate = savings.options[0].intr_rate2;
            let finalAmount = Math.round(
              savings.amount * (rate * 0.01) * (period / 12) +
                Number(savings.amount)
            );
            let processing = {
              name: savings.savingsDeposit.fin_prdt_nm + '/단리',
              rate: rate,
              period: period,
              amount: savings.amount,
              finalAmount: finalAmount,
            };
            this.result.process.push(processing);
            this.result.finalAmount += Number(finalAmount);
          } else {
            //예금, 복리인 경우
            let period = savings.options[0].save_trm;
            period = Number(this.month) <= Number(period) ? this.month : period;
            let rate = savings.options[0].intr_rate2;
            let finalAmount = Math.round(
              savings.amount * Math.pow(1 + (rate * 0.01) / 12, period / 12)
            );
            let processing = {
              name: savings.savingsDeposit.fin_prdt_nm + '/복리',
              rate: rate,
              period: period,
              amount: savings.amount,
              finalAmount: finalAmount,
            };
            this.result.process.push(processing);
            this.result.finalAmount += Number(finalAmount);
          }
        } else {
          //적금인 경우
          if (savings.options[0].intr_rate_type_nm === '단리') {
            //적금, 단리인 경우
            let period = savings.options[0].save_trm;
            period = Number(this.month) <= Number(period) ? this.month : period;
            console.log(period);
            let rate = savings.options[0].intr_rate2;
            let finalAmount = Math.round(
              savings.amount *
                ((period * (period + 1)) / 2) *
                ((rate * 0.01) / 12) +
                Number(savings.amount * period)
            );
            let processing = {
              name: savings.savingsDeposit.fin_prdt_nm + '/단리',
              rate: rate,
              period: period,
              amount: savings.amount,
              finalAmount: finalAmount,
            };
            this.result.process.push(processing);
            this.result.finalAmount += Number(finalAmount);
          } else {
            //적금, 복리인 경우
            let period = savings.options[0].save_trm;
            period = Number(this.month) <= Number(period) ? this.month : period;
            let rate = savings.options[0].intr_rate2;
            let finalAmount = Math.round(
              savings.amount *
                ((Math.pow(1 + (rate * 0.01) / 12, period) - 1) /
                  ((rate * 0.01) / 12))
            );
            let processing = {
              name: savings.savingsDeposit.fin_prdt_nm + '/단리',
              rate: rate,
              period: period,
              amount: savings.amount,
              finalAmount: finalAmount,
            };
            this.result.process.push(processing);
            this.result.finalAmount += Number(finalAmount);
          }
        }
      });
      this.fundlist.forEach((fund) => {
        //펀드 상품 계산
        let period = this.month;
        let rate = fund.oneYRate;
        let finalAmount = Math.round(
          fund.amount * (rate * 0.01) * (period / 12) + Number(fund.amount)
        );
        let processing = {
          name: fund.pname,
          rate: rate,
          period: period,
          amount: fund.amount,
          finalAmount: finalAmount,
        };
        this.result.process.push(processing);
        this.result.finalAmount += Number(finalAmount);
      });
    },
    addSavings: function (getSavings) {
      //예적금 추가 함수 중복된 상품이 있으면 false 반환
      let result = true;
      this.savingslist.forEach((savings) => {
        if (
          savings.savingsDeposit.fin_prdt_cd ===
            getSavings.savingsDeposit.fin_prdt_cd &&
          savings.options[0].rsrv_type === getSavings.options[0].rsrv_type &&
          savings.options[0].intr_rate_type_nm ===
            getSavings.options[0].intr_rate_type_nm
        ) {
          //상품 코드와 투자개월 수가 같으면 같은 상품
          result = false;
        }
      });
      if (result) {
        this.savingslist.push(getSavings);
        //selectCount 증가
        axios.get('http://localhost:9000/finance/count', {
          params: { finPrdtCd: getSavings.savingsDeposit.fin_prdt_cd },
        });
        return alert('상품을 계산기에 추가했습니다');
      } else {
        return alert('이미 상품이 계산기에 있습니다');
      }
    },
    setSavingsAmount: function (getSavings, amount) {
      this.savingslist = this.savingslist.map((savings) => {
        if (
          savings.savingsDeposit.fin_prdt_cd ===
            getSavings.savingsDeposit.fin_prdt_cd &&
          savings.options[0].save_trm === getSavings.options[0].save_trm &&
          savings.options[0].intr_rate_type_nm ===
            getSavings.options[0].intr_rate_type_nm
        ) {
          savings.amount = amount;
        }
        return savings;
      });
    },
    removeSavings: function (getIndex) {
      //예적금 제거 함수
      this.savingslist = this.savingslist.filter((savings, index) => {
        return index !== getIndex;
      });
    },
    addFund: function (getFund) {
      //펀드 추가 함수 중복된 상품이 있으면 false 반환
      let result = true;
      this.fundlist.forEach((fund) => {
        if (fund.prdNo === getFund.prdNo) {
          //같은 번호가 있으면 이미 상품이 계산기에 있음
          result = false;
        }
      });
      if (result) {
        this.fundlist.push(getFund);
        //selectCount 증가
        axios.get('http://localhost:9000/finance/fund/count', {
          params: { prdNo: getFund.prdNo },
        });
        return alert('상품을 계산기에 추가했습니다');
      } else {
        return alert('이미 상품이 계산기에 있습니다');
      }
    },
    removeFund: function (getIndex) {
      //펀드 제거 함수
      this.fundlist = this.fundlist.filter((fund, index) => {
        return getIndex !== index;
      });
    },
    setFundAmount: function (prdNo, amount) {
      //펀드 투자액 설정
      this.fundlist = this.fundlist.map((fund) => {
        if (fund.prdNo === prdNo) {
          fund.amount = amount;
        }
        return fund;
      });
    },
    setMonthlySave: function (save) {
      //월 저금액 설정
      this.monthly_save = save;
    },
    setGold: function (gold) {
      //금 설정
      this.gold = gold;
    },
    setGoldRate: function (rate) {
      //금 이율 설정
      this.goldRate = rate;
    },
    setMonth: function (month) {
      //저축 개월 수 설정
      this.month = month;
    },
  },
});
