import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { parseVoiceCommand } from '../services/geminiService';
import { IntentType } from '../types';
import { useNavigate } from 'react-router-dom';

const VoiceControl: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { menu, addToCart } = useData();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ko-KR'; // Default to Korean

      recognitionRef.current.onstart = () => setIsListening(true);
      
      recognitionRef.current.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        await handleVoiceCommand(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [menu]);

  const handleVoiceCommand = async (text: string) => {
    setIsProcessing(true);
    try {
      const intent = await parseVoiceCommand(text, menu);
      console.log("Parsed Intent:", intent);

      switch (intent.type) {
        case IntentType.ADD_TO_CART:
          if (intent.target) {
            // Simple fuzzy match simulation
            const item = menu.find(m => m.name.toLowerCase().includes(intent.target!.toLowerCase()));
            if (item) {
              const res = addToCart(item, intent.quantity || 1);
              alert(res.message); // Visual feedback
            } else {
              alert(`'${intent.target}' 메뉴를 찾을 수 없습니다.`);
            }
          }
          break;
        case IntentType.NAVIGATE:
          if (intent.target?.includes('cart') || intent.target?.includes('장바구니')) navigate('/cart');
          else if (intent.target?.includes('menu') || intent.target?.includes('메뉴')) navigate('/');
          else if (intent.target?.includes('orders') || intent.target?.includes('주문')) navigate('/orders');
          else if (intent.target?.includes('login') || intent.target?.includes('로그인')) navigate('/login');
          break;
        case IntentType.CHECKout:
          navigate('/cart');
          break;
        case IntentType.UNKNOWN:
        default:
          console.warn("Unknown intent");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  if (!recognitionRef.current) return null; // Not supported

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {transcript && (
        <div className="bg-stone-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm mb-2 max-w-xs">
          "{transcript}"
        </div>
      )}
      
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full shadow-xl transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse-ring' 
            : isProcessing 
              ? 'bg-amber-400 text-stone-900'
              : 'bg-stone-900 text-white hover:bg-stone-800'
        }`}
        title="음성 명령"
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isListening ? (
          <Mic className="w-6 h-6" />
        ) : (
          <MicOff className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default VoiceControl;