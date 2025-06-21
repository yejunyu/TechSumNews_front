// News category constants
export const NEWS_CATEGORIES = [
  { id: "all", name: "All", slug: "all", color: "#6b7280", icon: "Grid" },
  {
    id: "ai",
    name: "Artificial Intelligence",
    slug: "ai",
    color: "#3b82f6",
    icon: "Cpu",
  },
  {
    id: "blockchain",
    name: "Blockchain",
    slug: "blockchain",
    color: "#8b5cf6",
    icon: "Link",
  },
  {
    id: "internet",
    name: "Internet",
    slug: "internet",
    color: "#10b981",
    icon: "Globe",
  },
  {
    id: "hardware",
    name: "Hardware",
    slug: "hardware",
    color: "#f59e0b",
    icon: "Monitor",
  },
  {
    id: "software",
    name: "Software",
    slug: "software",
    color: "#6366f1",
    icon: "Code",
  },
  {
    id: "startup",
    name: "Startup & Investment",
    slug: "startup",
    color: "#ef4444",
    icon: "TrendingUp",
  },
  {
    id: "mobile",
    name: "Mobile Apps",
    slug: "mobile",
    color: "#06b6d4",
    icon: "Phone",
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    slug: "cloud",
    color: "#84cc16",
    icon: "Cloud",
  },
  {
    id: "security",
    name: "Cybersecurity",
    slug: "security",
    color: "#f97316",
    icon: "Shield",
  },
  {
    id: "data",
    name: "Big Data",
    slug: "data",
    color: "#ec4899",
    icon: "Database",
  },
];

// Importance levels
export const IMPORTANCE_LEVELS = [
  { value: "high", label: "High", color: "#ef4444" },
  { value: "medium", label: "Medium", color: "#f59e0b" },
  { value: "low", label: "Low", color: "#10b981" },
];

// Time range options
export const TIME_RANGE_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "thisWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "This Quarter", value: "thisQuarter" },
  { label: "This Year", value: "thisYear" },
  { label: "Custom", value: "custom" },
];

// Sort options
export const SORT_OPTIONS = [
  { label: "Latest", value: "publishTime" },
  { label: "Most Viewed", value: "viewCount" },
  { label: "Most Liked", value: "likes" },
  { label: "Relevance", value: "relevance" },
];

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// API 配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",
  TIMEOUT: 10000,
  RETRY_TIMES: 3,
  RETRY_DELAY: 1000,
};

// 缓存配置
export const CACHE_CONFIG = {
  NEWS_CACHE_KEY: "techsum_news_cache",
  TIMELINE_CACHE_KEY: "techsum_timeline_cache",
  CACHE_DURATION: 5 * 60 * 1000, // 5分钟
  MAX_CACHE_SIZE: 100,
};

// 路由路径
export const ROUTES = {
  HOME: "/",
  EVENTS: "/events",
  HIGHLIGHTS: "/highlights",
  TIMELINE: "/timeline",
  NEWS_DETAIL: "/news/:id",
  SEARCH: "/search",
};

// 本地存储键名
export const STORAGE_KEYS = {
  USER_PREFERENCES: "techsum_user_preferences",
  SEARCH_HISTORY: "techsum_search_history",
  READING_HISTORY: "techsum_reading_history",
  FAVORITE_NEWS: "techsum_favorite_news",
};

// Default configuration
export const DEFAULT_CONFIG = {
  THEME: "light",
  LANGUAGE: "en-US",
  PAGE_SIZE: 20,
  AUTO_REFRESH: true,
  REFRESH_INTERVAL: 60000, // 1 minute
  SHOW_IMAGES: true,
  COMPACT_MODE: false,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Network connection failed, please check your network settings",
  SERVER_ERROR: "Server error, please try again later",
  NOT_FOUND: "The requested resource does not exist",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access denied",
  TIMEOUT: "Request timeout, please retry",
  UNKNOWN_ERROR: "Unknown error, please contact administrator",
};

// Success messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: "Data loaded successfully",
  OPERATION_SUCCESS: "Operation successful",
  SAVE_SUCCESS: "Saved successfully",
  DELETE_SUCCESS: "Deleted successfully",
  UPDATE_SUCCESS: "Updated successfully",
};

// 正则表达式
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^1[3-9]\d{9}$/,
  CHINESE: /[\u4e00-\u9fa5]/,
  NUMBER: /^\d+$/,
};

// 文件类型
export const FILE_TYPES = {
  IMAGE: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
  DOCUMENT: ["pdf", "doc", "docx", "txt", "md"],
  VIDEO: ["mp4", "avi", "mov", "wmv", "flv"],
  AUDIO: ["mp3", "wav", "ogg", "aac"],
};

// 响应式断点
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
};
