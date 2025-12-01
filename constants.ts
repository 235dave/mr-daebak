import { MenuItem, InventoryItem, User, UserRole } from './types';

export const MOCK_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: '전주 비빔밥',
    description: '신선한 나물과 소고기, 특제 고추장이 어우러진 전통 비빔밥.',
    price: 14.99,
    category: '식사류',
    tags: ['인기', '매콤', '소고기'],
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 'm2',
    name: '소불고기 정식',
    description: '달콤 짭짤한 양념에 재운 부드러운 소고기와 밥, 반찬 세트.',
    price: 18.50,
    category: '고기류',
    tags: ['소고기', '구이', '달콤'],
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 'm3',
    name: '생고기 김치찌개',
    description: '잘 익은 김치와 두툼한 돼지고기를 넣고 푹 끓인 얼큰한 찌개.',
    price: 13.99,
    category: '찌개류',
    tags: ['매콤', '국물', '돼지고기'],
    image: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 'm4',
    name: '잡채',
    description: '당면과 각종 채소, 버섯을 간장 소스에 볶아낸 잔치 음식.',
    price: 12.50,
    category: '면류',
    tags: ['면요리', '채식가능'],
    image: 'https://picsum.photos/400/300?random=4'
  },
  {
    id: 'm5',
    name: '양념 치킨',
    description: '바삭하게 튀긴 닭고기에 매콤달콤한 소스를 버무린 한국식 치킨.',
    price: 19.99,
    category: '치킨',
    tags: ['튀김', '치킨', '안주'],
    image: 'https://picsum.photos/400/300?random=5'
  },
  {
    id: 'm6',
    name: '매운 떡볶이',
    description: '쫄깃한 떡과 어묵을 매운 소스에 끓여낸 대표적인 길거리 간식.',
    price: 10.99,
    category: '분식',
    tags: ['매콤', '쫄깃', '분식'],
    image: 'https://picsum.photos/400/300?random=6'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = MOCK_MENU.map(item => ({
  menuItemId: item.id,
  quantity: 20 // Start with 20 of each
}));

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: '홍길동',
    email: 'hong@example.com',
    role: UserRole.CUSTOMER,
    completedOrders: 9 // One away from coupon
  },
  {
    id: 'u2',
    name: '관리자',
    email: 'admin@daebak.com',
    role: UserRole.STAFF,
    completedOrders: 0
  }
];

export const COUPON_THRESHOLD = 10;
export const LOYALTY_COUPON: import('./types').Coupon = {
  code: 'DAEBAK10',
  discountPercent: 15,
  description: '단골 우대: 15% 할인 쿠폰'
};