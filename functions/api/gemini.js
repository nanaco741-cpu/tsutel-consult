export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    // 2026年3月最新：最速・最軽量の 3.1 Flash-Lite を使用
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();

    // 正常な回答がある場合
    if (data.candidates && data.candidates && data.candidates.content) {
      return new Response(JSON.stringify({ text: data.candidates.content.parts.text }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Google側でエラー（制限など）が発生している場合、その内容を直接表示する
    const errorMsg = data.error ? data.error.message : "AIが一時的に応答できません。";
    return new Response(JSON.stringify({ text: "【Google制限中】" + errorMsg }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "接続に失敗しました。少し時間をおいてください。" }), { status: 500 });
  }
}
