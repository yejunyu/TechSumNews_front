import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

// 格式化相对时间
export const formatRelativeTime = (date: Date): string => {
  return dayjs(date).fromNow();
};

// 格式化日期
export const formatDate = (
  date: Date,
  format: string = "YYYY-MM-DD"
): string => {
  return dayjs(date).format(format);
};

// 格式化日期时间
export const formatDateTime = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD HH:mm");
};

// 获取今天的开始和结束时间
export const getTodayRange = () => {
  const start = dayjs().startOf("day").toDate();
  const end = dayjs().endOf("day").toDate();
  return { start, end };
};

// 获取本周的开始和结束时间
export const getThisWeekRange = () => {
  const start = dayjs().startOf("week").toDate();
  const end = dayjs().endOf("week").toDate();
  return { start, end };
};

// 获取本月的开始和结束时间
export const getThisMonthRange = () => {
  const start = dayjs().startOf("month").toDate();
  const end = dayjs().endOf("month").toDate();
  return { start, end };
};

// 获取本季度的开始和结束时间（手动计算）
export const getThisQuarterRange = () => {
  const now = dayjs();
  const month = now.month();
  const year = now.year();

  let quarterStart: dayjs.Dayjs;
  if (month < 3) {
    quarterStart = dayjs().year(year).month(0).startOf("month");
  } else if (month < 6) {
    quarterStart = dayjs().year(year).month(3).startOf("month");
  } else if (month < 9) {
    quarterStart = dayjs().year(year).month(6).startOf("month");
  } else {
    quarterStart = dayjs().year(year).month(9).startOf("month");
  }

  const quarterEnd = quarterStart.add(2, "month").endOf("month");

  return {
    start: quarterStart.toDate(),
    end: quarterEnd.toDate(),
  };
};

// 获取本年的开始和结束时间
export const getThisYearRange = () => {
  const start = dayjs().startOf("year").toDate();
  const end = dayjs().endOf("year").toDate();
  return { start, end };
};

// 检查日期是否在指定范围内
export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  const targetDate = dayjs(date);
  return targetDate.isAfter(dayjs(start)) && targetDate.isBefore(dayjs(end));
};

// 获取两个日期之间的天数差
export const getDaysDifference = (date1: Date, date2: Date): number => {
  return Math.abs(dayjs(date1).diff(dayjs(date2), "day"));
};

// 时间段预设选项
export const getTimeRangeOptions = () => [
  {
    label: "今天",
    value: "today",
    range: getTodayRange(),
  },
  {
    label: "本周",
    value: "thisWeek",
    range: getThisWeekRange(),
  },
  {
    label: "本月",
    value: "thisMonth",
    range: getThisMonthRange(),
  },
  {
    label: "本季度",
    value: "thisQuarter",
    range: getThisQuarterRange(),
  },
  {
    label: "本年",
    value: "thisYear",
    range: getThisYearRange(),
  },
];
