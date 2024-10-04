<template>
  <div class="card mb-4 news-block">
    <div class="card-body">
      <h3 class="news-title">금융 뉴스</h3>
      <p class="news-date">{{ currentDate }}</p>
      <div v-if="randomNews.length > 0">
        <div v-for="(item, index) in randomNews" :key="index" class="news-item">
          <h4 class="news-item-title">
            <a :href="item.link" target="_blank" rel="noopener noreferrer">
              {{ filterTitle(item.title) }}
            </a>
          </h4>
          <p class="news-description">
            {{ filterDescription(item.description) }}
          </p>
        </div>
      </div>
      <div v-else>
        <p>뉴스가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    news: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const randomNews = ref([]);
    const currentDate = ref('');

    watch(
      () => props.news,
      (newNews) => {
        if (newNews.length > 0) {
          randomNews.value = newNews
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        } else {
          randomNews.value = [];
        }
      },
      { immediate: true }
    );

    // 오늘 날짜 계산
    const getCurrentDate = () => {
      const today = new Date();
      return today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    currentDate.value = getCurrentDate();

    // HTML 태그 및 엔티티 제거
    const filterTitle = (title) => {
      return title
        .replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '')
        .trim();
    };

    const filterDescription = (description) => {
      return description
        .replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '')
        .trim();
    };

    return {
      randomNews,
      currentDate,
      filterTitle,
      filterDescription,
    };
  },
};
</script>

<style scoped>
.news-block {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.news-title {
  font-size: 1.5rem; /* 제목 크기 조정 */
  color: #333;
  margin-bottom: 10px;
}

.news-date {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
}

.news-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.news-item-title a {
  font-size: 1.2rem; /* 제목 크기 조정 */
  color: #007bff; /* 강조 색상 */
  text-decoration: none; /* 링크 밑줄 제거 */
}

.news-item-title a:hover {
  text-decoration: underline; /* 마우스 오버 시 밑줄 추가 */
}

.news-description {
  color: #555;
  margin: 5px 0 0; /* 위쪽 마진 추가 */
}

.news-item:last-child {
  border-bottom: none; /* 마지막 항목의 테두리 제거 */
}
</style>
