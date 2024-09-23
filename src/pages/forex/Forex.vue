<template>
    <ForexFetcher v-slot="{ exchangeRates }">
      <ForexTable :exchangeRates="exchangeRates" />
    </ForexFetcher>
  </template>
  
  <script>
  import ForexFetcher from '@/components/forex/ForexFetcher.vue';
  import ForexTable from '@/components/forex/ForexTable.vue';
  
  export default {
    components: {
        ForexFetcher,
        ForexTable,
    },
  };
  </script>
  