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

    // ★ ミカさんが見つけた「構造」を、ここで1つずつ分解して取り出します
    if (data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts && data.candidates.content.parts) {
      
      // ここで、ついに「はい、承知いたしました...」の文字が変数に入ります
      const aiResponseText = data.candidates.content.parts.text;

      return new Response(JSON.stringify({ text: aiResponseText }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // もし構造が違った場合の「最終手段」：生データをそのまま出して原因を暴く
    return new Response(JSON.stringify({ text: "解析エラー：" + JSON.stringify(data) }));

  } catch (e) {
    return new Response(JSON.stringify({ text: "サーバーエラー：" + e.message }), { status: 500 });
  }
}
