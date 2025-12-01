# Mr. Daebak Dinner Service (미스터 대박)

AI 기반의 스마트 한식 주문 플랫폼입니다. 음성 인식 주문, AI 메뉴 추천, 관리자 재고 관리 기능을 제공합니다.

## 📁 프로젝트 구조 (File Structure)

```
/
├── .env                  # 환경 변수 (API Keys, DB URL 등)
├── config/
│   └── index.ts          # 환경 변수 및 전역 설정 관리
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── Layout.tsx        # 앱의 공통 레이아웃 (헤더, 네비게이션)
│   ├── ChatBot.tsx       # Gemini 기반 AI 메뉴 추천 채팅봇
│   ├── VoiceControl.tsx  # 음성 인식 및 주문 제어 컴포넌트
│   └── ...
├── context/              # 전역 상태 관리 (React Context)
│   ├── AuthContext.tsx   # 사용자 인증, 로그인/로그아웃 상태 관리
│   └── DataContext.tsx   # 메뉴, 장바구니, 주문, 재고 데이터 관리
├── pages/                # 라우트별 페이지 컴포넌트
│   ├── LoginPage.tsx     # 로그인 페이지 (시작 화면)
│   ├── MenuPage.tsx      # 메뉴 목록 및 주문 페이지
│   ├── CartPage.tsx      # 장바구니 및 결제 페이지
│   ├── OrdersPage.tsx    # 주문 내역 확인 페이지
│   └── InventoryPage.tsx # 관리자용 재고 관리 및 이미지 생성 페이지
├── services/             # 외부 API 통신 로직
│   └── geminiService.ts  # Google Gemini API 통신 (채팅, 음성 해석, 이미지 생성)
├── App.tsx               # 메인 앱 컴포넌트 및 라우팅 설정 (보호된 라우트 포함)
├── types.ts              # TypeScript 타입 정의
├── constants.ts          # Mock 데이터 및 상수 정의
├── index.tsx             # 진입점 (Entry Point)
└── metadata.json         # 앱 메타데이터 및 권한 설정
```

## 🧩 컴포넌트 역할 및 책임 (Roles & Responsibilities)

### 1. Configuration & Setup
- **`.env`**: 민감한 정보(API Key)와 환경별 설정값을 저장합니다.
- **`config/index.ts`**: `.env` 값을 로드하고 기본값을 설정하여 앱 전체에 설정을 공급합니다.
- **`types.ts`**: `User`, `MenuItem`, `Order` 등 도메인 모델의 타입을 정의하여 일관성을 유지합니다.

### 2. Core Logic & State (Context)
- **`AuthContext`**: 사용자의 로그인 세션을 관리합니다. `localStorage`를 사용하여 새로고침 후에도 로그인을 유지하며, 사용자 권한(Customer vs Staff)을 구분합니다.
- **`DataContext`**: 앱의 핵심 비즈니스 로직을 처리합니다. 메뉴 로딩, 장바구니 추가/삭제, 재고 확인, 주문 생성, 쿠폰 발급 로직을 담당합니다.

### 3. Services
- **`geminiService.ts`**: Google Gemini API와 통신하는 어댑터입니다.
  - **Chat**: 메뉴 추천 봇과의 대화 세션을 관리합니다.
  - **Voice**: STT(Speech-to-Text) 텍스트를 분석하여 사용자의 의도(Intent)를 파악하고 JSON 구조로 변환합니다.
  - **Image**: 관리자 요청 시 메뉴 이미지를 생성/편집합니다.

### 4. UI Components & Pages
- **`App.tsx`**: 라우팅의 중심입니다. `RequireAuth` 컴포넌트를 통해 로그인하지 않은 사용자의 접근을 차단하고 로그인 페이지로 리다이렉트합니다.
- **`LoginPage`**: 앱의 진입점입니다. 데모용 계정 선택 기능을 제공합니다.
- **`MenuPage`**: 상품 목록을 표시하고 장바구니 담기 기능을 제공합니다. AI ChatBot이 포함되어 있습니다.
- **`VoiceControl`**: 화면 하단에 플로팅 버튼으로 존재하며, 전역적으로 음성 명령을 수신하고 처리합니다.
- **`InventoryPage`**: 관리자(Staff) 전용 페이지입니다. 재고 수량을 조절하고 Gemini를 이용해 메뉴 이미지를 AI로 편집할 수 있습니다.

## 🚀 시작하기

1. `.env` 파일에 `API_KEY`를 설정합니다.
2. `npm install` 및 `npm start`로 개발 서버를 실행합니다.
3. 초기 화면에서 로그인 후 서비스를 이용합니다.
