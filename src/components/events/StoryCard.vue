<template>
  <div
    class="story-card bg-base-100 rounded-lg shadow-md border border-base-300 transition-all duration-300 ease-in-out"
    @click="goToDetail"
    style="cursor: pointer"
  >
    <div class="p-6">
      <!-- 标题 -->
      <h2
        class="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
        @click.stop="goToDetail"
      >
        {{ event.group_title }}
      </h2>

      <!-- 元数据 -->
      <div
        class="flex items-center space-x-4 text-sm text-base-content/70 mt-2"
      >
        <span>{{ formattedTimestamp }}</span>
        <div
          class="tooltip"
          :data-tip="'Importance: ' + event.importance?.toFixed(2)"
        >
          <div class="flex items-center">
            <span class="mr-1">🔥</span>
            <span>{{ event.importance?.toFixed(2) }}</span>
          </div>
        </div>
        <span class="cursor-pointer hover:underline" @click.stop>
          {{ event.feeds?.length || 0 }} Feeds
        </span>
        <span class="cursor-pointer hover:underline" @click.stop>
          {{ event.articles?.length || 0 }} Articles
        </span>
      </div>
    </div>

    <!-- 图片预览（仅展示第一张） -->
    <div v-if="event.images && event.images.length" class="px-6 pb-2">
      <img
        :src="event.images[0].image_link"
        :alt="event.images[0].description"
        class="w-full h-40 object-cover rounded-lg"
      />
    </div>

    <!-- 摘要 -->
    <div class="px-6 pb-4 prose max-w-none">
      <p v-for="(line, index) in event.group_summary.split('|')" :key="index">
        {{ line }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { EventGroup } from "@/types/events";
import { useRouter } from "vue-router";

const props = defineProps<{
  event: EventGroup;
}>();

const router = useRouter();

const goToDetail = () => {
  router.push({
    name: "EventDetail",
    params: { group_title: props.event.group_title },
  });
};

const formattedTimestamp = computed(() => {
  // 只取日期和时间部分，去掉最后的星期几
  if (!props.event.earliest_published) return "";
  const parts = props.event.earliest_published.trim().split(" ");
  if (parts.length < 2) return "";
  const dateStr = parts[0] + " " + parts[1];
  const date = new Date(dateStr.replace(/-/g, "/"));
  if (isNaN(date.getTime())) return "";
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  };
  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", "");
});
</script>

<style scoped>
.article-list::-webkit-scrollbar {
  width: 4px;
}

.article-list::-webkit-scrollbar-track {
  background: hsl(var(--b2));
  border-radius: 2px;
}

.article-list::-webkit-scrollbar-thumb {
  background: hsl(var(--b3));
  border-radius: 2px;
}

.article-list::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--a));
}
</style>