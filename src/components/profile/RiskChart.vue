<template>
  <div class="risk-chart card mb-4">
    <div class="card-body">
      <h4>위험 점수: {{ riskPoint }}</h4>
      <div class="risk-distribution">
        <div
          class="risk-bar"
          v-for="(color, index) in riskColors"
          :key="index"
          :style="{ backgroundColor: color }"
        >
          <span>{{ riskLabels[index] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    riskPoint: {
      type: Number,
      required: true,
    },
  },
  computed: {
    riskColors() {
      if (this.riskPoint < 15) return ['green', 'yellow', 'red'];
      if (this.riskPoint < 25) return ['yellow', 'orange', 'red'];
      return ['red', 'orange', 'yellow'];
    },
    riskLabels() {
      return ['안정형', '위험중립형', '적극투자형'];
    },
  },
};
</script>
