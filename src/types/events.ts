export interface EventImage {
  image_link: string;
  description: string;
  score: number;
}

export interface EventArticle {
  title: string;
  link: string;
  feed: string;
  published: string;
}

export interface EventGroup {
  group_title: string;
  group_summary: string;
  earliest_published: string;
  importance: number;
  articles: EventArticle[];
  feeds: string[];
  // 新增字段
  event_name?: string;
  images?: EventImage[];
  suggested_headline?: string;
  explanation?: string;
  article_num?: number;
  feed_num?: number;
  image_source?: string;
}
