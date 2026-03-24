export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();

    // どんな形式で返ってきても、できる限りテキストを拾い上げる「超安定」ロジック
    let aiText = "";
    if (data && data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts) {
        aiText = data.candidates.content.parts.text;
    } else {
        // AIが空で返してきた場合
        aiText = "申し訳ありません。診断が混み合っています。もう一度「AI診断をスタートする」を押してみてください。";
    }

    return new Response(JSON.stringify({ text: aiText }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    // 通信自体が失敗した場合
    return new Response(JSON.stringify({ text: "サーバーとの通信に失敗しました。時間をおいてお試しください。" }), { status: 500 });
  }
}
