export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{
                text: `
あなたは「売れる漫画構成」を作るプロです。

以下の情報をもとに、4コマ構成を作成してください。

${prompt}

▼絶対ルール
・全体150〜300文字
・各コマ1〜2文
・無駄な説明禁止
・シンプルで刺さる表現

▼構成（固定）
1コマ目：困りごと（読者が共感する悩み）
2コマ目：共感（「わかる」と思わせる）
3コマ目：解決（この人すごいと思わせる）
4コマ目：未来（理想＋ポジティブ変化）

▼重要
・「感情」が伝わる文章にする
・説明ではなく“体験”を書け
・一言で刺すイメージ

▼出力形式（厳守）
【1コマ目】
○○

【2コマ目】
○○

【3コマ目】
○○

【4コマ目】
○○
`
              }]
            }
          ]
        })
      }
    );

    const data = await res.json();

    console.log("Gemini response:", data);

    let text = "AIが回答できませんでした";

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
    }

    if (data?.error?.message) {
      text = "APIエラー: " + data.error.message;
    }

    return new Response(
      JSON.stringify({ text }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ text: "サーバーエラーが発生しました" }),
      { status: 500 }
    );
  }
}
