<template>
  <div
    class="collapse collapse-arrow bg-base-100 border border-base-300 shadow-md transition-shadow hover:shadow-lg mb-4"
  >
    <input type="radio" :name="accordionGroup" :checked="defaultChecked" />
    <div class="collapse-title p-6">
      <!-- 标题 -->
      <h2 class="text-xl font-bold hover:text-primary transition-colors">
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
        <span>{{ event.feeds?.length || 0 }} Feeds</span>
        <span>{{ event.articles?.length || 0 }} Articles</span>
      </div>
    </div>

    <div class="collapse-content px-6 pb-6">
      <!-- 图片预览（仅展示第一张） -->
      <div v-if="event.images && event.images.length" class="pb-2">
        <img
          :src="event.images[0].image_link"
          :alt="event.images[0].description"
          class="w-full h-40 object-cover rounded-lg"
        />
      </div>

      <!-- 摘要 -->
      <div class="prose max-w-none pb-4">
        <p v-for="(line, i) in event.group_summary.split('|')" :key="i">
          {{ line }}
        </p>
      </div>

      <!-- Articles 和 Feeds 展示区 -->
      <div class="space-y-4">
        <!-- Articles -->
        <div v-if="event.articles && event.articles.length > 0">
          <h3 class="text-lg font-semibold mb-3 text-base-content">
            <span class="text-red-500"
              >{{ event.articles.length }} Articles</span
            >
          </h3>
          <div class="space-y-2">
            <div
              v-for="article in event.articles"
              :key="article.link"
              class="text-sm text-base-content/80 hover:text-primary transition-colors"
            >
              <a
                :href="article.link"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline"
                @click.stop
              >
                {{ article.title }}
                <span class="text-xs text-base-content/50 ml-1"
                  >({{ article.feed }})</span
                >
              </a>
            </div>
          </div>
        </div>

        <!-- Publishers/Feeds -->
        <div v-if="event.feeds && event.feeds.length > 0">
          <h3 class="text-lg font-semibold mb-3 text-base-content">
            Publishers:
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="feed in event.feeds"
              :key="feed"
              class="badge badge-outline badge-sm"
            >
              {{ feed }}
            </span>
          </div>
        </div>
      </div>

      <!-- Timeline 操作区 -->
      <div class="mt-6 pt-4 border-t border-base-300">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-medium text-base-content/70">Timeline:</div>
          <button
            class="btn btn-sm"
            :class="isTimelineOpen ? 'btn-ghost' : 'btn-outline'"
            @click.stop="onToggleTimeline"
          >
            <span
              v-if="isTimelineLoading"
              class="loading loading-spinner loading-xs mr-2"
            ></span>
            {{ isTimelineOpen ? "Hide timeline" : "Show timeline" }}
          </button>
        </div>
      </div>

      <!-- Timeline 内容区 -->

      <transition name="fade">
        <div
          v-if="isTimelineOpen"
          class="rounded-lg border border-base-300 p-4 bg-base-100/70"
        >
          <!-- Loading -->
          <div v-if="isTimelineLoading" class="py-6 text-center">
            <span
              class="loading loading-spinner loading-md text-primary"
            ></span>
          </div>

          <!-- Empty or Error - both show same message -->
          <div
            v-else-if="timelineError || !timelineItems.length"
            class="text-sm text-base-content/60 py-2 text-center"
          >
            No timeline available
          </div>

          <!-- Timeline list (最多显示5个) - 使用 DaisyUI Timeline 组件 -->
          <div v-else>
            <ul class="timeline timeline-vertical">
              <li v-for="(item, idx) in timelineItems.slice(0, 5)" :key="idx">
                <div class="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5 text-primary"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.81 10.4a.75.75 0 00-1.121 1.006l1.474 1.643a.75.75 0 001.121-.006l3.643-5.09a.75.75 0 000-.853z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div
                  :class="[
                    'timeline-' + (idx % 2 === 0 ? 'start' : 'end'),
                    'mb-10',
                  ]"
                >
                  <time class="font-mono italic text-xs text-base-content/60">
                    {{ formatDate(item.publishedAt) }}
                  </time>
                  <div class="text-lg font-black text-base-content mb-1">
                    {{ item.source }}
                  </div>
                  <a
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-base-content/80 hover:text-primary transition-colors leading-relaxed block hover:underline"
                    @click.stop
                  >
                    {{ item.title }} ↗
                  </a>
                </div>
                <hr v-if="idx < timelineItems.slice(0, 5).length - 1" />
              </li>
            </ul>

            <!-- 显示总数 -->
            <div v-if="timelineItems.length > 5" class="text-center pt-4">
              <span class="text-xs text-base-content/60">
                Showing 5 of {{ timelineItems.length }} timeline items
              </span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { EventGroup } from "../../types/events";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import type { ExternalTimelineEvent } from "../../types/timeline";
import { ExternalTimelineAPI } from "../../services/api";

const props = defineProps<{
  event: EventGroup;
  index?: number;
  accordionGroup?: string;
  defaultChecked?: boolean;
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

// ---------- Timeline states ----------
const isTimelineOpen = ref(false);
const isTimelineLoading = ref(false);
const timelineError = ref<string | null>(null);
const timelineItems = ref<ExternalTimelineEvent[]>([]);

// module-level cache using group_id
const timelineCache: Map<string, ExternalTimelineEvent[]> =
  (globalThis as any).__storyCardTimelineCache__ || new Map();
(globalThis as any).__storyCardTimelineCache__ = timelineCache;

const formatDate = (iso: string): string => {
  const d = dayjs(iso);
  if (!d.isValid()) return "";
  return d.format("YYYY.MM.DD");
};

const loadTimeline = async () => {
  const groupId = props.event.group_id;
  if (!groupId) {
    timelineItems.value = [];
    return;
  }

  if (timelineCache.has(groupId)) {
    timelineItems.value = timelineCache.get(groupId) || [];
    return;
  }

  isTimelineLoading.value = true;
  timelineError.value = null;
  try {
    // 使用 group_id 作为 timeline ID
    const res = await ExternalTimelineAPI.getById(groupId);
    if (res.events && res.events.length > 0) {
      timelineItems.value = res.events;
      timelineCache.set(groupId, timelineItems.value);
    } else {
      timelineItems.value = [];
    }
  } catch (e: any) {
    // 不显示错误，直接设置为空数组，会显示 "No timeline available"
    timelineItems.value = [];
    timelineCache.set(groupId, []); // 缓存空结果，避免重复请求
  } finally {
    isTimelineLoading.value = false;
  }
};

const onToggleTimeline = async () => {
  isTimelineOpen.value = !isTimelineOpen.value;
  if (
    isTimelineOpen.value &&
    !timelineItems.value.length &&
    !isTimelineLoading.value &&
    !timelineError.value
  ) {
    await loadTimeline();
  }
};

// No retry function needed since we don't show errors
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