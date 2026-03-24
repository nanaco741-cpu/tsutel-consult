export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    // ミカさんの環境で成功が確認されている v1 窓口と 2.5 モデル
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user", // ← これが ChatGPT が教えてくれた重要なポイントです！
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();

    // データの抽出（ChatGPTの書き方よりさらに丁寧に、1段ずつ確認します）
    let aiText = "";
    if (data && data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts) {
      aiText = data.candidates.content.parts.text;
    }

    if (!aiText) {
      // もし文字が取れなかった場合、Googleが返してきたエラー内容をそのまま出します
      aiText = "データ解析エラー：" + JSON.stringify(data);
    }

    return new Response(JSON.stringify({ text: aiText }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "サーバーエラー：" + e.message }), { status: 500 });
  }
}
