// expo env değişkenleri için type declaration (ts hatasını engeller)
declare const process: {
  env: Record<string, string | undefined>;
};

// hugging face api config – key .env'den geliyor
const HF_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY || "";
const HF_API_URL =
  process.env.EXPO_PUBLIC_HF_API_URL ||
  "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-xlm-roberta-base-sentiment";

export type Sentiment = "positive" | "negative" | "neutral";

export interface AnalysisResult {
  sentiment: Sentiment;
  summary: string;
  advice: string;
}

console.log("[AI SERVICE] API KEY geldi mi:", Boolean(HF_API_KEY));
console.log("[AI SERVICE] HF URL:", HF_API_URL);

// HF Translate TR → EN
async function translateToEnglish(text: string): Promise<string> {
  console.log("[AI SERVICE] >>> HF TRANSLATE CALL:", text);

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/Helsinki-NLP/opus-mt-tr-en",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: text })
      }
    );

    if (!response.ok) {
      console.warn("[AI SERVICE] HF TRANSLATE ERROR, using fallback:", response.status);
      return text;
    }

    const data = await response.json();
    const row = Array.isArray(data) ? data[0] : data;
    const translated = row?.translation_text ?? text;
    console.log("[AI SERVICE] <<< HF TRANSLATED TEXT:", translated);
    return translated;
  } catch (e) {
    console.warn("[AI SERVICE] HF TRANSLATE FAIL:", e);
    return text;
  }
}

async function callHuggingFaceAPI(text: string): Promise<Sentiment> {

  //önce İngilizceye çevrilir
  const isProbablyTurkish = false;
  let finalText = text;

  if (isProbablyTurkish) {
    finalText = await translateToEnglish(text);
  }


  if (!HF_API_KEY) {
    return "neutral";
  }

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: finalText })
  });

  if (!response.ok) {
    return "neutral";
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    return "neutral";
  }

  const row = Array.isArray(data[0]) ? data[0][0] : data[0];

  const rawLabel = row?.label ?? "";
  const label = String(rawLabel).toLowerCase();
  const score: number | undefined =
    typeof row?.score === "number" ? row.score : undefined;

  if (
    score !== undefined &&
    (label.includes("negative") || label.includes("neg") || label === "label_0") &&
    score < 0.8
  ) {
    return "neutral";
  }

  if (!label) return "neutral";


  if (label.includes("positive") || label.includes("pos") || label === "label_2" || label === "label_1_pos") {
    return "positive";
  }

  if (label.includes("negative") || label.includes("neg") || label === "label_0" || label === "label_0_neg") {
    return "negative";
  }

  if (label.includes("neutral") || label.includes("neu") || label === "label_1") {
    return "neutral";
  }

  return "neutral";
}

function buildFriendlyText(sentiment: Sentiment): AnalysisResult {
  if (sentiment === "positive") {
    return {
      sentiment,
      summary: "Bugün genel olarak olumlu bir gün geçirmişsin.",
      advice: "Bu enerjiyi sevdiğin bir işe veya hedefine aktarabilirsin."
    };
  }

  if (sentiment === "negative") {
    return {
      sentiment,
      summary: "Bugün seni zorlayan ve yoran duygular baskın gibi görünüyor.",
      advice: "Kendine nazik ol, kısa bir mola ve güvendiğin biriyle konuşmak iyi gelebilir."
    };
  }

  return {
    sentiment,
    summary: "Bugünün karmaşık geçmiş gibi görünüyor.",
    advice: "Kendine biraz zaman ayırmayı unutma."
  };
}

export async function analyzeWithAI(text: string): Promise<AnalysisResult> {
  try {
    const sentiment = await callHuggingFaceAPI(text);
    return buildFriendlyText(sentiment);
  } catch (e) {
    console.warn("there is a problem with HuggingFace:", e);
    return buildFriendlyText("neutral");
  }
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  return analyzeWithAI(text);
}