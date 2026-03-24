export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    // ミカさんの環境で動作確認が取れた「最強の組み合わせ」です
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();

    // 以前の実行結果から、このパスで確実にテキストが取れることが判明しています
    if (data.candidates && data.candidates && data.candidates.content) {
      const aiText = data.candidates.content.parts.text;
      return new Response(JSON.stringify({ text: aiText }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 万が一の例外処理
    const errorDetail = data.error ? data.error.message : "応答がありませんでした";
    return new Response(JSON.stringify({ text: "【AIエラー】" + errorDetail }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "接続失敗：" + e.message }), { status: 500 });
  }
}
