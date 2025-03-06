import axios from "axios";
import { Translation } from "../models/Translation";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// OpenAI API istemcisi
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI API ile metin çevirisi
const translateWithOpenAI = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> => {
  try {
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only respond with the translation, nothing else.\n\nText: "${text}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    // Tip kontrolü ekleyelim ve farklı bir yaklaşım kullanalım
    const message = response.choices[0]?.message;
    if (message && typeof message.content === "string") {
      return message.content.trim();
    }

    // Tip hatası olursa boş değer döndürmeyelim
    throw new Error("Çeviri yanıtı beklendiği gibi değil");
  } catch (error) {
    console.error("OpenAI çeviri hatası:", error);
    throw new Error("OpenAI ile çeviri yapılırken bir hata oluştu");
  }
};

// Önbellekten çeviri getir veya yeni çeviri yap
const translateText = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> => {
  try {
    // Boş veya çok kısa metinleri çevirmeye gerek yok
    if (!text || text.length < 2) {
      return text;
    }

    // Önbellekte çeviri var mı kontrol et
    const cachedTranslation = await Translation.findOne({
      originalText: text,
      originalLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
    });

    // Önbellekte varsa, kullanım sayısını artır ve döndür
    if (cachedTranslation) {
      await Translation.findByIdAndUpdate(cachedTranslation._id, {
        $inc: { usageCount: 1 },
      });
      return cachedTranslation.translatedText;
    }

    // Yeni çeviri yap
    const translatedText = await translateWithOpenAI(
      text,
      sourceLanguage,
      targetLanguage
    );

    // Çeviriyi önbelleğe kaydet
    await Translation.create({
      originalText: text,
      originalLanguage: sourceLanguage,
      translatedText: translatedText,
      targetLanguage: targetLanguage,
      translationModel: "openai", // model yerine translationModel kullanıyoruz
    });

    return translatedText;
  } catch (error) {
    console.error("Çeviri hatası:", error);
    throw new Error("Metin çevirisi sırasında bir hata oluştu");
  }
};

// OpenAI ile konuşmayı metne çevirme (Speech-to-Text)
const speechToText = async (
  audioBuffer: Buffer,
  language: string
): Promise<string> => {
  try {
    const response = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], "audio.webm", { type: "audio/webm" }),
      model: "whisper-1",
      language: language,
    });

    return response.text;
  } catch (error) {
    console.error("Speech-to-Text hatası:", error);
    throw new Error("Konuşma metne çevrilirken bir hata oluştu");
  }
};

type OpenAIVoice =
  | "alloy"
  | "ash"
  | "coral"
  | "echo"
  | "fable"
  | "onyx"
  | "nova"
  | "sage"
  | "shimmer";

// OpenAI ile metni sese çevirme (Text-to-Speech)
const textToSpeech = async (
  text: string,
  voice: OpenAIVoice = "alloy"
): Promise<Buffer> => {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
    });

    // Ses verisini buffer olarak döndür
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error("Text-to-Speech hatası:", error);
    throw new Error("Metin sese çevrilirken bir hata oluştu");
  }
};

export { translateText, speechToText, textToSpeech };
