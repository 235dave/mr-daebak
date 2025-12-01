
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MenuItem } from '../types';
import { Plus, Image as ImageIcon, Edit2, Trash2, X, Wand2, Loader2, Save } from 'lucide-react';
import { generateMenuImage } from '../services/geminiService';

const MenuManagementPage: React.FC = () => {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem } = useData();
  
  // State for Form
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    category: '식사류',
    image: 'https://picsum.photos/400/300',
    tags: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  // State for AI Image Gen
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditId(null);
    setShowPromptInput(false);
    setPrompt('');
  };

  const handleEditClick = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      tags: item.tags.join(', ')
    });
    setEditId(item.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('정말 이 메뉴를 삭제하시겠습니까?')) {
      await deleteMenuItem(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const data = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (isEditing && editId) {
      await updateMenuItem(editId, data);
      alert('메뉴가 수정되었습니다.');
    } else {
      await addMenuItem(data);
      alert('메뉴가 추가되었습니다.');
    }
    resetForm();
  };

  const handleGenerateImage = async () => {
    if (!formData.name) {
      alert("이미지를 생성하려면 먼저 메뉴 이름을 입력해주세요.");
      return;
    }
    if (!prompt.trim()) {
        alert("이미지 생성 프롬프트를 입력해주세요.");
        return;
    }

    setIsGenerating(true);
    const newImageUrl = await generateMenuImage(formData.name, prompt);
    if (newImageUrl) {
      setFormData({ ...formData, image: newImageUrl });
      setShowPromptInput(false);
      setPrompt('');
    } else {
      alert("이미지 생성에 실패했습니다.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-stone-900">메뉴 관리</h1>
         {isEditing && (
            <button onClick={resetForm} className="text-stone-500 hover:text-stone-800 flex items-center gap-1">
                <X className="w-4 h-4" /> 취소하고 추가 모드로
            </button>
         )}
      </div>
      
      {/* 1. Editor Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            {isEditing ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
            {isEditing ? '메뉴 수정' : '새 메뉴 추가'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">메뉴 이름</label>
                    <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-stone-800 outline-none"
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">카테고리</label>
                    <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-stone-800 outline-none"
                    >
                    <option>식사류</option>
                    <option>고기류</option>
                    <option>찌개류</option>
                    <option>면류</option>
                    <option>치킨</option>
                    <option>분식</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">가격 ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-stone-800 outline-none"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">이미지</label>
                    <div className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                             <input
                                type="text"
                                value={formData.image}
                                onChange={e => setFormData({...formData, image: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-stone-800 outline-none text-xs"
                                placeholder="Image URL..."
                            />
                            {/* AI Gen Button */}
                            <button 
                                type="button"
                                onClick={() => setShowPromptInput(!showPromptInput)}
                                className="text-xs flex items-center gap-1 text-amber-600 font-bold hover:underline"
                            >
                                <Wand2 className="w-3 h-3" /> AI로 이미지 생성/변경하기
                            </button>
                            
                            {/* AI Prompt Input */}
                            {showPromptInput && (
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 animate-in fade-in slide-in-from-top-2">
                                    <textarea 
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="예: 더 먹음직스럽게, 김이 모락모락 나게, 배경을 고급스럽게"
                                        className="w-full p-2 text-sm border border-amber-200 rounded mb-2 h-20 resize-none outline-none focus:border-amber-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGenerateImage}
                                        disabled={isGenerating}
                                        className="w-full py-1.5 bg-amber-500 text-white text-xs font-bold rounded hover:bg-amber-600 flex items-center justify-center gap-1"
                                    >
                                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                        생성하기
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="w-24 h-24 bg-stone-100 rounded-lg border border-stone-200 overflow-hidden flex-shrink-0">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">설명</label>
                    <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-stone-800 outline-none"
                    rows={2}
                    />
                </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              placeholder="매콤, 인기, 추천"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-stone-800 outline-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isEditing ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? '메뉴 수정 완료' : '메뉴 추가하기'}
          </button>
        </form>
      </div>

      {/* 2. Menu List */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <h2 className="text-lg font-bold p-6 border-b border-stone-100">현재 메뉴 목록 ({menu.length})</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-stone-50 text-stone-600 text-sm">
                <tr>
                <th className="p-4">이미지</th>
                <th className="p-4">이름</th>
                <th className="p-4">카테고리</th>
                <th className="p-4">가격</th>
                <th className="p-4 text-right">관리</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
                {menu.map(item => (
                <tr key={item.id} className="hover:bg-stone-50">
                    <td className="p-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded bg-stone-100" />
                    </td>
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4 text-sm text-stone-500">{item.category}</td>
                    <td className="p-4 font-medium">${item.price}</td>
                    <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => handleEditClick(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDeleteClick(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default MenuManagementPage;
