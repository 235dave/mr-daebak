import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { OrderStatus } from '../types';

const OrdersPage: React.FC = () => {
  const { getUserOrders } = useData();
  const { user } = useAuth();
  const orders = getUserOrders();

  if (!user) return <div className="p-8 text-center">주문 내역을 보시려면 로그인이 필요합니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-stone-900 mb-2">주문 내역</h1>
      <p className="text-stone-500 mb-8">{user.name}님의 이전 주문 목록입니다.</p>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl">
          <Package className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <p className="text-stone-500">주문 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-stone-100">
                <div>
                  <span className="font-mono text-xs text-stone-400 uppercase">주문번호</span>
                  <h3 className="font-bold text-stone-900">{order.id}</h3>
                  <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleString('ko-KR')}</p>
                </div>
                <div className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2
                  ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' :
                    order.status === OrderStatus.PREPARING ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'}`}>
                  {order.status === OrderStatus.DELIVERED && <CheckCircle className="w-4 h-4" />}
                  {order.status === OrderStatus.PREPARING && <Clock className="w-4 h-4" />}
                  {
                    order.status === OrderStatus.CREATED ? '접수됨' :
                    order.status === OrderStatus.PREPARING ? '조리중' : '배달완료'
                  }
                </div>
              </div>
              
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-stone-700">{item.menuItem.name} x {item.quantity}</span>
                    <span className="text-stone-500">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-stone-100 flex justify-end">
                <span className="font-bold text-lg text-stone-900">총계: ${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;