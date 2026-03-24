export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ text: "エラー：APIキーが設定されていません。" }), { status: 500 });
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

    // 応答の解析（安全な旧式チェック）
    if (data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts && data.candidates.content.parts) {
        return new Response(JSON.stringify({ text: data.candidates.content.parts.text }), {
            headers: { "Content-Type": "application/json" }
        });
    } 
    
    // 安全フィルターなどでブロックされた場合
    const errorMsg = data.error ? data.error.message : "AIが回答を控えました。別の表現で試してください。";
    return new Response(JSON.stringify({ text: "【判定エラー】" + errorMsg }), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ text: "通信失敗：" + e.message }), { status: 500 });
  }
}
