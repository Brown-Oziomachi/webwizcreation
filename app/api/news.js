// pages/api/news.js
export default async function handler(req, res) {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  }
  