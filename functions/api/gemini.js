export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    // 【診断1】Cloudflareからキーが渡されているか
    if (!apiKey) {
      return new Response(JSON.stringify({ text: "【診断結果】Cloudflareの環境変数『GEMINI_API_KEY』が設定されていません。名前を再確認してください。" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // 【診断2】Google側からエラーが返った場合
    if (!response.ok) {
      return new Response(JSON.stringify({ text: `【Google APIエラー】${data.error?.message || "原因不明のエラーです"}` }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      text: data.candidates?.?.content?.parts?.?.text || "応答が空でした"
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: `【システムエラー】${e.message}` }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
