import React from 'react';
import { useData } from '../context/DataContext';
import { Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LOYALTY_COUPON } from '../constants';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, placeOrder, clearCart, couponAvailable } = useData();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const discount = couponAvailable ? subtotal * (LOYALTY_COUPON.discountPercent / 100) : 0;
  const total = subtotal - discount;

  const handleCheckout = async () => {
    await placeOrder();
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">장바구니가 비었습니다</h2>
        <p className="text-stone-500 mb-8">맛있는 음식을 담아보세요!</p>
        <Link to="/" className="inline-block bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
          메뉴 보러가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">주문 내역</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div key={item.menuItem.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-100">
              <img src={item.menuItem.image} alt={item.menuItem.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-stone-900">{item.menuItem.name}</h3>
                <p className="text-sm text-stone-500">${item.menuItem.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-stone-700">{item.quantity}개</span>
                <button 
                  onClick={() => removeFromCart(item.menuItem.id)}
                  className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-red-500 hover:underline">장바구니 비우기</button>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 sticky top-24">
            <h3 className="font-bold text-lg mb-4">결제 정보</h3>
            
            <div className="space-y-2 mb-4 border-b border-stone-100 pb-4">
              <div className="flex justify-between text-stone-600">
                <span>주문 금액</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {couponAvailable && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">쿠폰 ({LOYALTY_COUPON.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between font-bold text-xl text-stone-900 mb-6">
              <span>총 결제금액</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3 rounded-lg font-semibold hover:bg-stone-800 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;