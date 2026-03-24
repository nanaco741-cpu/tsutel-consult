export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // 【診断】Googleからの生の返答をチェック
    if (data.candidates && data.candidates && data.candidates.content) {
        return new Response(JSON.stringify({ text: data.candidates.content.parts.text }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // もしダメなら、エラーの理由（data全体）をテキストにして返す
    const debugInfo = JSON.stringify(data);
    return new Response(JSON.stringify({ text: "【Googleからのエラー詳細】" + debugInfo }), {
        headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "エラー発生：" + e.message }), { status: 500 });
  }
}
