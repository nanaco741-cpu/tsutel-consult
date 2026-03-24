export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    // ★ 最新の住所（v1）です
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();

    if (data.candidates && data.candidates && data.candidates.content) {
      return new Response(JSON.stringify({ text: data.candidates.content.parts.text }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 【チェックポイント】このメッセージが出れば「新コード」が動いています！
    return new Response(JSON.stringify({ text: "★新コード反映済み★：" + JSON.stringify(data) }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "サーバーエラー：" + e.message }), { status: 500 });
  }
}
