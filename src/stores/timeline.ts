import { defineStore } from "pinia";
import type {
  TimelineEvent,
  TimelineFilter,
  ProcessedTimelineEvent,
  TimelineStats,
} from "@/types/timeline";
import { loadTimelineData, getTimelineStats } from "@/services/mockData";
import {
  formatRelativeTime,
  formatDate,
  isDateInRange,
} from "@/utils/dateUtils";

interface TimelineState {
  events: TimelineEvent[];
  filteredEvents: ProcessedTimelineEvent[];
  loading: boolean;
  filter: TimelineFilter;
  stats: TimelineStats | null;
  selectedEvent: TimelineEvent | null;
}

export const useTimelineStore = defineStore("timeline", {
  state: (): TimelineState => ({
    events: [],
    filteredEvents: [],
    loading: false,
    filter: {},
    stats: null,
    selectedEvent: null,
  }),

  getters: {
    // 按重要性分组的事件
    eventsByImportance(): Record<string, ProcessedTimelineEvent[]> {
      const grouped: Record<string, ProcessedTimelineEvent[]> = {
        high: [],
        medium: [],
        low: [],
      };

      this.filteredEvents.forEach((event) => {
        grouped[event.importance].push(event);
      });

      return grouped;
    },

    // 按分类分组的事件
    eventsByCategory(): Record<string, ProcessedTimelineEvent[]> {
      const grouped: Record<string, ProcessedTimelineEvent[]> = {};

      this.filteredEvents.forEach((event) => {
        if (!grouped[event.category]) {
          grouped[event.category] = [];
        }
        grouped[event.category].push(event);
      });

      return grouped;
    },

    // 获取最近的事件
    recentEvents(): ProcessedTimelineEvent[] {
      return this.filteredEvents.slice(0, 10);
    },

    // 获取高重要性事件
    highImportanceEvents(): ProcessedTimelineEvent[] {
      return this.filteredEvents.filter((event) => event.importance === "high");
    },
  },

  actions: {
    // 加载Timeline事件数据
    async fetchTimelineEvents() {
      this.loading = true;
      try {
        const eventsData = await loadTimelineData();
        this.events = eventsData;
        this.applyFilter();
      } catch (error) {
        console.error("Failed to fetch timeline events:", error);
      } finally {
        this.loading = false;
      }
    },

    // 加载Timeline统计
    async fetchTimelineStats() {
      try {
        this.stats = await getTimelineStats();
      } catch (error) {
        console.error("Failed to fetch timeline stats:", error);
      }
    },

    // 应用筛选条件
    applyFilter() {
      let filtered = [...this.events];

      // 按时间范围筛选
      if (this.filter.dateRange) {
        const { start, end } = this.filter.dateRange;
        filtered = filtered.filter((event) =>
          isDateInRange(event.date, start, end)
        );
      }

      // 按分类筛选
      if (this.filter.category && this.filter.category !== "all") {
        filtered = filtered.filter(
          (event) => event.category === this.filter.category
        );
      }

      // 按重要性筛选
      if (this.filter.importance && this.filter.importance.length > 0) {
        filtered = filtered.filter((event) =>
          this.filter.importance!.includes(event.importance)
        );
      }

      // 按标签筛选
      if (this.filter.tags && this.filter.tags.length > 0) {
        filtered = filtered.filter((event) =>
          this.filter.tags!.some((tag) => event.tags.includes(tag))
        );
      }

      // 按时间排序（最新的在前）
      filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // 处理事件数据，添加格式化信息
      this.filteredEvents = filtered.map((event, index) => ({
        ...event,
        relativeTime: formatRelativeTime(event.date),
        formattedDate: formatDate(event.date, "YYYY年MM月DD日"),
        position: this.calculateTimelinePosition(event.date, filtered),
      }));
    },

    // 计算时间轴位置
    calculateTimelinePosition(date: Date, allEvents: TimelineEvent[]): number {
      if (allEvents.length === 0) return 0;

      const sortedDates = allEvents
        .map((e) => new Date(e.date).getTime())
        .sort((a, b) => a - b);

      const minDate = sortedDates[0];
      const maxDate = sortedDates[sortedDates.length - 1];
      const currentDate = new Date(date).getTime();

      if (maxDate === minDate) return 0;

      return Math.round(((currentDate - minDate) / (maxDate - minDate)) * 100);
    },

    // 更新筛选条件
    updateFilter(newFilter: Partial<TimelineFilter>) {
      this.filter = { ...this.filter, ...newFilter };
      this.applyFilter();
    },

    // 清除筛选条件
    clearFilter() {
      this.filter = {};
      this.applyFilter();
    },

    // 设置选中的事件
    setSelectedEvent(event: TimelineEvent | null) {
      this.selectedEvent = event;
    },

    // 根据ID获取事件详情
    async getEventById(id: string): Promise<TimelineEvent | null> {
      try {
        const event = this.events.find((e) => e.id === id);
        if (event) {
          this.selectedEvent = event;
          return event;
        }

        // 如果本地没有，尝试重新加载数据
        await this.fetchTimelineEvents();
        const foundEvent = this.events.find((e) => e.id === id);
        if (foundEvent) {
          this.selectedEvent = foundEvent;
        }
        return foundEvent || null;
      } catch (error) {
        console.error("Failed to get event by id:", error);
        return null;
      }
    },

    // 按分类获取事件
    getEventsByCategory(category: string): ProcessedTimelineEvent[] {
      return this.filteredEvents.filter((event) => event.category === category);
    },

    // 按重要性获取事件
    getEventsByImportance(
      importance: "high" | "medium" | "low"
    ): ProcessedTimelineEvent[] {
      return this.filteredEvents.filter(
        (event) => event.importance === importance
      );
    },

    // 搜索事件
    searchEvents(keyword: string): ProcessedTimelineEvent[] {
      if (!keyword) return this.filteredEvents;

      const lowerKeyword = keyword.toLowerCase();
      return this.filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(lowerKeyword) ||
          event.description.toLowerCase().includes(lowerKeyword) ||
          event.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
      );
    },

    // 获取相关事件
    getRelatedEvents(
      eventId: string,
      limit: number = 3
    ): ProcessedTimelineEvent[] {
      const currentEvent = this.events.find((e) => e.id === eventId);
      if (!currentEvent) return [];

      return this.filteredEvents
        .filter(
          (event) =>
            event.id !== eventId &&
            (event.category === currentEvent.category ||
              event.tags.some((tag) => currentEvent.tags.includes(tag)))
        )
        .slice(0, limit);
    },
  },
});
