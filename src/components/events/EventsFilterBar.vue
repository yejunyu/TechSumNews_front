<template>
  <div class="p-4 bg-base-200 rounded-lg mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 内容排序 -->
      <div>
        <div class="join">
          <button
            v-for="item in sortTypes"
            :key="item"
            class="join-item btn btn-sm"
            :class="{ 'btn-primary': eventsStore.sortType === item }"
            @click="eventsStore.setSortType(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>
      <!-- 日期筛选 -->
      <div class="md:text-right">
        <div class="join">
          <button
            v-for="day in dayFilters"
            :key="day"
            class="join-item btn btn-sm"
            :class="{ 'btn-primary': eventsStore.dayFilter === day }"
            @click="eventsStore.setDayFilter(day)"
          >
            {{ day }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventsStore } from "@/stores/events";

const eventsStore = useEventsStore();

const sortTypes = ["Popular", "Trends", "Latest"];
const dayFilters = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "All"];
</script> 