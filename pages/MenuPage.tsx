import React from 'react';
import { useData } from '../context/DataContext';
import { PlusCircle } from 'lucide-react';
import ChatBot from '../components/ChatBot';

const MenuPage: React.FC = () => {
  const { menu, addToCart, inventory } = useData();

  const getStock = (id: string) => inventory.find(i => i.menuItemId === id)?.quantity || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-stone-900 mb-6">메뉴</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menu.map((item) => {
              const stock = getStock(item.id);
              return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-100 hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden relative group">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold px-4 py-1 border-2 border-white rounded">품절 (SOLD OUT)</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-stone-900">{item.name}</h3>
                      <span className="font-semibold text-amber-600">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-stone-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                       <span className="text-xs text-stone-400">
                         {stock > 0 ? `재고: ${stock}개` : '재고 없음'}
                       </span>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={stock === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          stock > 0 
                            ? 'bg-stone-900 text-white hover:bg-stone-700' 
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <PlusCircle className="w-4 h-4" />
                        담기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default MenuPage;