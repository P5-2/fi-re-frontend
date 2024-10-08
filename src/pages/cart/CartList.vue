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
                :disabled="selectedItems.size === 0 || selectedItems.size > 3">
                비교하기 ({{ selectedItems.size }}/3)
            </button>

            <button @click="removeSelectedItems" class="remove-btn">선택한 항목 삭제</button>
        </div>

        <div v-if="currentItems.length">
            <h3>{{ tabTitle }}</h3>
            <ul v-if="selectedTab === 'deposit'">
                <p>모든 상품의 이율은 <b style="color: red;">최고 금리</b> 입니다.</p>
                <DepositItem v-for="(item, index) in currentItems" :key="index" :item="item" :isSelected="Array.from(selectedItems).some(selected =>
                    selected.prdNo === item.savingsDeposit.fin_prdt_cd &&
                    selected.intr_rate_type_nm === item.options[0].intr_rate_type_nm
                )" @update-selected-items="updateSelectedItems" />

                <!-- <DepositItem v-for="(item, index) in currentItems" :key="index" :item="item"
                    :isSelected="selectedItems.has(item.prdNo)" @update-selected-items="updateSelectedItems" /> -->
            </ul>
            <ul v-if="selectedTab === 'saving'">
                <p>모든 상품의 이율은 <b style="color: red;">최고 금리</b> 입니다.</p>
                <SavingsItem v-for="(item, index) in currentItems" :key="index" :item="item"
                    :isSelected="Array.from(selectedItems).some(selected => selected.prdNo === item.savingsDeposit.fin_prdt_cd && selected.intr_rate_type_nm === item.options[0].intr_rate_type_nm)"
                    @update-selected-items="updateSelectedItems" />

                <!--  <SavingsItem v-for="(item, index) in currentItems" :key="index" :item="item"
                    :isSelected="selectedItems.has(item.prdNo)" @update-selected-items="updateSelectedItems" /> -->
            </ul>
            <ul v-if="selectedTab === 'fund'">
                <FundItem v-for="(item, index) in currentItems" :key="index" :item="item"
                    :isSelected="selectedItems.has(item.prdNo)" @update-selected-items="updateSelectedItemsFund" />
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
        <!-- <ComparisonModalFund :isComparisonModalVisible="isComparisonModalVisible" :selectedFunds="selectedFunds"
            @close="closeModalAndResetFunds" /> -->
    </div>
</template>


<script>
import CartItem from '@/components/cart/CartItem.vue';
import FundItem from '@/components/cart/FundItem.vue';
import SavingsItem from '@/components/cart/SavingsItem.vue';
import DepositItem from '@/components/cart/DepositItem.vue';
import ComparisonModalFund from '@/components/comparison/ComparisonModalFund.vue';
import ComparisonModalDeposit from '@/components/comparison/ComparisionModalDeposit.vue';
import ComparisonModalSavings from '@/components/comparison/ComparisonModalSavings.vue';
import { loadFundsInCart, removeFundFromCart } from '@/services/cartServiceFund.js'
import { loadSavingsDepositByUsername, loadDepositByUsername, removeDepositFromCart, removeSavingsFromCart } from '@/services/cartServiceSD'; // 서비스 파일 임포트

export default {
    name: 'CartList',
    components: {
        CartItem,
        FundItem,
        SavingsItem,
        DepositItem,
        ComparisonModalFund,
        ComparisonModalSavings,
        ComparisonModalDeposit
    },
    data() {
        return {
            funds: [], // 펀드 데이터를 저장
            savings: [], // 적금 데이터를 저장
            deposits: [], // 예금 데이터를 저장
            selectedItems: new Set(), // 선택된 항목을 관리
            selectedFunds: [], // 선택된 펀드들
            selectedDeposits: [], // 선택된 예금들
            selectedSavings: [], // 선택된 적금들
            selectedTab: 'saving', // 기본으로 펀드 탭 선택
            isComparisonModalVisible: false, // 비교 모달 상태
        };
    },
    computed: {
        currentItems() {
            // 현재 선택된 탭에 맞는 데이터를 반환
            if (this.selectedTab === 'deposit') {
                return this.deposits; // 예금 데이터 반환
            } else if (this.selectedTab === 'saving') {
                return this.savings; // 적금 데이터 반환
            } else if (this.selectedTab === 'fund') {
                return this.funds; // 펀드 데이터 반환
            }
        },
        tabTitle() {
            // 선택된 탭에 맞는 제목 반환
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
                this.funds = fundsData; // 펀드 데이터 할당
            } catch (error) {
                console.error("Error loading funds:", error);
            }
        },
        async loadSavings() {
            // 적금 데이터를 로드하는 메서드
            try {
                const username = this.getUsername();
                const savingsData = await loadSavingsDepositByUsername(username);
                this.savings = savingsData; // 적금 데이터 할당
            } catch (error) {
                console.error("Error loading savings data:", error);
            }
        },
        async loadDeposits() {
            // 예금 데이터를 로드하는 메서드
            try {
                const username = this.getUsername();
                const depositsData = await loadDepositByUsername(username);
                this.deposits = depositsData; // 예금 데이터 할당
            } catch (error) {
                console.error("Error loading deposit data:", error);
            }
        },
        updateSelectedItemsFund({ prdNo, isSelected }) {
            if (isSelected) {
                // 펀드는 prdNo만 저장
                this.selectedItems.add(prdNo);
            } else {
                // 선택 해제된 항목은 Set에서 제거
                this.selectedItems.delete(prdNo);
            }

            if (this.selectedTab === 'fund') {
                this.updateSelectedData();
            }
        },
        updateSelectedItems({ prdNo, intr_rate_type_nm, isSelected }) {
            // intr_rate_type_nm이 undefined인 경우 추가하지 않음
            if (intr_rate_type_nm === undefined) {
                console.log("intr_rate_type_nm is undefined, not adding to selectedItems.");
                return; // 추가하지 않고 함수 종료
            }

            const itemKey = `${prdNo}-${intr_rate_type_nm}`; // prdNo와 intr_rate_type_nm을 결합한 문자열로 처리
            console.log("itemKey: ", itemKey);
            console.log("isSelected: ", isSelected); // 선택 여부 확인

            if (isSelected.isSelected) {
                // 선택된 항목을 Set에 추가 (문자열로 추가)
                this.selectedItems.add(itemKey);
                console.log("Item added:", itemKey);
            } else {
                // 선택 해제된 항목을 Set에서 제거 (문자열로 삭제)
                const isDeleted = this.selectedItems.delete(itemKey); // Set에서 삭제
                console.log("Item deleted:", isDeleted, "itemKey:", itemKey); // 삭제 여부 확인
            }

            console.log('updateSelectedItems selectedItems', JSON.stringify(Array.from(this.selectedItems)));
            this.updateSelectedData(); // 선택된 상품 목록 업데이트
        },


        updateSelectedData() {
            console.log('updateSelectedData selectedItems', JSON.stringify(Array.from(this.selectedItems)));
            if (this.selectedTab === 'fund') {
                this.selectedFunds = this.funds.filter(fund => {
                    // fund는 prdNo만 selectedItems에 들어가므로 item === fund.prdNo로 비교
                    return Array.from(this.selectedItems).some(item => item === fund.prdNo);
                });
            } else if (this.selectedTab === 'saving') {
                this.selectedSavings = this.savings.filter(savings => {
                    const itemKey = `${savings.savingsDeposit.fin_prdt_cd}-${savings.options[0].intr_rate_type_nm}`;
                    return Array.from(this.selectedItems).some(item => item === itemKey);
                });
            } else if (this.selectedTab === 'deposit') {
                this.selectedDeposits = this.deposits.filter(deposit => {
                    const itemKey = `${deposit.savingsDeposit.fin_prdt_cd}-${deposit.options[0].intr_rate_type_nm}`;
                    return Array.from(this.selectedItems).some(item => item === itemKey);
                });
            }
        },

        showComparisonModal() {
            console.log("모달 창 " + this.selectedFunds);
            // fund, 적금, 예금에 대한 상품 분류해서 모달창 제작
            this.isComparisonModalVisible = true;
        },
        closeModalAndReset() {
            this.isComparisonModalVisible = false;

            // 모든 체크박스를 해제하기 위해 selectedItems도 초기화
            this.selectedItems.clear();

            // 선택된 항목들 초기화
            this.selectedFunds = [];
            this.selectedSavings = [];
            this.selectedDeposits = [];
        }
        ,
        async removeSelectedItems() {
            const username = this.getUsername();
            if (!username) return;

            console.log('delete selectedItems', JSON.stringify(Array.from(this.selectedItems)));


            // 각 탭에 따른 updatedItems 초기화 및 삭제 처리
            if (this.selectedTab === 'fund') {
                let updatedItems = [];  // 펀드의 경우 초기화
                for (const item of this.funds) {
                    if (this.selectedItems.has(item.prdNo)) {
                        await removeFundFromCart(username, item.prdNo); // 펀드 삭제 API 호출
                    } else {
                        updatedItems.push(item);  // 선택되지 않은 항목은 유지
                    }
                }
                this.funds = updatedItems;  // 업데이트된 펀드 목록 적용
            } else if (this.selectedTab === 'saving') {
                let updatedItems = [];  // 적금의 경우 초기화
                for (const item of this.savings) {
                    if (Array.from(this.selectedItems).some(selected =>
                        selected.prdNo === item.savingsDeposit.fin_prdt_cd &&
                        selected.intr_rate_type_nm === item.options[0].intr_rate_type_nm
                    )) {
                        console.log('saving delete');
                        await removeSavingsFromCart(username, item.savingsDeposit.fin_prdt_cd, item.options[0].intr_rate_type_nm); // 적금 삭제 API 호출
                    } else {
                        updatedItems.push(item);  // 선택되지 않은 항목은 유지
                    }
                }
                this.savings = updatedItems;  // 업데이트된 적금 목록 적용
            } else if (this.selectedTab === 'deposit') {
                let updatedItems = [];  // 예금의 경우 초기화
                for (const item of this.deposits) {
                    if (Array.from(this.selectedItems).some(selected =>
                        selected.prdNo === item.savingsDeposit.fin_prdt_cd &&
                        selected.intr_rate_type_nm === item.options[0].intr_rate_type_nm
                    )) {
                        await removeDepositFromCart(username, item.savingsDeposit.fin_prdt_cd, item.options[0].intr_rate_type_nm); // 예금 삭제 API 호출
                    } else {
                        updatedItems.push(item);  // 선택되지 않은 항목은 유지
                    }
                }
                this.deposits = updatedItems;  // 업데이트된 예금 목록 적용
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
