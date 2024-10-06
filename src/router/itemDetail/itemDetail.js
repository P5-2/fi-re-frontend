import FundItemDetail from "@/pages/itemDetail/FundItemDetail.vue";
import SavingsItemDetail from "@/pages/itemDetail/SavingsItemDetail.vue";

export default [
    {
        path : '/itemDetail/savings/:prdNo/:saveTrm/:intrRateTypeNm',
        component : SavingsItemDetail,
    },
    {
        path : '/itemDetail/fund/:prdNo',
        component : FundItemDetail
    }
]