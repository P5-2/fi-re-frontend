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
        addSavings : function(getSavings){ //예적금 추가 함수 중복된 상품이 있으면 false 반환
            let result = true;
            this.savingslist.forEach((savings)=>{
                if(
                    savings.savingsDeposit.fin_prdt_ct === getSavings.savingsDeposit.fin_prdt_ct
                    && savings.options[0].save_trm === getSavings.options[0].save_trm
                    && savings.options[0].intr_rate_type_nm === getSavings.options[0].intr_rate_type_nm
                )//상품 코드와 투자개월 수가 같으면 같은 상품
                {
                    result = false;
                }
            })
            if(result){
                this.savingslist.push(getSavings);
                return alert("상품을 게산기에 추가했습니다");
            }else{
                return alert("이미 상품이 계산기에 있습니다");
            }
        },
        setSavingsAmount : function(prdNo, amount){
            this.savingslist = this.savingslist.map((savings)=>{
                if(savings.prdNo === prdNo){
                    savings.amount = amount;
                }
                return savings
            })
        },
        removeSavings : function(getIndex){ //예적금 제거 함수
            this.savingslist = this.savingslist.filter((savings, index)=>{
                return index !== getIndex;
            })
        },
        addFund : function(getFund){ //펀드 추가 함수 중복된 상품이 있으면 false 반환
            let result = true;
            this.fundlist.forEach((fund)=>{
                if(fund.prdNo === getFund.prdNo){ //같은 번호가 있으면 이미 상품이 계산기에 있음
                    result = false;
                }
            })
            if(result){
                this.fundlist.push(getFund);
                return alert("상품을 게산기에 추가했습니다");
            }else{
                return alert("이미 상품이 계산기에 있습니다");
            }
        },
        removeFund : function(getIndex){ //펀드 제거 함수
            this.fundlist = this.fundlist.filter((fund, index)=>{
                return getIndex !== index;
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