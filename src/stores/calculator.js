import { defineStore } from 'pinia'

export const calculatorStore = defineStore('calculator', {
    state:()=>({
        monthly_save : 0,
        savingslist : [],
        fundlist : [],
        gold : 0,
        goldRate : 1.5, //axios를 사용하여 month 후에 금 이율 예측
        month : 0
    }),
    actions:{
        calculate : function(){ //계산함수
            console.log(this.savingslist);
            console.log(this.fundlist);
            let result = 0;
            result += this.monthly_save * this.month; //월 저금액 계산
            this.savingslist.forEach((savings)=>{//예적금 상품 계산
                if(savings.type === "예금"){ //예금인 경우 이율 계산
                    let period = (savings.subPeriod <= this.month) ? savings.subPeriod : this.month;
                    result += Number(savings.amount) + (savings.amount * savings.minRate * 0.01 * (period / 12));
                }else{ //적금인 경우
                    result += Number(savings.amount * this.month) + (savings.amount * this.month * (savings.minRate * 0.01) * (this.month / 12));
                }
            })
            this.fundlist.forEach((fund)=>{ //펀드 상품 계산
                result += Number(fund.amount) + (fund.amount * (fund.rate * 0.01 * 4) * (this.month / 12));
            })
            result += this.gold * (this.goldRate * 0.01) * (this.month / 12) + this.gold;
            return result;
        },
        addSavings : function(savings){ //예적금 추가 함수
            this.savingslist.push(savings);
        },
        setSavingsAmount : function(prdNo, amount){
            this.savingslist = this.savingslist.map((savings)=>{
                if(savings.prdNo === prdNo){
                    savings.amount = amount;
                }
                return savings
            })
        },
        removeSavings : function(prdNo){ //예적금 제거 함수
            this.savingslist = this.savingslist.filter((savings)=>{
                return savings.prdNo !== prdNo;
            })
        },
        addFund : function(fund){ //펀드 추가 함수
            this.fundlist.push(fund);
        },
        removeFund : function(prdNo){ //펀드 제거 함수
            this.fundlist = this.fundlist.filter((fund)=>{
                return fund.prdNo !== prdNo;
            })
        },
        setFundAmount : function(prdNo, amount){ //펀드 투자액 설정
            this.fundlist = this.fundlist.map((fund)=>{
                if(fund.prdNo === prdNo){
                    fund.amount = amount;
                }
                return fund;
            })
        },
        setMonthlySave : function(save){ //월 저금액 설정
            this.monthly_save = save;
        },
        setGold : function(gold){ //금 설정
            this.gold = gold;
        },
        setGoldRate : function(rate){ //금 이율 설정
            this.goldRate = rate;
        },
        setMonth : function(month){ //저축 개월 수 설정
            this.month = month;
        }
    }
})