<template lang="">
    <div id="Remocon">
        <ul>
            <li>
                <a href="/">
                    <img src="@/assets/remocon/home.png" width="48" height="48">
                </a>
            </li>
            <li>
                <a href="/member/info">
                    <img src="@/assets/remocon/info.png" width="48" height="48"> <br>
                    내 정보
                </a>
            </li>
            <li>
                <a href="/">
                    <img src="@/assets/remocon/shopping.png" width="48" height="48"> <br>
                    비교하기
                </a>
            </li>
            <li>
                <a href="/">
                    <img src="@/assets/remocon/survey.png" width="48" height="48"> <br>
                    설문조사
                </a>
            </li>
            <li>
                <a href="/">
                    <img src="@/assets/remocon/recommend.png" width="48" height="48"> <br>
                    추천상품
                </a>
            </li>
            <li>
                <a href="/">
                    <img src="@/assets/remocon/quiz.png" width="48" height="48"> <br>
                    오늘의<br>퀴즈
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name : "Remocon"
}
</script>
<style scoped>
    #Remocon{
        position : fixed;
        top : 25%;
        right : 45px;
    }
    ul, li{
        list-style: none;
        padding: 0px;
    }
    ul{
        background-color: #dedede;
        border-radius: 5px;
        width: 86px;
    }
    li{
        margin: auto;
        width: 80%;
        font-size: 14px;
        text-align: center;
        padding:5px;
    }
    li:not(:last-child){
        border-bottom: 1px #909090 solid;
    }
    a{
        text-decoration: none;
        color : black
    }
</style>