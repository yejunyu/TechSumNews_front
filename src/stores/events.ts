import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { EventGroup } from "@/types/events";
import { EventsAPI } from "@/services/api";

type SortType = "Popular" | "Trends" | "Latest";
type DayFilter = "All" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export const useEventsStore = defineStore("events", () => {
  const events = ref<EventGroup[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sortType = ref<SortType>("Popular");
  const dayFilter = ref<DayFilter>("All");

  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await EventsAPI.getEvents();
      events.value = data;
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "An unknown error occurred";
    } finally {
      loading.value = false;
    }
  };

  const setSortType = (type: string) => {
    if (["Popular", "Trends", "Latest"].includes(type)) {
      sortType.value = type as SortType;
    }
  };

  const setDayFilter = (day: string) => {
    if (
      ["All", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(day)
    ) {
      dayFilter.value = day as DayFilter;
    }
  };

  const filteredEvents = computed(() => {
    let result = [...events.value];

    // 调试：打印原始数据和当前筛选条件
    console.log("[调试] 当前dayFilter:", dayFilter.value);
    console.log(
      "[调试] 原始events:",
      events.value.map((e) => e.earliest_published)
    );

    // 日期筛选逻辑
    if (dayFilter.value !== "All") {
      const dayMap: Record<DayFilter, string> = {
        Sun: "Sun",
        Mon: "Mon",
        Tue: "Tue",
        Wed: "Wed",
        Thu: "Thu",
        Fri: "Fri",
        Sat: "Sat",
        All: "",
      };
      const targetDay = dayMap[dayFilter.value];
      result = result.filter((event) => {
        const parts = event.earliest_published.trim().split(" ");
        const dayPart = parts[parts.length - 1];
        // 调试：打印每条新闻的星期几和筛选结果
        console.log(
          `[调试] 新闻: ${event.group_title}, earliest_published: ${
            event.earliest_published
          }, dayPart: ${dayPart}, 匹配: ${dayPart === targetDay}`
        );
        return dayPart === targetDay;
      });
    }

    // 排序逻辑
    if (sortType.value === "Latest") {
      result.sort(
        (a, b) =>
          new Date(
            b.earliest_published.split(" ")[0] +
              "T" +
              b.earliest_published.split(" ")[1]
          ).getTime() -
          new Date(
            a.earliest_published.split(" ")[0] +
              "T" +
              a.earliest_published.split(" ")[1]
          ).getTime()
      );
    } else if (sortType.value === "Popular") {
      result.sort((a, b) => b.importance - a.importance);
    } else if (sortType.value === "Trends") {
      result.sort((a, b) => b.articles.length - a.articles.length);
    }

    // 调试：打印最终筛选结果
    console.log(
      "[调试] 最终filteredEvents:",
      result.map((e) => ({
        title: e.group_title,
        earliest_published: e.earliest_published,
      }))
    );

    return result;
  });

  return {
    events,
    loading,
    error,
    sortType,
    dayFilter,
    fetchEvents,
    setSortType,
    setDayFilter,
    filteredEvents,
  };
});
