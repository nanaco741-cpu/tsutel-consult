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

    // 先ほどの「解析エラー」の中に表示されていた「宝の山」から、物語だけを抽出
    if (data && data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts && data.candidates.content.parts) {
      const finalStory = data.candidates.content.parts.text;
      return new Response(JSON.stringify({ text: finalStory }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ text: "AIが物語を構成できませんでした。もう一度お試しください。" }));

  } catch (e) {
    return new Response(JSON.stringify({ text: "サーバーエラーが発生しました。" }), { status: 500 });
  }
}
