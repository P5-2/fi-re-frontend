<template>
  <div class="card mb-4">
    <div class="card-body text-center">
      <h3>[시드머니] 모으기</h3>
      <p>
        ₩{{ (currentAmount || 0).toLocaleString() }} /
        {{ (goalAmount || 0).toLocaleString() }}
      </p>
      <p>{{ Math.round(((currentAmount || 0) / (goalAmount || 1)) * 100) }}%</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goalAmount: {
      type: Number,
      default: 0,
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
  },
};
</script>
