<template>
  <div class="filter-buttons">
    <button
      @click="$emit('filter', 'DE')"
      :class="{ active: currentFilter === 'DE' }"
    >
      예금
    </button>
    <button
      @click="$emit('filter', 'SA')"
      :class="{ active: currentFilter === 'SA' }"
    >
      적금
    </button>
  </div>
</template>

<script setup>
defineProps(["currentFilter"]);
</script>

<style scoped>
.filter-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px; /* 상품 컴포넌트와의 간격 추가 */
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #3f72af;
  color: #f9f7f7;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2c5985;
}

button.active {
  background-color: #2c5985; /* 활성화된 버튼의 색상 변경 */
}

button:disabled {
  background-color: #dbe2ef;
  color: #112d4e;
  cursor: not-allowed;
}
</style>
