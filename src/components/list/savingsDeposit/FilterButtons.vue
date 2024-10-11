<template>
  <div class="filter-buttons">
    <button
      @click="toggleFilter('DE')"
      :class="{ active: currentFilter === 'DE' }"
    >
      예금
    </button>
    <button
      @click="toggleFilter('SA')"
      :class="{ active: currentFilter === 'SA' }"
    >
      적금
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps(["currentFilter"]);
const emit = defineEmits(["filter"]);

const toggleFilter = (filter) => {
  if (props.currentFilter === filter) {
    // 현재 필터와 같은 버튼을 클릭하면 필터를 해제
    emit("filter", "ALL");
  } else {
    // 다른 필터를 선택하면 해당 필터 적용
    emit("filter", filter);
  }
};
</script>

<style scoped>
.filter-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px; /* 상품 컴포넌트와의 간격 추가 */
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #dbe2ef;
  color: #112d4e;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

button:hover {
  background-color: #3f72af;
  color: white;
}

button.active {
  background-color: #3f72af; /* 활성화된 버튼의 색상 변경 */
  color: white;
}

button:disabled {
  background-color: #dbe2ef;
  color: #112d4e;
  cursor: not-allowed;
}
</style>
