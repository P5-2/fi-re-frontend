import axios from 'axios';

// 적금 상품을 불러오는 함수
export const loadSavingsDepositByUsername = async (username) => {
    try {
        const response = await axios.get(`http://localhost:9000/cart/savings/${username}`);
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        console.error("Error loading savings deposit:", error);
        throw error; // 에러 발생 시 호출하는 측에서 처리하도록 예외 던짐
    }
};

// 예금 상품을 불러오는 함수
export const loadDepositByUsername = async (username) => {
    try {
        const response = await axios.get(`http://localhost:9000/cart/deposit/${username}`);
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        console.error("Error loading deposit:", error);
        throw error; // 에러 발생 시 호출하는 측에서 처리하도록 예외 던짐
    }
};

// 예금 항목 삭제 (단리/복리 구분 추가)
export async function removeDepositFromCart(username, finPrdtCd, intrRateTypeNm) {
    try {
        const response = await axios.delete(`http://localhost:9000/cart/deposits/${username}/${finPrdtCd}/${intrRateTypeNm}`);
        return response.data;
    } catch (error) {
        console.error('Error removing deposit from cart:', error);
        throw error;
    }
}

// 저축 항목 삭제 (단리/복리 구분 추가)
export async function removeSavingsFromCart(username, finPrdtCd, intrRateTypeNm) {
    try {
        const response = await axios.delete(`http://localhost:9000/cart/savings/${username}/${finPrdtCd}/${intrRateTypeNm}`);
        return response.data;
    } catch (error) {
        console.error('Error removing savings from cart:', error);
        throw error;
    }
}