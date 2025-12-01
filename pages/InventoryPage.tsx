import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Minus, Plus, AlertTriangle, Wand2, X, Loader2 } from 'lucide-react';
import { generateMenuImage } from '../services/geminiService';

const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const { menu, inventory, updateInventory, updateMenuItemImage } = useData();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user || user.role !== UserRole.STAFF) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center p-8 bg-red-50 rounded-xl text-red-800">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">접근 권한 없음</h2>
          <p>이 페이지를 볼 수 있는 권한이 없습니다.</p>
        </div>
      </div>
    );
  }

  const handleGenerateImage = async (itemId: string, itemName: string) => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const newImageUrl = await generateMenuImage(itemName, prompt);
    if (newImageUrl) {
      updateMenuItemImage(itemId, newImageUrl);
      setEditingItem(null);
      setPrompt('');
    } else {
      alert("이미지 생성에 실패했습니다.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">재고 관리 (관리자)</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="p-4 font-semibold text-stone-600">상품명</th>
              <th className="p-4 font-semibold text-stone-600">이미지</th>
              <th className="p-4 font-semibold text-stone-600">카테고리</th>
              <th className="p-4 font-semibold text-stone-600 text-center">재고 수량</th>
              <th className="p-4 font-semibold text-stone-600 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {menu.map((menuItem) => {
              const stock = inventory.find(i => i.menuItemId === menuItem.id);
              const quantity = stock?.quantity || 0;
              
              return (
                <tr key={menuItem.id} className="hover:bg-stone-50">
                  <td className="p-4 font-medium text-stone-900">{menuItem.name}</td>
                  <td className="p-4">
                    <div className="relative w-16 h-12 group cursor-pointer" onClick={() => setEditingItem(menuItem.id)}>
                        <img src={menuItem.image} alt={menuItem.name} className="w-full h-full object-cover rounded shadow-sm" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                            <Wand2 className="w-4 h-4 text-white" />
                        </div>
                    </div>
                  </td>
                  <td className="p-4 text-stone-500">{menuItem.category}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                      quantity === 0 ? 'bg-red-100 text-red-700' :
                      quantity < 10 ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {quantity}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => updateInventory(menuItem.id, -1)}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-600"
                        title="재고 감소"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => updateInventory(menuItem.id, 1)}
                         className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-600"
                         title="재고 증가"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Image Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">AI 음식 사진 편집</h3>
                <button onClick={() => setEditingItem(null)} className="text-stone-400 hover:text-stone-900">
                    <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="mb-4">
                 <img 
                    src={menu.find(m => m.id === editingItem)?.image} 
                    alt="Current" 
                    className="w-full h-48 object-cover rounded-lg mb-2"
                 />
                 <p className="text-xs text-stone-500">
                    {menu.find(m => m.id === editingItem)?.name} 사진을 어떻게 바꿀까요?
                 </p>
             </div>

             <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 더 매콤해 보이게 만들어줘, 김이 모락모락 나게 해줘, 접시를 고급스럽게 바꿔줘"
                    className="w-full p-3 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none h-24 resize-none"
                />
                
                <button
                    onClick={() => handleGenerateImage(editingItem, menu.find(m => m.id === editingItem)?.name || '')}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            생성 중...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-4 h-4" />
                            새로운 이미지 생성
                        </>
                    )}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;