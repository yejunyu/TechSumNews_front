<template>
  <div
    class="collapse collapse-arrow bg-base-100 border border-base-300 shadow-md transition-shadow hover:shadow-lg mb-4"
  >
    <input type="radio" :name="accordionGroup" :checked="defaultChecked" />
    <div class="collapse-title p-4 md:p-6">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left side: Text content -->
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-2">
            {{ highlight.suggested_headline || highlight.event_name }}
          </h2>
          <div class="text-sm text-base-content/70 flex items-center gap-2">
            <span>{{ formattedDate }}</span>
            <span>•</span>
            <span>{{ highlight.feed_num }} Feeds</span>
            <span>•</span>
            <span>{{ highlight.article_num }} Articles</span>
          </div>
        </div>
        <!-- Image Stack (left fixed) -->
        <div
          v-if="highlight.images && highlight.images.length > 0"
          class="w-full md:w-56 lg:w-64 flex-shrink-0 order-first"
        >
          <div class="relative cursor-pointer" @click.stop="nextImage">
            <!-- Active image -->
            <div
              :key="`active-${currentImageIndex}`"
              class="relative w-full h-40 rounded-lg overflow-hidden hover:brightness-105 transition-brightness duration-150 z-10"
            >
              <img
                v-if="activeImageUrl"
                :src="activeImageUrl"
                :alt="
                  highlight.images?.[currentImageIndex]?.description ||
                  highlight.suggested_headline
                "
                class="w-full h-40 object-cover pointer-events-none"
                @error="onImageError"
              />
              <div
                v-else
                class="w-full h-40 bg-base-200 animate-pulse rounded-lg"
              ></div>
            </div>

            <!-- Background stacked images for visual effect -->
            <div
              v-for="(img, index) in validImages.slice(1, 4)"
              :key="`bg-${img.idx}`"
              class="absolute top-0 left-0 w-full h-40 rounded-lg overflow-hidden opacity-30"
              :style="{
                transform: `translateX(${(index + 1) * 3}px) translateY(${
                  (index + 1) * 3
                }px)`,
                zIndex: 5 - index,
              }"
            >
              <img
                :src="img.url"
                :alt="highlight.suggested_headline"
                class="w-full h-40 object-cover pointer-events-none"
              />
            </div>

            <!-- Image counter and navigation -->
            <div
              class="absolute bottom-2 right-2 bg-base-100/80 rounded-full px-2 py-1 text-xs pointer-events-none z-20"
            >
              {{
                validImages.findIndex((v) => v.idx === currentImageIndex) + 1
              }}/{{ validImages.length }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="collapse-content px-4 md:px-6 pb-4">
      <p v-if="highlight.explanation" class="text-base-content/90 mb-4">
        {{ highlight.group_summary }}
      </p>

      <!-- Nested accordions -->
      <div class="space-y-2">
        <div class="collapse collapse-plus border border-base-300 rounded-box">
          <input type="checkbox" />
          <div class="collapse-title text-sm font-medium">
            Articles ({{ highlight.articles.length }})
          </div>
          <div class="collapse-content pt-2">
            <ul class="pl-4 space-y-2">
              <li v-for="article in highlight.articles" :key="article.link">
                <a
                  :href="article.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-primary transition-colors text-sm"
                  @click.stop
                >
                  {{ article.title }}
                  <span class="text-xs text-base-content/50 ml-1"
                    >({{ article.feed }})</span
                  >
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="collapse collapse-plus border border-base-300 rounded-box">
          <input type="checkbox" />
          <div class="collapse-title text-sm font-medium">
            Feeds ({{ highlight.feeds.length }})
          </div>
          <div class="collapse-content pt-2">
            <div class="pl-1 flex flex-wrap gap-2">
              <span
                v-for="feed in highlight.feeds"
                :key="feed"
                class="badge badge-outline"
                >{{ feed }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { HighlightEvent } from "../../types/highlights";

const props = defineProps<{
  highlight: HighlightEvent;
  accordionGroup?: string;
  defaultChecked?: boolean;
}>();

// Image navigation state stores the original index of the active image
const currentImageIndex = ref(0);

const normalizeUrl = (url: string): string => {
  const u = (url || "").trim();
  if (!u) return "";
  if (u.startsWith("//")) return `https:${u}`;
  return u;
};

const rawImages = computed(() => props.highlight.images || []);

// Build list of valid image indices and urls
const validImages = computed(() =>
  rawImages.value
    .map((img, idx) => ({ idx, url: normalizeUrl(img.image_link) }))
    .filter((x) => /^https?:\/\//.test(x.url))
);

const activeImageUrl = computed(() => {
  const found = validImages.value.find(
    (v) => v.idx === currentImageIndex.value
  );
  if (found) return found.url;
  // if current is not valid, fallback to first valid
  return validImages.value[0]?.url || "";
});

const setToFirstValid = () => {
  if (validImages.value.length === 0) {
    currentImageIndex.value = 0;
  } else {
    currentImageIndex.value = validImages.value[0].idx;
  }
};

const onImageError = () => {
  // Prevent infinite loop by checking if we can switch
  const currentPos = validImages.value.findIndex(
    (v) => v.idx === currentImageIndex.value
  );
  if (currentPos === -1 || validImages.value.length <= 1) {
    return;
  }

  // Try next image only once per error
  const nextPos = (currentPos + 1) % validImages.value.length;
  const newIndex = validImages.value[nextPos].idx;
  currentImageIndex.value = newIndex;
};

// Reset / initialize on data change
watch(
  () => rawImages.value.length,
  () => {
    setToFirstValid();
  },
  { immediate: true }
);

// Advance within valid images only
const nextImage = () => {
  if (validImages.value.length <= 1) {
    return;
  }
  const pos = validImages.value.findIndex(
    (v) => v.idx === currentImageIndex.value
  );
  const nextPos = (pos + 1) % validImages.value.length;
  const newIndex = validImages.value[nextPos].idx;
  currentImageIndex.value = newIndex;
};

const primaryImage = computed(() => {
  if (props.highlight.images && props.highlight.images.length > 0) {
    return props.highlight.images[0].image_link;
  }
  return "";
});

const formattedDate = computed(() => {
  if (!props.highlight.earliest_published) return "No date";
  const dateString = props.highlight.earliest_published
    .replace(/\s(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/, "")
    .trim();
  const date = new Date(dateString.replace(/-/g, "/"));

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
});
</script>

<style scoped>
/* No extra styles needed; using DaisyUI collapse */
</style>