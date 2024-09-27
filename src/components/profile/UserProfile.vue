<template>
  <div class="user-profile card mb-4">
    <div class="card-body">
      <h3>“{{ user.nickname }}”</h3>
      <p>Lv. {{ user.level }}</p>
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: progressPercentage }"
          aria-valuenow="15"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <p>exp {{ user.exp }} / 30</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    progressPercentage() {
      if (this.user.exp >= 30) {
        return '100%';
      }
      return `${(this.user.exp / 30) * 100}%`;
    },
  },
};
</script>
