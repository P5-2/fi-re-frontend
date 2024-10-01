<template>
    <div class="fund-card" @click="fundItemClick(fund.prdNo)">
        <div class="fund-content">
            <!-- 체크박스 추가 -->
            <label class="custom-checkbox" @click.stop>
                <input type="checkbox" @change="onSelectFund" />
                <span class="checkmark"></span>
            </label>

            <!-- 펀드 정보 섹션 -->
            <div class="fund-info">
                <h2 class="fund-title">{{ fund.pname }} ({{ fund.region }})</h2>
                <p class="fund-type"><b>유형:</b> {{ fund.type }}</p>
                <p class="fund-nav"><b>기준가:</b> {{ fund.nav }}</p>
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
                <!-- 수익 계산 버튼을 아이콘으로 변경 -->
                <button @click.stop="calcBtn" class="action-btn calc-btn no-bg-btn">
                    <img src="@/assets/fund/calc_icon.png" alt="수익 계산" class="calc-icon" />
                </button>
                <!-- <button @click.stop="calcBtn" class="action-btn calc-btn">수익 계산</button> -->
            </div>
        </div>
    </div>
</template>


<script>
import { mapActions } from 'pinia';
import { calculatorStore } from '@/stores/calculator';

export default {
    props: {
        fund: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            // 좋아요 상태는 초기에는 false로 설정
            product: {
                userLiked: false,
                likeCount: 0
            }
        };
    },
    mounted() {
        if (this.fund.userLiked === undefined) {
            this.fund.userLiked = false;
        }

        // 로컬 스토리지에서 좋아요 상태를 불러옴
        const likedFunds = JSON.parse(localStorage.getItem('likedFunds')) || [];

        // 현재 펀드가 좋아요 목록에 있으면 userLiked를 true로 설정
        if (likedFunds.includes(this.fund.prdNo)) {
            this.fund.userLiked = true;
        }
    },
    methods: {
        toggleLike(event, fund) {
            event.stopPropagation(); // 이벤트 전파 중지

            // fund 객체에서 userLiked 값을 반전시킴 (좋아요/취소)
            fund.userLiked = !fund.userLiked;
            // 로컬 스토리지에 저장된 좋아요 상태 업데이트
            this.saveLikeStatus(fund);

            if (fund.userLiked) {
                // 좋아요 상태로 설정되면 비교함에 추가
                this.addToComparison(fund);
                alert('상품을 즐겨찾기에 담았습니다!');
            } else {
                // 좋아요 취소 상태면 비교함에서 제거
                this.removeFromComparison(fund);
                alert('상품을 즐겨찾기에서 취소했습니다.');
            }
        },
        fundItemClick(prdNo) {
            // 클릭 시 해당 펀드의 상세 페이지로 이동
            this.$router.push('/itemDetail/fund/' + prdNo);
            console.log(prdNo + '번 펀드가 클릭되었습니다.');
        },
        addToComparison(fund) {
            const tokenData = JSON.parse(sessionStorage.getItem('token'));
            const accessToken = tokenData.accessToken;
            const userKey = `cart_data_${accessToken}`;
            const cartData = JSON.parse(localStorage.getItem(userKey)) || { savings: [], funds: [] };

            const isProductInCart = cartData.funds.some(f => f.prdNo === fund.prdNo);

            if (isProductInCart) {
                alert("이 상품은 이미 비교함에 담겨 있습니다.");
                return;
            }

            // fund 객체 전체를 추가
            cartData.funds.push(fund);;

            localStorage.setItem(userKey, JSON.stringify(cartData));
            console.log(fund.prdNo + "번 상품을 비교함에 담았습니다.");
        },
        removeFromComparison(fund) {
            const tokenData = JSON.parse(sessionStorage.getItem('token'));
            const accessToken = tokenData.accessToken;
            const userKey = `cart_data_${accessToken}`;
            const cartData = JSON.parse(localStorage.getItem(userKey)) || { savings: [], funds: [] };

            // 비교함에서 해당 상품 제거
            cartData.funds = cartData.funds.filter(f => f.prdNo !== fund.prdNo);

            localStorage.setItem(userKey, JSON.stringify(cartData));
            console.log(fund.prdNo + "번 상품을 비교함에서 제거했습니다.");
        },
        // 좋아요 상태를 로컬 스토리지에 저장
        saveLikeStatus(fund) {
            const likedFunds = JSON.parse(localStorage.getItem('likedFunds')) || [];

            if (fund.userLiked) {
                // 좋아요가 눌린 경우 배열에 추가
                likedFunds.push(fund.prdNo);
            } else {
                // 좋아요가 취소된 경우 배열에서 제거
                const index = likedFunds.indexOf(fund.prdNo);
                if (index > -1) {
                    likedFunds.splice(index, 1);
                }
            }

            // 업데이트된 좋아요 상태를 다시 저장
            localStorage.setItem('likedFunds', JSON.stringify(likedFunds));
        },

        ...mapActions(calculatorStore, ['addFund']),
        calcBtn(event) {
            event.stopPropagation();
            this.fund.amount = 0;
            this.addFund(this.fund);
            alert('상품을 계산기에 추가했습니다');
        },
        onSelectFund(event) {
            this.$emit('select-fund', { fund: this.fund, selected: event.target.checked });
        },

    }
};
</script>

<style scoped>
.fund-card {
    width: 100%;
    /* 부모 컨테이너에 맞춤 */
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
    justify-content: space-between;
    width: 100%;
}

.fund-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 300px;
    margin-right: 20px;
}

.fund-title {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.fund-type,
.fund-nav {
    margin: 0;
    font-size: 14px;
    color: #666;
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

.calc-btn {
    background-color: #f0f0f0;
    color: #333;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.calc-btn:hover {
    background-color: #e0e0e0;
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

/* 커스텀 체크박스 */
.custom-checkbox {
    position: relative;
    padding-left: 30px;
    margin-right: 20px;
    cursor: pointer;
    user-select: none;
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

/* 수익 계산 아이콘 크기 조정 */
.calc-icon {
    width: 24px;   /* 아이콘 너비 */
    height: 24px;  /* 아이콘 높이 */
}
.no-bg-btn {
    background-color: transparent; /* 배경색 투명화 */
    border: none; /* 테두리 없앰 */
    padding: 0; /* 여백 제거 */
    cursor: pointer; /* 클릭 가능 표시 */
}

</style>