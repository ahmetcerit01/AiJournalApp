// expo env değişkenleri için type declaration (ts hatasını engeller)
declare const process: {
  env: Record<string, string | undefined>;
};


// api key .env üzerinden geliyor
export const HF_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY || "";