declare const process: {
  env: Record<string, string | undefined>;
};

export const HF_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY || "";

export const HF_API_URL =
  process.env.EXPO_PUBLIC_HF_API_URL ||
  "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-xlm-roberta-base-sentiment";