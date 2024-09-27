<template>
    <div id="CartList">
        <div class="header">
            <h2>비교함</h2>
            <p>{{ savings.length + funds.length }} 건의 상품이 비교함에 담겨있습니다.</p>
        </div>

        <div v-if="savings.length || funds.length">
            <h3>저축 상품</h3>
            <ul v-if="savings.length">
                <CartItem 
                    v-for="(saving, index) in savings" 
                    :key="index" 
                    :item="saving" 
                    type="saving"
                    @remove-item="removeSaving"
                />
            </ul>
            <p v-else>장바구니에 저축 상품이 없습니다.</p>

            <h3>펀드 상품</h3>
            <ul v-if="funds.length">
                <CartItem 
                    v-for="(fund, index) in funds" 
                    :key="index" 
                    :item="fund" 
                    type="fund"
                    @remove-item="removeFund"
                />
            </ul>
            <p v-else>장바구니에 펀드 상품이 없습니다.</p>
        </div>
        <div v-else>
            <p>장바구니에 상품이 없습니다.</p>
        </div>
    </div>
</template>

<script>
import CartItem from '@/components/cart/CartItem.vue';
import axios from 'axios';

export default {
    name: 'CartList',
    components: {
        CartItem
    },
    data() {
        return {
            savings: [],
            funds: [],
        };
    },
    created() {
        this.fetchCartItems();
    },
    methods: {
        fetchCartItems() {
            axios.get('http://localhost:9000/cart/savings')
                .then(response => {
                    this.savings = response.data;
                })
                .catch(error => {
                    console.error('Error fetching savings:', error);
                });

            axios.get('http://localhost:9000/cart/funds')
                .then(response => {
                    this.funds = response.data;
                })
                .catch(error => {
                    console.error('Error fetching funds:', error);
                });
        },
        removeSaving(prdNo) {
            axios.get('http://localhost:9000/cart/savings/remove', {
                params: { prdNo }
            })
            .then(response => {
                alert(response.data);
                this.fetchCartItems(); 
            })
            .catch(error => {
                console.error('Error removing saving:', error);
                alert(error.response?.data || 'Failed to remove saving from cart.');
            });
        },
        removeFund(prdNo) {
            axios.get('http://localhost:9000/cart/funds/remove', {
                params: { prdNo }
            })
            .then(response => {
                alert(response.data);
                this.fetchCartItems(); 
            })
            .catch(error => {
                console.error('Error removing fund:', error);
                alert(error.response?.data || 'Failed to remove fund from cart.');
            });
        }
    }
}
</script>

<style scoped>
#CartList {
    padding: 20px;
    width: 70%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 10px;
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
}

.header {
    text-align: center;
    margin-bottom: 20px;
}

h2 {
    margin-bottom: 10px;
    font-size: 1.5em;
}

h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 1.2em;
    color: #333;
}

ul {
    list-style-type: none;
    padding-left: 0;
}

p {
    font-size: 14px;
    color: #555;
    text-align: center;
}
</style>
