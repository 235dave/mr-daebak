
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { MenuItem, CartItem, VoiceIntent, IntentType } from '../types';

// Safe environment variable access
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error
  }
  return '';
};

const API_KEY = getApiKey();

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to check if API key is present
export const isGeminiConfigured = (): boolean => {
  return !!API_KEY;
};

/**
 * Creates a chat session for the recommendation bot.
 */
export const createChatSession = (menuItems: MenuItem[]) => {
  if (!isGeminiConfigured()) return null;

  const menuContext = menuItems.map(m => `${m.name} (${m.category}, $${m.price}): ${m.description}`).join("\n");

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `
        당신은 '미스터 대박'이라는 한식당의 친절하고 재치 있는 웨이터입니다.
        손님의 질문에 한국어로 자연스럽게 대답하세요.

        --- [메뉴 목록] ---
        ${menuContext}

        --- [특별 디너 종류 및 구성] ---
        미스터 대박은 여러 명이 각자 따로 주문할 수 있는 다양한 디너를 제공합니다.
        1. 발렌타인 디너 (Valentine dinner): 작은 하트 모양과 큐피드가 장식된 접시에 냅킨과 함께 와인, 스테이크 제공.
        2. 프렌치 디너 (French dinner): 커피 한 잔, 와인 한 잔, 샐러드, 스테이크 제공.
        3. 잉글리시 디너 (English dinner): 에그 스크램블, 베이컨, 빵, 스테이크 제공.
        4. 샴페인 축제 디너 (Champagne Feast dinner): 항상 2인 식사이며, 샴페인 1병, 바게트 4개, 커피 포트, 와인, 스테이크 제공.

        --- [서빙 스타일 및 규칙] ---
        디너는 세 가지 서빙 스타일(simple, grand, deluxe)로 제공되며, 스타일이 좋을수록 가격이 비싸집니다.

        1. 심플 스타일 (Simple style): 플라스틱 접시, 플라스틱 컵, 종이 냅킨이 플라스틱 쟁반에 제공. 와인 포함 시 잔은 플라스틱 잔 제공.
        2. 그랜드 스타일 (Grand style): 도자기 접시, 도자기 컵, 흰색 면 냅킨이 나무 쟁반에 제공. 와인 포함 시 잔은 플라스틱 잔 제공.
        3. 디럭스 스타일 (Deluxe style): 꽃들이 있는 작은 꽃병, 도자기 접시, 도자기 컵, 린넨 냅킨이 나무 쟁반에 제공. 와인 포함 시 잔은 유리 잔 제공.

        **특수 규칙:** 샴페인 축제 디너는 **그랜드 스타일 또는 디럭스 스타일**로만 주문 가능합니다.

        --- [웨이터 역할] ---
        1. 손님의 취향을 물어보고 디너와 서빙 스타일을 추천해주세요.
        2. 메뉴와 스타일에 대한 설명이나 어울리는 조합을 추천해주세요. (예: "발렌타인 디너는 디럭스 스타일로 주문하시면 유리잔에 담긴 와인으로 더욱 로맨틱하게 즐기실 수 있습니다!")
        3. 항상 정중하고 활기찬 말투를 사용하세요. (예: "어서오세요!", "탁월한 선택이십니다!")
        4. 주문을 직접 받을 수는 없지만, "장바구니에 담아주세요"라고 안내할 수는 있습니다.
     `
    }
  });
};

/**
 * Sends a message to the chat session.
 */
export const sendChatMessage = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "죄송합니다. 잠시 후 다시 말씀해 주세요.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "오류가 발생했습니다. 다시 시도해 주세요.";
  }
};

/**
 * Generates a new image for a menu item based on admin prompt.
 * Since we can't edit pixels directly easily, we generate a new image based on description + modification.
 */
export const generateMenuImage = async (itemName: string, modificationPrompt: string): Promise<string | null> => {
  if (!isGeminiConfigured()) return null;

  try {
    const prompt = `
      Professional food photography of ${itemName}. 
      ${modificationPrompt}.
      High quality, delicious, restaurant style, isolated, 4k.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

/**
 * Uses Gemini to parse natural language voice commands into structured intents (Korean).
 */
export const parseVoiceCommand = async (
  transcript: string,
  menuItems: MenuItem[]
): Promise<VoiceIntent> => {
  if (!isGeminiConfigured()) {
    return { type: IntentType.UNKNOWN };
  }

  const menuNames = menuItems.map(m => m.name).join(", ");

  const prompt = `
    You are a voice ordering assistant for a Korean restaurant.
    Map the user's spoken command (in Korean or English) to a structured intent.
    
    Available Menu Items: ${menuNames}
    
    Intents:
    - ADD_TO_CART: User wants to order food. Match 'target' to a menu item name fuzzily. Default quantity is 1.
    - NAVIGATE: User wants to go to 'menu' (메뉴), 'cart' (장바구니), 'orders' (주문내역), 'login' (로그인).
    - CHECKOUT: User wants to pay (결제) or checkout.
    - UNKNOWN: Cannot understand or irrelevant.
    
    User said: "${transcript}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { 
              type: Type.STRING, 
              enum: [IntentType.ADD_TO_CART, IntentType.NAVIGATE, IntentType.CHECKout, IntentType.UNKNOWN] 
            },
            target: { type: Type.STRING, nullable: true },
            quantity: { type: Type.NUMBER, nullable: true }
          },
          required: ["type"]
        }
      }
    });

    if (response.text) {
        const result = JSON.parse(response.text);
        return {
            ...result,
            type: result.type as IntentType
        };
    }
    return { type: IntentType.UNKNOWN };

  } catch (error) {
    console.error("Gemini Voice Parsing Error:", error);
    return { type: IntentType.UNKNOWN };
  }
};
