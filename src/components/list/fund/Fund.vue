<template>
    <div class="fund-card" @click="fundItemClick(fund.prdNo)">
        <div class="fund-content">
            <!-- 체크박스 추가 -->
            <label class="custom-checkbox" @click.stop>
                <input type="checkbox" :checked="isChecked" @change="onSelectFund" />
                <span class="checkmark"></span>
            </label>

            <!-- 펀드 정보 섹션 -->
            <div class="fund-info">
                <div class="tags">
                    <span class="tag region-tag">{{ fund.region }}</span>
                    <span class="tag risk-tag">{{ getRiskText(fund.dngrGrade) }}</span>
                    <span class="tag type-tag">{{ fund.type }}</span>
                </div>
                <h2 class="fund-title">{{ fund.pname }}</h2>
                <p class="fund-nav"><b>기준가:</b> <span class="highlight">{{ fund.nav }}</span></p>
            </div>

            <!-- 수익률 정보 섹션 -->
            <div class="fund-rate-section">
                <p class="fund-rate-label">수익률 (3개월)</p>
                <div class="fund-rate">
                    <h1>{{ fund.rate }}%</h1>
                </div>
            </div>

            <!-- 버튼 섹션 -->
            <div class="fund-actions">
                <button @click.stop="toggleLike($event, fund)" class="like-btn">
                    <i :class="fund.userLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
                </button>
                
                <button @click.stop="calcBtn" class="calc-btn">수익 계산</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        fund: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            isChecked: false, // 체크 상태를 저장할 변수
        };
    },
    mounted() {
        this.loadCheckboxState(); // 컴포넌트가 마운트될 때 체크박스 상태 로드

        if (this.fund.userLiked === undefined) {
            this.fund.userLiked = false;
        }

        const likedFunds = JSON.parse(localStorage.getItem('likedFunds')) || [];
        if (likedFunds.includes(this.fund.prdNo)) {
            this.fund.userLiked = true;
        }

    },
    methods: {
        fundItemClick(prdNo) {
            this.$router.push('/itemDetail/fund/' + prdNo);
            console.log(prdNo + '번 펀드가 클릭되었습니다.');
        },
        toggleLike(event, fund) {
            event.stopPropagation();
            fund.userLiked = !fund.userLiked;
            this.saveLikeStatus(fund);

            if (fund.userLiked) {
                alert('상품을 즐겨찾기에 담았습니다!');
            } else {
                this.removeFromComparison(fund);
                alert('상품을 즐겨찾기에서 취소했습니다.');
            }
        },
        saveLikeStatus(fund) {
            const likedFunds = JSON.parse(localStorage.getItem('likedFunds')) || [];
            if (fund.userLiked) {
                likedFunds.push(fund.prdNo);
            } else {
                const index = likedFunds.indexOf(fund.prdNo);
                if (index > -1) {
                    likedFunds.splice(index, 1);
                }
            }
            localStorage.setItem('likedFunds', JSON.stringify(likedFunds));
        },
        getRiskText(grade) {
            switch (grade) {
                case 1: return '매우 높은 위험';
                case 2: return '높은 위험';
                case 3: return '다소 높은 위험';
                case 4: return '보통 위험';
                case 5: return '낮은 위험';
                case 6: return '매우 낮은 위험';
                default: return '알 수 없음';
            }
        },
        calcBtn(event) {
            event.stopPropagation();
            this.fund.amount = 0;
            this.addFund(this.fund);
            alert('상품을 계산기에 추가했습니다');
        },
        onSelectFund(event) {
            this.isChecked = event.target.checked;
            this.saveCheckboxState(); // 체크박스 상태 저장
            this.$emit('select-fund', { fund: this.fund, selected: this.isChecked });
        },
        saveCheckboxState() {
            const checkedFunds = JSON.parse(localStorage.getItem('checkedFunds')) || [];
            if (this.isChecked) {
                if (!checkedFunds.includes(this.fund.prdNo)) {
                    checkedFunds.push(this.fund.prdNo);
                }
            } else {
                // 체크가 해제되면 해당 펀드를 localStorage에서 제거
                const index = checkedFunds.indexOf(this.fund.prdNo);
                if (index > -1) {
                    checkedFunds.splice(index, 1);
                } 
            }
            localStorage.setItem('checkedFunds', JSON.stringify(checkedFunds));
        },
        loadCheckboxState() {
            const checkedFunds = JSON.parse(localStorage.getItem('checkedFunds')) || [];
            this.isChecked = checkedFunds.includes(this.fund.prdNo);
        },
    }
};
</script>


<style scoped>
.fund-card {
    width: 100%;
    max-width: 1100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.fund-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.fund-content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 20px;
    /* 각 섹션 간 간격 추가 */
}

.custom-checkbox {
    position: relative;
    padding-left: 30px;
    margin-right: 15px;
    cursor: pointer;
}

.fund-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-grow: 1;
    /* 왼쪽 정렬 */
    margin-left: 0;
}

.tags {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.tag {
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
}

.region-tag {
    background-color: #3F72AF;
    /* 팀 컬러 */
}

.risk-tag {
    background-color: #DBE2EF;
    /* 팀 컬러 */
    color: #112D4E;
    /* 텍스트 컬러 */
}

.type-tag {
    background-color: #112D4E;
    /* 팀 컬러 */
}

.fund-title {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
    text-align: left;
}

.fund-nav {
    margin: 0;
    font-size: 14px;
    color: #666;
    text-align: left;
}

.highlight {
    color: #3F72AF;
    font-weight: bold;
}

.fund-rate-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 150px;
    margin-right: 20px;
}

.fund-rate-label {
    font-weight: bold;
    color: #333;
}

.fund-rate {
    font-size: 24px;
    font-weight: bold;
    color: #0080ff;
}

.fund-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    min-width: 150px;
}

.no-bg-btn {
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
}

.calc-btn {
    background-color: #3F72AF;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.calc-btn:hover {
    background-color: #112D4E;
}

.like-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: #ccc;
    transition: color 0.3s ease;
}

.like-btn:hover {
    color: #ff6b81;
}

.fas.fa-heart {
    color: #ff6b81;
}

.far.fa-heart {
    color: #ccc;
}


/* check box */
.custom-checkbox {
    display: inline-block;
    position: relative;
    padding-left: 30px;
    cursor: pointer;
    user-select: none;
    font-size: 16px;
}

.custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.custom-checkbox input:checked~.checkmark {
    background-color: #007bff;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.custom-checkbox input:checked~.checkmark:after {
    display: block;
}

.custom-checkbox .checkmark:after {
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}
</style>