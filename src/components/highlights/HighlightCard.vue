<template>
  <div
    class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg mb-4"
  >
    <div class="card-body p-4 md:p-6 cursor-pointer" @click="toggleExpand">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left side: Text content -->
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-2">
            {{ highlight.suggested_headline || highlight.event_name }}
          </h2>
          <div
            class="text-sm text-base-content/70 flex items-center gap-2 mb-3"
          >
            <span>{{ formattedDate }}</span>
            <span>•</span>
            <span>{{ highlight.feed_num }} Feeds</span>
            <span>•</span>
            <span>{{ highlight.article_num }} Articles</span>
          </div>
          <div class="text-primary w-6 h-6" aria-label="Toggle details">
            <ChevronDownIcon
              class="w-full h-full transition-transform"
              :class="{ 'rotate-180': isExpanded }"
            />
          </div>
        </div>
        <!-- Right side: Image -->
        <div
          v-if="primaryImage"
          class="w-full md:w-48 lg:w-56 flex-shrink-0 order-first md:order-last"
        >
          <figure class="h-full">
            <img
              :src="primaryImage"
              :alt="highlight.suggested_headline"
              class="w-full h-full object-cover rounded-lg"
            />
          </figure>
        </div>
      </div>
    </div>

    <!-- Expandable Section -->
    <div ref="detailsSectionRef" class="expandable-section">
      <div class="px-4 md:px-6 pb-4 border-t pt-4">
        <p v-if="highlight.explanation" class="text-base-content/90 mb-4">
          {{ highlight.explanation }}
        </p>

        <!-- Nested Toggles -->
        <div class="space-y-2">
          <!-- Articles Toggle -->
          <div
            class="font-medium cursor-pointer"
            @click.stop="showArticles = !showArticles"
          >
            Articles ({{ highlight.articles.length }})
          </div>
          <transition name="fade">
            <ul v-if="showArticles" class="pl-4 pt-2 space-y-2">
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
          </transition>

          <!-- Feeds Toggle -->
          <div
            class="font-medium cursor-pointer"
            @click.stop="showFeeds = !showFeeds"
          >
            Feeds ({{ highlight.feeds.length }})
          </div>
          <transition name="fade">
            <div v-if="showFeeds" class="pl-4 pt-2 flex flex-wrap gap-2">
              <span
                v-for="feed in highlight.feeds"
                :key="feed"
                class="badge badge-outline"
                >{{ feed }}</span
              >
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { HighlightEvent } from "@/types/highlights";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { gsap } from "gsap";

const props = defineProps<{
  highlight: HighlightEvent;
}>();

const isExpanded = ref(false);
const showArticles = ref(false);
const showFeeds = ref(false);
const detailsSectionRef = ref<HTMLElement | null>(null);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  // Collapse nested sections when main section collapses
  if (!isExpanded.value) {
    showArticles.value = false;
    showFeeds.value = false;
  }
};

watch(isExpanded, (shouldExpand) => {
  const target = detailsSectionRef.value;
  if (target) {
    gsap.to(target, {
      height: shouldExpand ? "auto" : 0,
      opacity: shouldExpand ? 1 : 0,
      duration: 0.4,
      ease: "power2.inOut",
      onStart: () => {
        if (shouldExpand) {
          target.style.display = "block";
        }
      },
      onComplete: () => {
        if (!shouldExpand) {
          target.style.display = "none";
        }
      },
    });
  }
});

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
.expandable-section {
  height: 0;
  opacity: 0;
  overflow: hidden;
  display: none;
}
.rotate-180 {
  transform: rotate(180deg);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 