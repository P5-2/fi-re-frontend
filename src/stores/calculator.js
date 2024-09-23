import { defineStore } from 'pinia'

export const calculatorStore = defineStore('calculator', {
    state:()=>({
        monthly_save : 200000,
        savingslist : [
            {
                prdNo : 1,
                pname : "국민은행 예금",
                bname : "국민은행",
                minRate : 3.4,
                maxRate : 4.8,
                subPeriod : "12개월",
                subAmount : 30000,
                target : "개인",
                benefit : "자영업자",
                description : "국민은행 예금입니다",
                readCount : 5,
                keyword : "청년,안정,자영업자"
            }
        ],
        fundlist : [
            {
                prdNo : 1,
                pname : "국민은행 펀드",
                type : "MMF",
                rate : 1.2,
                dngrGrade : 5,
                region : "국내",
                bseDt : "2024/05/01",
                subAmount : 1000000,
                readCount : 5
            }
        ],
        gold : 2000000,
        goldRate : 4.8,
        month : 0
    }),
    actions:{
        calculate : function(){ //계산함수
            let result = 0;
            result += this.monthly_save * this.month; //월 저금액 계산
            this.savingslist.forEach((savings)=>{//예적금 상품 계산
                if(savings.subPeriod === null || savings.subPeriod === "0개월"){ //기간이 없거나 0개월인 경우 예금통장이므로 입력한 개월수만큼 이율 계산
                    result += savings.subAmount * (savings.minRate*0.01) * (this.month / 12) + savings.subAmount;
                }else{ //기간이 있는 경우 예금, 적금 상품이므로 상품의 개월수만큼 이율 계산
                    let period = Number(savings.subPeriod.replace("개월", ""));
                    if(period <= this.month){ //period가 더 작으면 period만큼 이윤 계산
                        result += (savings.subAmount * period) * (savings.minRate*0.01) * (period / 12);
                    }else{ //month가 더 작으면 month만큼 이윤계산
                        result += (savings.subAmount * this.month) * (savings.minRate*0.01) * (this.month / 12);
                    }
                }
            })
            this.fundlist.forEach((fund)=>{ //펀드 상품 계산
                result += (fund.subAmount * this.month) * (fund.rate * 0.01) * (this.month / 12);
            })
            result += this.gold * (this.goldRate * 0.01) * (this.month / 12) + this.gold;
            return result;
        },
        addSavings : function(savings){ //예적금 추가 함수
            this.savingslist = {
                ...this.savingslist,
                savings
            }
        },
        removeSavings : function(prdNo){ //예적금 제거 함수
            this.savingslist = this.savingslist.filter((savings)=>{
                return savings.prdNo !== prdNo;
            })
        },
        addFund : function(fund){ //펀드 추가 함수
            this.fundlist = {
                ...this.fundlist,
                fund
            }
        },
        removeFund : function(prdNo){ //펀드 제거 함수
            this.fundlist = this.fundlist.filter((fund)=>{
                return fund.prdNo !== prdNo;
            })
        },
        setFundAmount : function(prdNo, amount){ //펀드 투자액 설정
            this.fundlist = this.fundlist.map((fund)=>{
                if(fund.prdNo === prdNo){
                    fund.subAmount = amount;
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