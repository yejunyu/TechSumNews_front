// Vercel Serverless Function - 解决生产环境跨域问题
export default async function handler(req, res) {
  // 设置CORS头部，允许所有域名访问
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 处理预检请求
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 只允许GET请求
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 获取timeline ID参数
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Timeline ID is required" });
  }

  try {
    // 代理请求到目标API
    const apiUrl = `https://web-production-136f4.up.railway.app/timelines/${id}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Timeline proxy error:", error);
    return res.status(500).json({
      error: "Failed to fetch timeline data",
      message: error.message,
    });
  }
}
