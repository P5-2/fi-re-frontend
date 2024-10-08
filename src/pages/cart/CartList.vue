<template>
    <div id="CartList">
        <div class="header">
            <h2>즐겨찾기</h2>
            <p>{{ currentItems.length }} 건의 상품이 즐겨찾기에 담겨있습니다.</p>
            <div class="tab-buttons">
                <!-- 탭 버튼들 -->
                <button @click="selectedTab = 'deposit'" :class="{ active: selectedTab === 'deposit' }">
                    예금
                </button>
                <button @click="selectedTab = 'saving'" :class="{ active: selectedTab === 'saving' }">
                    적금
                </button>
                <button @click="selectedTab = 'fund'" :class="{ active: selectedTab === 'fund' }">
                    펀드
                </button>
            </div>

            <button class="compare-button" @click="showComparisonModal"
                :disabled="(selectedTab === 'fund' && (selectedFundsItems.size === 0 || selectedFundsItems.size > 3)) ||
                        (selectedTab === 'saving' && (selectedSavingsItems.size === 0 || selectedSavingsItems.size > 3)) ||
                        (selectedTab === 'deposit' && (selectedDepositsItems.size === 0 || selectedDepositsItems.size > 3))">
                비교하기 ({{ selectedTab === 'fund' ? selectedFundsItems.size : selectedTab === 'saving' ? selectedSavingsItems.size : selectedDepositsItems.size }}/3)
            </button>



            <button @click="removeSelectedItems" class="remove-btn">선택한 항목 삭제</button>
        </div>

        <div v-if="currentItems.length">
            <h3>{{ tabTitle }}</h3>
            <ul v-if="selectedTab === 'deposit'">
                <p>모든 상품의 이율은 <b style="color: red;">최고 금리</b> 입니다.</p>
                <DepositItem v-for="(item, index) in currentItems" :key="index" :item="item" 
                    :isSelected="selectedDepositsItems.has(`${item.savingsDeposit.fin_prdt_cd}-${item.options[0].intr_rate_type_nm}`)" 
                    @update-selected-items="updateSelectedItemsDeposit" />
            </ul>
            <ul v-if="selectedTab === 'saving'">
                <p>모든 상품의 이율은 <b style="color: red;">최고 금리</b> 입니다.</p>
                <SavingsItem v-for="(item, index) in currentItems" :key="index" :item="item"
                    :isSelected="selectedSavingsItems.has(`${item.savingsDeposit.fin_prdt_cd}-${item.options[0].intr_rate_type_nm}`)" 
                    @update-selected-items="updateSelectedItemsSavings" />
            </ul>
            <ul v-if="selectedTab === 'fund'">
                <FundItem v-for="(item, index) in currentItems" :key="index" :item="item"
                    :isSelected="selectedFundsItems.has(item.prdNo)" @update-selected-items="updateSelectedItemsFund" />
            </ul>
        </div>
        <div v-else>
            <p>장바구니에 상품이 없습니다.</p>
        </div>

        <!-- 비교 모달 컴포넌트 -->
        <!-- 펀드 모달 -->
        <ComparisonModalFund v-if="selectedTab === 'fund'" :isComparisonModalVisible="isComparisonModalVisible"
            :selectedFunds="selectedFunds" @close="closeModalAndReset" />

        <!-- 적금 모달 -->
        <ComparisonModalSavings v-if="selectedTab === 'saving'" :isComparisonModalVisible="isComparisonModalVisible"
            :selectedSavings="selectedSavings" @close="closeModalAndReset" />

        <!-- 예금 모달 -->
        <ComparisonModalDeposit v-if="selectedTab === 'deposit'" :isComparisonModalVisible="isComparisonModalVisible"
            :selectedDeposits="selectedDeposits" @close="closeModalAndReset" />
    </div>
</template>


<script>
import CartItem from '@/components/cart/CartItem.vue';
import FundItem from '@/components/cart/FundItem.vue';
import SavingsItem from '@/components/cart/SavingsItem.vue';
import DepositItem from '@/components/cart/DepositItem.vue';
import ComparisonModalFund from '@/components/comparison/ComparisonModalFund.vue';
import ComparisionModalDepositVue from '@/components/comparison/ComparisionModalDeposit.vue';
import ComparisonModalSavings from '@/components/comparison/ComparisonModalSavings.vue';
import { loadFundsInCart, removeFundFromCart } from '@/services/cartServiceFund.js';
import { loadSavingsDepositByUsername, loadDepositByUsername, removeDepositFromCart, removeSavingsFromCart } from '@/services/cartServiceSD'; // 서비스 파일 임포트


export default {
    name: 'CartList',
    components: {
        CartItem,
        FundItem,
        SavingsItem,
        DepositItem,
        ComparisonModalFund,
        ComparisionModalDepositVue,
        ComparisonModalSavings
    },
    data() {
        return {
            funds: [], // 펀드 데이터를 저장
            savings: [], // 적금 데이터를 저장
            deposits: [], // 예금 데이터를 저장
            selectedFundsItems: new Set(), // 선택된 펀드 항목 관리
            selectedSavingsItems: new Set(), // 선택된 적금 항목 관리
            selectedDepositsItems: new Set(), // 선택된 예금 항목 관리
            selectedFunds: [], // 선택된 펀드들
            selectedDeposits: [], // 선택된 예금들
            selectedSavings: [], // 선택된 적금들
            selectedTab: 'saving', // 기본으로 펀드 탭 선택
            isComparisonModalVisible: false, // 비교 모달 상태
        };
    },
    computed: {
        currentItems() {
            if (this.selectedTab === 'deposit') {
                return this.deposits; // 예금 데이터 반환
            } else if (this.selectedTab === 'saving') {
                return this.savings; // 적금 데이터 반환
            } else if (this.selectedTab === 'fund') {
                return this.funds; // 펀드 데이터 반환
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
        this.loadFunds(); // 펀드 데이터 로드
        this.loadSavings(); // 적금 데이터 로드
        this.loadDeposits(); // 예금 데이터 로드
    },
    methods: {
        getUsername() {
            // 로컬 스토리지에서 user 데이터를 가져옴
            const userData = JSON.parse(localStorage.getItem('user'));

            // user 데이터가 존재하고, username이 있을 경우 반환
            if (userData && userData.username) {
                return userData.username;
            } else {
                console.error("Username not found in localStorage");
                return null;
            }
        }
        ,
        async loadFunds() {
            try {
                const username = this.getUsername();
                const fundsData = await loadFundsInCart(username);
                console.log('Loaded funds:', fundsData);
                this.funds = fundsData; // 펀드 데이터 할당
            } catch (error) {
                console.error('Error loading funds:', error);
            }
        },
        async loadSavings() {
            try {
                const username = this.getUsername();
                const savingsData = await loadSavingsDepositByUsername(username);
                this.savings = savingsData; // 적금 데이터 할당
            } catch (error) {
                console.error('Error loading savings data:', error);
            }
        },
        async loadDeposits() {
            try {
                const username = this.getUsername();
                const depositsData = await loadDepositByUsername(username);
                this.deposits = depositsData; // 예금 데이터 할당
            } catch (error) {
                console.error('Error loading deposit data:', error);
            }
        },
        updateSelectedItemsFund({ prdNo, isSelected }) {
            if (isSelected) {
                this.selectedFundsItems.add(prdNo);
            } else {
                this.selectedFundsItems.delete(prdNo);
            }
            this.updateSelectedData('fund');
        },
        updateSelectedItemsSavings({ prdNo, intr_rate_type_nm, isSelected }) {
            if (intr_rate_type_nm === undefined) {
                console.log("intr_rate_type_nm is undefined, not adding to selectedItems.");
                return;
            }
            const itemKey = `${prdNo}-${intr_rate_type_nm}`;
            console.log("itemKey: ", itemKey);
            if (isSelected.isSelected) {
                this.selectedSavingsItems.add(itemKey);
                console.log("Item added:", itemKey);
            } else {
                const isDeleted = this.selectedSavingsItems.delete(itemKey);
                console.log("Item deleted:", isDeleted, "itemKey:", itemKey);
            }
            this.updateSelectedData('saving');
        },
        updateSelectedItemsDeposit({ prdNo, intr_rate_type_nm, isSelected }) {
            if (intr_rate_type_nm === undefined) {
                console.log("intr_rate_type_nm is undefined, not adding to selectedItems.");
                return;
            }
            const itemKey = `${prdNo}-${intr_rate_type_nm}`;
            console.log("itemKey: ", itemKey);
            if (isSelected.isSelected) {
                this.selectedDepositsItems.add(itemKey);
            } else {
                const isDeleted = this.selectedDepositsItems.delete(itemKey);
                console.log("Item deleted:", isDeleted, "itemKey:", itemKey);
            }
            this.updateSelectedData('deposit');
        },
        updateSelectedData(type) {
            if (type === 'fund') {
                this.selectedFunds = this.funds.filter(fund => this.selectedFundsItems.has(fund.prdNo));
            } else if (type === 'saving') {
                this.selectedSavings = this.savings.filter(savings => {
                    const itemKey = `${savings.savingsDeposit.fin_prdt_cd}-${savings.options[0].intr_rate_type_nm}`;
                    return this.selectedSavingsItems.has(itemKey);
                });
            } else if (type === 'deposit') {
                this.selectedDeposits = this.deposits.filter(deposit => {
                    const itemKey = `${deposit.savingsDeposit.fin_prdt_cd}-${deposit.options[0].intr_rate_type_nm}`;
                    return this.selectedDepositsItems.has(itemKey);
                });
            }
        },
        showComparisonModal() {
            this.isComparisonModalVisible = true;
        },
        closeModalAndReset() {
            this.selectedFunds = [];
            this.selectedSavings = [];
            this.selectedDeposits = [];

            this.selectedFundsItems.clear();
            this.selectedSavingsItems.clear();
            this.selectedDepositsItems.clear();

            this.isComparisonModalVisible = false;
        },
        async removeSelectedItems() {
            const username = this.getUsername();
            if (!username) return;
            if (this.selectedTab === 'fund') {
                let updatedItems = [];
                for (const item of this.funds) {
                    if (this.selectedFundsItems.has(item.prdNo)) {
                        await removeFundFromCart(username, item.prdNo);
                    } else {
                        updatedItems.push(item);
                    }
                }
                this.funds = updatedItems;
            } else if (this.selectedTab === 'saving') {
                let updatedItems = [];
                for (const item of this.savings) {
                    const itemKey = `${item.savingsDeposit.fin_prdt_cd}-${item.options[0].intr_rate_type_nm}`;
                    if (this.selectedSavingsItems.has(itemKey)) {
                        await removeSavingsFromCart(username, item.savingsDeposit.fin_prdt_cd, item.options[0].intr_rate_type_nm);
                    } else {
                        updatedItems.push(item);
                    }
                }
                this.savings = updatedItems;
            } else if (this.selectedTab === 'deposit') {
                let updatedItems = [];
                for (const item of this.deposits) {
                    const itemKey = `${item.savingsDeposit.fin_prdt_cd}-${item.options[0].intr_rate_type_nm}`;
                    if (this.selectedDepositsItems.has(itemKey)) {
                        await removeDepositFromCart(username, item.savingsDeposit.fin_prdt_cd, item.options[0].intr_rate_type_nm);
                    } else {
                        updatedItems.push(item);
                    }
                }
                this.deposits = updatedItems;
            }
            this.selectedFundsItems.clear();
            this.selectedSavingsItems.clear();
            this.selectedDepositsItems.clear();
        }
    }
};
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
    color: #112d4e;
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
    color: #112d4e;
    /* 팀 컬러 적용 */
    text-align: center;
}

.remove-btn {
    background-color: #3f72af;
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
    background-color: #112d4e;
    /* 팀 컬러 적용 */
}

.tab-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.tab-buttons button {
    background-color: #dbe2ef;
    /* 팀 컬러 적용 */
    border: 2px solid #3f72af;
    /* 팀 컬러 적용 */
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    color: #3f72af;
    /* 팀 컬러 적용 */
    border-radius: 30px;
}

.tab-buttons button.active {
    background-color: #3f72af;
    /* 팀 컬러 적용 */
    color: white;
}

.tab-buttons button:hover {
    background-color: #112d4e;
    /* 팀 컬러 적용 */
    color: white;
    border-color: #112d4e;
    /* 팀 컬러 적용 */
}

/* 기존 스타일 및 추가된 스타일 */
.compare-button {
    background-color: #3f72af;
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
    background-color: #dbe2ef;
    color: #888;
    cursor: not-allowed;
}

.compare-button:hover:not(:disabled) {
    background-color: #112d4e;
}
</style>
