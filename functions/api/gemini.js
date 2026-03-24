export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // 【修正ポイント】 を確実に指定し、1段ずつ丁寧に中身を確認します
    if (data && data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts && data.candidates.content.parts) {
      const aiResponseText = data.candidates.content.parts.text;
      return new Response(JSON.stringify({ text: aiResponseText }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // もしデータ構造が違った場合、原因を特定するために生データを少しだけ出します
    const debugInfo = data.error ? data.error.message : "Structure Error";
    return new Response(JSON.stringify({ text: "解析エラー：" + debugInfo }));

  } catch (e) {
    return new Response(JSON.stringify({ text: "接続失敗：" + e.message }), { status: 500 });
  }
}
