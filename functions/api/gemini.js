export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;
    
    // 安定性が確認されている v1 窓口と 2.5 モデルを使用
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // 1. 正常な回答を「執念」で探すロジック
    try {
        if (data && data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts) {
            const aiText = data.candidates.content.parts.text;
            if (aiText) {
                return new Response(JSON.stringify({ text: aiText }), {
                    headers: { "Content-Type": "application/json" }
                });
            }
        }
    } catch (e) {
        // パース失敗時は次へ
    }

    // 2. もしダメなら、Google側の「生のエラー理由」を突き止める
    let errorInfo = "不明なエラー";
    if (data.error) {
        errorInfo = data.error.message;
    } else if (data.candidates && data.candidates && data.candidates.finishReason) {
        errorInfo = "中断理由: " + data.candidates.finishReason;
    }

    return new Response(JSON.stringify({ text: "【解析失敗】" + errorInfo }), {
        headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "【サーバーエラー】" + e.message }), { status: 500 });
  }
}
