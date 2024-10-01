<template>
    <footer class="myFooter py-4">
        <div class="container">
            <!-- 페이지 설명 -->
            <p class="mb-3">
                이 사이트는 금융상품을 추천 및 비교하는 사이트입니다. 최신 금융 상품 및 AI를 사용하여 예측된 금 시세를 확인할 수 있습니다. <br>
                저희의 목표는 사용자들이 더 나은 자산계획을 세우도록 돕는 것입니다.
            </p>

            <h5>Reference</h5>
            <table>
                <tbody>
                    <tr>
                        <td class="colNm">입출금 데이터 : 금융감독원 정기예금 API</td>
                        <td class="colLink borderTd"><a href="https://finlife.fss.or.kr/finlife/api/fncCoApi/list.do?menuNo=700052" target="_blank" class="text-white">link</a></td>
                        <td class="colNm">금융꿀팁 데이터 : 금융감독원 금융꿀팁 200선</td>
                        <td class="colLink"><a href="https://fine.fss.or.kr/fine/bbs/B0000340/list.do?menuNo=900014" target="_blank" class="text-white">link</a></td>
                    </tr>
                    <tr>
                        <td class="colNm">펀드 데이터 : 국민은행 펀드 상품</td>
                        <td class="colLink"><a href="https://obank.kbstar.com/quics?page=C016529" target="_blank" class="text-white">link</a></td>
                        <td class="colNm">금융용어 데이터 : 한국예탁결제원 금융용어조회서비스</td>
                        <td class="colLink"><a href="https://www.data.go.kr/data/15001156/openapi.do" target="_blank" class="text-white">link</a></td>
                    </tr>
                    <tr>
                        <td class="colNm">금 데이터 : 금융위원회 일반상품시세정보 API</td>
                        <td class="colLink"><a href="https://www.data.go.kr/data/15094805/openapi.do?recommendDataYn=Y" target="_blank" class="text-white">link</a></td>
                    </tr>
                    <tr>
                        <td class="colNm">외화 데이터 : 한국수출입은행 현재환율 API</td>
                        <td class="colLink"><a href="https://www.koreaexim.go.kr/ir/HPHKIR020M01?apino=2&viewtype=C&searchselect=&searchword=" target="_blank" class="text-white">link</a></td>
                    </tr>
                </tbody>
            </table>

            <!-- 링크 -->
            <p class="mb-0">© 2024 <span class="text-white">Finance Revolution.</span> All Rights Reserved.</p>
            <ul class="list-inline">
            <li class="list-inline-item"><a href="https://github.com/P5-2" target="_blank" class="text-white"><img src="@/assets/footer/github.png" width="45" height="45"></a></li>
            <li class="list-inline-item"><a href="https://www.youtube.com" target="_blank" class="text-white"><img src="@/assets/footer/youtube.png" width="60" height="50"></a></li>
            <li class="list-inline-item"><a href="https://kbitsyourlife.recruiter.co.kr/career/job" target="_blank" class="text-white"><img src="@/assets/footer/kb.png" width="45" height="40"></a></li>
            </ul>
        </div>
    </footer>
</template>

<script>
export default {
    name : 'Footer'
}
</script>

<style scoped>
    .myFooter{
        color: #F9F7F7;
        margin-top: 100px;
        background-color: #112D4E;
    }
    #description{
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between
    }
    table{
        margin: auto;
        text-align: left;
        margin-bottom: 20px;
        border-collapse: separate;
        border-spacing: 10px 0px;
    }
    .colNm{
        width: 400px;
    }
    .colLink{
        width: 50px;
        text-align: center
    }
    .colLink:nth-child(2){
        border-right: 1px solid white;
    }
</style>