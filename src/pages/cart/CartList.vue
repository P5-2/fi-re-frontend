<template>
    <div id="CartList">
        <div class="header">
            <h2>즐겨찾기</h2>
            <p>{{ currentItems.length }} 건의 상품이 즐겨찾기에 담겨있습니다.</p>
            <div class="tab-buttons">
                <!-- 탭 버튼들 -->
                <button @click="selectedTab = 'deposit'" :class="{ active: selectedTab === 'deposit' }">예금</button>
                <button @click="selectedTab = 'saving'" :class="{ active: selectedTab === 'saving' }">적금</button>
                <button @click="selectedTab = 'fund'" :class="{ active: selectedTab === 'fund' }">펀드</button>
            </div>

            <!-- 비교하기 버튼 -->
            <button class="compare-button" @click="showComparisonModal"
                :disabled="selectedFunds.length === 0 || selectedFunds.length > 3">
                비교하기 ({{ selectedFunds.length }}/3)
            </button>

            <button @click="removeSelectedItems" class="remove-btn">선택한 항목 삭제</button>
        </div>

        <div v-if="currentItems.length">
            <h3>{{ tabTitle }}</h3>
            <ul>
                <FundItem v-for="(item, index) in currentItems" :key="index" :item="item"
                    :isSelected="selectedItems.has(item.prdNo)" @update-selected-items="updateSelectedItems" />
                <!-- <CartItem v-for="(item, index) in currentItems" :key="index" :item="item" :type="selectedTab"
                    :isSelected="selectedItems.has(item.prdNo)" @update-selected-items="updateSelectedItems" /> -->
            </ul>
        </div>
        <div v-else>
            <p>장바구니에 상품이 없습니다.</p>
        </div>

        <!-- 비교 모달 컴포넌트 -->
        <ComparisonModal :isComparisonModalVisible="isComparisonModalVisible" :selectedFunds="selectedFunds"
            @close="closeModalAndResetFunds" />
    </div>
</template>


<script>
import CartItem from '@/components/cart/CartItem.vue';
import FundItem from '@/components/cart/FundItem.vue';
import ComparisonModal from '@/components/comparison/ComparisonModal.vue';
import { loadFundsInCart, removeFundFromCart } from '@/services/cartServiceFund.js'

export default {
    name: 'CartList',
    components: {
        CartItem,
        FundItem,
        ComparisonModal
    },
    data() {
        return {
            funds: [],
            selectedItems: new Set(),
            selectedFunds: [],
            selectedTab: 'fund',
            isComparisonModalVisible: false,
        };
    },
    computed: {
        currentItems() {
            if (this.selectedTab === 'deposit') {
                return []; // 예금 데이터가 없으므로 빈 배열 반환
            } else if (this.selectedTab === 'saving') {
                return []; // 적금 데이터가 없으므로 빈 배열 반환
            } else if (this.selectedTab === 'fund') {
                return this.funds;
            }
        },
        tabTitle() {
            if (this.selectedTab === 'deposit') {
                return '예금 상품';
            } else if (this.selectedTab === 'saving') {
                return '적금 상품';
            } else if (this.selectedTab === 'fund') {
                return '펀드 상품';
            }
        }
    },
    created() {
        this.loadFunds();
    },
    methods: {
        getUsername() {
            const userData = JSON.parse(localStorage.getItem('user'));

            if (!userData || !userData.username) {
                console.error("Username not found in localStorage");
                return;
            }

            const username = userData.username; // 로컬 스토리지에서 가져온 username
            return username;
        },
        async loadFunds() {
            try {
                const username = this.getUsername();

                const fundsData = await loadFundsInCart(username);
                console.log("Loaded funds:", fundsData); // 데이터 확인

                this.funds = fundsData; // 펀드 데이터 할당
            } catch (error) {
                console.error("Error loading funds:", error);
            }
        },
        updateSelectedItems({ prdNo, isSelected }) {
            if (isSelected) {
                this.selectedItems.add(prdNo);
            } else {
                this.selectedItems.delete(prdNo);
            }

            if (this.selectedTab === 'fund') {
                this.updateSelectedFunds();
            }
        },
        updateSelectedFunds() {
            this.selectedFunds = this.funds.filter(fund => this.selectedItems.has(fund.prdNo));
        },
        showComparisonModal() {
            this.isComparisonModalVisible = true;
        },
        closeModalAndResetFunds() {
            this.isComparisonModalVisible = false;
            // 선택 항목 초기화 (필요 시)
            this.selectedItems.clear();
            this.selectedFunds = [];
        },
        removeSelectedItems() {
            const username = this.getUsername();
            if (this.selectedTab === 'deposit') {
                // 예금 데이터가 없으므로 처리하지 않음
            } else if (this.selectedTab === 'saving') {
                // 적금 데이터가 없으므로 처리하지 않음
            } else if (this.selectedTab === 'fund') {
                // 선택된 펀드 삭제
                const remainingFunds = [];
                this.funds.forEach(async fund => {
                    const isSelected = this.selectedItems.has(fund.prdNo);
                    if (isSelected) {
                        // 서버에서 장바구니에서 해당 펀드 삭제
                        await removeFundFromCart(username, fund.prdNo);
                    } else {
                        remainingFunds.push(fund); // 선택되지 않은 펀드만 남겨둠
                    }
                });

                // 남은 펀드 목록으로 업데이트
                this.funds = remainingFunds;
            }

            // 선택된 항목 초기화
            this.selectedItems.clear();
        }
    }
}
</script>

<style scoped>
#CartList {
    padding: 20px;
    width: 70%;
    margin: 0 auto;
    border-radius: 10px;
    margin-bottom: 20px;
}

.header {
    text-align: center;
    margin-bottom: 20px;
}

h2 {
    margin-bottom: 10px;
    font-size: 1.8em;
    font-weight: bold;
    color: #112D4E;
    /* 팀 컬러 적용 */
}

h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 1.5em;
    color: #000000;
    font-weight: bold;
    text-align: center;
}

ul {
    list-style-type: none;
    padding-left: 0;
}

p {
    font-size: 16px;
    color: #112D4E;
    /* 팀 컬러 적용 */
    text-align: center;
}

.remove-btn {
    background-color: #3F72AF;
    /* 팀 컬러 적용 */
    color: white;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: bold;
    border: none;
    margin-top: 10px;
}

.remove-btn:hover {
    background-color: #112D4E;
    /* 팀 컬러 적용 */
}

.tab-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.tab-buttons button {
    background-color: #DBE2EF;
    /* 팀 컬러 적용 */
    border: 2px solid #3F72AF;
    /* 팀 컬러 적용 */
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    color: #3F72AF;
    /* 팀 컬러 적용 */
    border-radius: 30px;
}

.tab-buttons button.active {
    background-color: #3F72AF;
    /* 팀 컬러 적용 */
    color: white;
}

.tab-buttons button:hover {
    background-color: #112D4E;
    /* 팀 컬러 적용 */
    color: white;
    border-color: #112D4E;
    /* 팀 컬러 적용 */
}

/* 기존 스타일 및 추가된 스타일 */
.compare-button {
    background-color: #3F72AF;
    color: white;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: bold;
    border: none;
    margin-top: 10px;
    margin-right: 10px;
}

.compare-button:disabled {
    background-color: #DBE2EF;
    color: #888;
    cursor: not-allowed;
}

.compare-button:hover:not(:disabled) {
    background-color: #112D4E;
}
</style>
