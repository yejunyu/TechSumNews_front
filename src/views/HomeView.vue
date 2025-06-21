<template>
  <div class="home-view bg-gray-50 min-h-screen">
    <!-- 主要内容区域 -->
    <div class="container mx-auto px-6 py-16">
      <!-- 主标题区域 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          TechSum: <span class="text-blue-600">Decoding the Future...</span>
        </h1>
        
        <div class="flex items-center justify-center mb-8">
          <span class="text-2xl mr-3">🚀</span>
          <p class="text-xl text-gray-600 font-medium">
            AI-Filtered, High-Impact Tech News
          </p>
        </div>

        <!-- 订阅区域 -->
        <div class="max-w-md mx-auto mb-16">
          <div class="flex">
            <el-input
              v-model="email"
              placeholder="Enter your email"
              size="large"
              class="flex-1"
            />
            <el-button
              @click="handleSubscribe"
              type="primary"
              size="large"
              class="ml-2 px-8 bg-black hover:bg-gray-800 border-black"
            >
              Subscribe
            </el-button>
          </div>
        </div>
      </div>

      <!-- 内容区块 -->
      <div class="max-w-2xl mx-auto space-y-8">
        <!-- Latest Tech News -->
        <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-500 animate-flow-down" style="animation-delay: 0.1s;">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <span class="text-xl">🔍</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Latest Tech News</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            Over 3,000+ tech articles from the past 7 days, curated from 30+ top publishers
          </p>
          <div class="flex items-center justify-center">
            <span class="text-gray-400 text-2xl">↓</span>
          </div>
        </div>

        <!-- Key Tech Events -->
        <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-500 animate-flow-down" style="animation-delay: 0.3s;">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span class="text-xl">📋</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Key Tech Events</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            Important tech events verified across multiple sources
          </p>
          <div class="flex items-center justify-center">
            <span class="text-gray-400 text-2xl">↓</span>
          </div>
        </div>

        <!-- Top Highlights -->
        <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-500 animate-flow-down" style="animation-delay: 0.5s;">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <span class="text-xl">⏰</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Top Highlights</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            Most impactful tech breakthroughs and industry moves of the week
          </p>
          <div class="flex items-center justify-center">
            <span class="text-gray-400 text-2xl">↓</span>
          </div>
        </div>

        <!-- Weekly Strategy Insights -->
        <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-500 animate-flow-down" style="animation-delay: 0.7s;">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span class="text-xl">✉️</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Weekly Strategy Insights</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            Exclusive, actionable insights delivered to your inbox
          </p>
          <div class="flex items-center justify-center">
            <span class="text-gray-400 text-2xl">↓</span>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

// 响应式数据
const email = ref("");

// 方法
const handleSubscribe = async () => {
  if (!email.value.trim()) {
    ElMessage.warning("请输入邮箱地址");
    return;
  }

  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    ElMessage.error("请输入有效的邮箱地址");
    return;
  }

  try {
    const response = await fetch('https://tech-backend.datasum.ai/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value
      })
    });

    if (response.ok) {
      ElMessage.success("订阅成功！感谢您的关注");
      email.value = "";
    } else {
      const errorData = await response.json().catch(() => ({}));
      ElMessage.error(errorData.message || "订阅失败，请稍后重试");
    }
  } catch (error) {
    console.error('订阅请求失败:', error);
    ElMessage.error("网络错误，请检查网络连接后重试");
  }
};


</script>

<style scoped>
/* 自定义样式 */
.home-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 向下流动动画 */
@keyframes flow-down {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-flow-down {
  animation: flow-down 0.8s ease-out forwards;
  opacity: 0;
}

/* 卡片悬停效果增强 */
.animate-flow-down:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* 向下箭头动画 */
.animate-flow-down .text-2xl {
  animation: bounce-down 2s infinite;
}

@keyframes bounce-down {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(5px);
  }
  60% {
    transform: translateY(3px);
  }
}


</style>
