export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ text: "エラー：APIキーが設定されていません。" }), { status: 500 });
    }

    // ★ 2026年の標準モデル ID：gemini-2.5-flash を指定します
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates && data.candidates.content) {
      return new Response(JSON.stringify({ text: data.candidates.content.parts.text }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 万が一エラーの場合の診断用
    return new Response(JSON.stringify({ text: "★AIエラー詳細★：" + JSON.stringify(data) }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "サーバーエラー：" + e.message }), { status: 500 });
  }
}
