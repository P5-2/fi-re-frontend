import axios from 'axios';

// 장바구니에 펀드 추가
export async function addFundToCart(username, prdNo) {
    try {
        const response = await fetch('http://localhost:9000/cart/funds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, prdNo })
        });

        if (!response.ok) {
            throw new Error('Failed to add fund to cart');
        }

        console.log('Fund added to cart successfully');
    } catch (error) {
        console.error('Error adding fund to cart:', error);
    }
}

// 장바구니에서 펀드 삭제
export async function removeFundFromCart(username, prdNo) {
    try {
        const response = await fetch(`http://localhost:9000/cart/funds/${username}/${prdNo}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to remove fund from cart');
        }

        console.log('Fund removed from cart successfully');
    } catch (error) {
        console.error('Error removing fund from cart:', error);
    }
}

// 서버에서 해당 펀드가 장바구니에 있는지 확인
export async function checkFundInCart(username, prdNo) {
    try {
        const response = await fetch(`http://localhost:9000/cart/funds/${username}/${prdNo}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to check if fund is in cart');
        }

        const result = await response.json();
        return result.isInCart; // 서버에서 반환하는 값에 따라 처리
    } catch (error) {
        console.error('Error checking fund in cart:', error);
        return false;
    }
}


// 특정 회원의 장바구니에 담긴 펀드 상품 목록 조회
export async function loadFundsInCart(username) {
    const tokenData = JSON.parse(sessionStorage.getItem("token"));
    const accessToken = tokenData.accessToken;
    try {
        const response = await axios.get(`http://localhost:9000/cart/funds/${username}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching funds in cart:", error);
        throw error;
    }
}