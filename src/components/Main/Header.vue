<template lang="">
    <div class="header container">
        <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <div class="d-flex align-items-center">
                <a href="/" style="margin-right:24px">
                    <img src="@/assets/logo.png" width="200" height="46">
                </a>
                <ul class="nav col-md-autojustify-content-center">
                    <li>
                        <a href="/savings" class="nav-item nav-link px-2 link-dark">예적금</a>
                    </li>
                    <li>
                        <a href="/fund" class="nav-item nav-link px-2 link-dark">펀드</a>
                    </li>
                    <li>
                        <a href="/gold" class="nav-item nav-link px-2 link-dark">금</a>
                    </li>
                    <li>
                        <a href="/exchange" class="nav-item nav-link px-2 link-dark">외화</a>
                    </li>
                </ul>
            </div>
            
            <div class="member-wrapper text-end">
                <div class="login-wrapper">
                    <div> <!-- 김곰돌 님 환영합니다 --></div>
                    <a href="/login">로그인</a>
                </div>
                <img class="member-img" src="@/assets/unknown.png" width="46" height="46">
            </div>


        </header>
    </div>
</template>
<script>
export default {
    name : "Header",
}
</script>
<style scoped>
    .header{
        width : 1000px;
    }
    header{
        width : 936px;
    }
    .member-wrapper{
        width : fit-content;
        display: inline-flex;
        align-items: center;
    }
    .login-wrapper{
        display: inline-block;
        text-align: right;
        margin-right: 10px;
        font-size: 10px;
    }
    .member-img{
        border-radius: 20px;
    }
    .nav-item:hover{
        background-color: #dedede;
    }
    .nav-item{
        border-radius: 20px;
        width: 68px;
        text-align: center;
    }
</style>