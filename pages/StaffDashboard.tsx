
import React from 'react';
import { useData } from '../context/DataContext';
import { OrderStatus } from '../types';
import { Clock, CheckCircle, ChefHat } from 'lucide-react';

const StaffDashboard: React.FC = () => {
  const { getAllOrders, updateOrderStatus } = useData();
  const orders = getAllOrders();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED: return 'bg-amber-100 text-amber-800 border-amber-200';
      case OrderStatus.PREPARING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        <ChefHat className="w-8 h-8 text-stone-700" />
        주문 현황 대시보드
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
            <div className={`px-6 py-4 border-b flex justify-between items-center ${getStatusColor(order.status)}`}>
              <div>
                <span className="font-bold text-lg">#{order.id.slice(-5)}</span>
                <div className="text-xs opacity-80">{new Date(order.createdAt).toLocaleString('ko-KR')}</div>
              </div>
              <div className="font-bold px-2 py-1 bg-white/50 rounded text-xs">{order.status}</div>
            </div>

            <div className="p-6 flex-1">
              <div className="mb-4">
                <span className="text-xs font-bold text-stone-400 uppercase">고객명</span>
                <p className="font-semibold text-stone-800">{order.userName}</p>
              </div>

              <div className="space-y-2 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-stone-700">{item.menuItem.name} <span className="text-stone-400">x{item.quantity}</span></span>
                    <span className="font-medium">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end border-t border-stone-100 pt-2 mb-4">
                 <span className="font-bold text-lg">Total: ${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 grid grid-cols-2 gap-2">
               {order.status === OrderStatus.CREATED && (
                 <button 
                   onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                   className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                 >
                   <ChefHat className="w-4 h-4" /> 조리 시작
                 </button>
               )}
               {order.status === OrderStatus.PREPARING && (
                 <button 
                   onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                   className="col-span-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                 >
                   <CheckCircle className="w-4 h-4" /> 배달 완료
                 </button>
               )}
               {order.status === OrderStatus.DELIVERED && (
                 <div className="col-span-2 text-center text-stone-400 text-sm py-2">
                   완료된 주문입니다
                 </div>
               )}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-stone-300">
            <Clock className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">현재 대기 중인 주문이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
