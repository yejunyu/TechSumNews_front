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
      <p v-for="(line, i) in event.group_summary.split('|')" :key="i">
        {{ line }}
      </p>
    </div>

    <!-- Timeline (lazy) -->
    <div class="px-6 pb-6">
      <div class="flex items-center justify-between mb-3">
        <div class="text-sm font-medium text-base-content/70">
          #{{ timelineId }} Timeline
        </div>
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

          <!-- Error -->
          <div v-else-if="timelineError" class="alert alert-error">
            <span>{{ readableError }}</span>
            <button class="btn btn-sm ml-auto" @click.stop="retry">
              Retry
            </button>
          </div>

          <!-- Empty -->
          <div
            v-else-if="!timelineItems.length"
            class="text-sm text-base-content/60 py-2"
          >
            暂无时间线
          </div>

          <!-- Timeline list -->
          <div v-else class="space-y-2">
            <ul class="timeline timeline-vertical">
              <li v-for="(item, idx) in visibleTimelineItems" :key="idx">
                <div class="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5 text-primary"
                  >
                    <path
                      d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm4.5-1a.5.5 0 000 1h7a.5.5 0 000-1h-7z"
                    />
                  </svg>
                </div>
                <div :class="['timeline-' + (idx % 2 === 0 ? 'start' : 'end')]">
                  <a
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-medium hover:underline"
                  >
                    {{ item.title }} ↗
                  </a>
                  <div class="text-xs text-base-content/60 mt-1">
                    <span class="mr-2">{{ item.source }}</span>
                    <span>{{ formatDate(item.publishedAt) }}</span>
                  </div>
                </div>
                <hr />
              </li>
            </ul>

            <div v-if="hasMoreItems" class="text-center pt-2">
              <button class="btn btn-xs btn-outline" @click.stop="toggleMore">
                {{ showAll ? "View less" : "View more" }}
              </button>
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
const DEFAULT_VISIBLE_COUNT = 4;
const isTimelineOpen = ref(false);
const isTimelineLoading = ref(false);
const timelineError = ref<string | null>(null);
const timelineItems = ref<ExternalTimelineEvent[]>([]);
const showAll = ref(false);

// module-level cache (per file scope)
const timelineCache: Map<number, ExternalTimelineEvent[]> =
  (globalThis as any).__storyCardTimelineCache__ || new Map();
(globalThis as any).__storyCardTimelineCache__ = timelineCache;

const timelineId = computed(() => (props.index ?? 0) + 1);

const visibleTimelineItems = computed(() => {
  if (showAll.value) return timelineItems.value;
  return timelineItems.value.slice(0, DEFAULT_VISIBLE_COUNT);
});

const hasMoreItems = computed(
  () => timelineItems.value.length > DEFAULT_VISIBLE_COUNT
);

const formatDate = (iso: string): string => {
  const d = dayjs(iso);
  if (!d.isValid()) return "";
  return d.format("YYYY.MM.DD");
};

const loadTimeline = async () => {
  const id = timelineId.value;
  if (timelineCache.has(id)) {
    timelineItems.value = timelineCache.get(id) || [];
    return;
  }
  isTimelineLoading.value = true;
  timelineError.value = null;
  try {
    const res = await ExternalTimelineAPI.getById(id);
    if (res.status === "COMPLETED" && res.timeline_data?.events?.length) {
      timelineItems.value = res.timeline_data.events;
      timelineCache.set(id, timelineItems.value);
    } else {
      timelineItems.value = [];
    }
  } catch (e: any) {
    timelineError.value = e?.message || "Failed to load timeline";
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

const retry = async () => {
  await loadTimeline();
};

const toggleMore = () => {
  showAll.value = !showAll.value;
};

const readableError = computed(() => {
  if (!timelineError.value) return "";
  // Normalize common network/CORS errors for better UX
  if (/network error/i.test(timelineError.value)) return "Network Error";
  if (/cors/i.test(timelineError.value)) return "CORS Error";
  return timelineError.value;
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