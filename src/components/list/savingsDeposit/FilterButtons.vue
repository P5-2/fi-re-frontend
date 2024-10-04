<template>
  <div class="filter-buttons">
    <button
      @click="$emit('filter', 'all')"
      :class="{ active: currentFilter === 'all' }"
    >
      전체
    </button>
    <button
      @click="$emit('filter', 'deposit')"
      :class="{ active: currentFilter === 'deposit' }"
    >
      예금
    </button>
    <button
      @click="$emit('filter', 'savings')"
      :class="{ active: currentFilter === 'savings' }"
    >
      적금
    </button>
  </div>
</template>

<script>
export default {
  props: ["currentFilter"],
};
</script>

<style scoped>
.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button.active {
  background-color: #0080ff;
  color: white;
}

button:not(.active) {
  background-color: #f0f0f0;
}
</style>
