# MTWEY 사이트 분석 및 제작 가이드

분석 대상: https://mtwey.com/  
분석일: 2026-05-26  
분석 범위: 메인, 상품 카테고리, 상품 상세, 로그인, 장바구니, Q&A, FAQ, REVIEW, LOOKBOOK

## 1. 사이트 개요

MTWEY, 명퉤는 액막이 명태와 오행 염주를 중심으로 한 브랜드형 커머스 사이트다. 단순 상품 판매보다 "운", "정화", "오행", "행운", "선물" 같은 상징 가치를 앞세우고 있으며, 현재 사이트는 Cafe24 기반 쇼핑몰에 브랜드 스토리형 메인 페이지와 상품 상세 커머스 기능을 결합한 구조다.

핵심 포지셔닝:

- 브랜드 메시지: Good things stay, Bringing happiness all day
- 핵심 상품군: 액막이 명태, 길운 오행 염주, 부귀 재물 비방
- 주요 구매 동기: 선물, 액막이, 운세/오행 보완, 인테리어 오브제, 심리적 안정
- 판매 방식: 자사몰 구매, 네이버페이, 카카오 선물하기 유도, 회원 전용 할인가

## 2. 현재 사이트 기능 정리

### 2.1 공통 레이아웃

구성 요소:

- 상단 브랜드 로고 영역
- 좌측 또는 상단 쇼핑 메뉴: MTWEY, Bracelet, Bibang
- 커뮤니티 메뉴: Q&A, FAQ, REVIEW, LOOKBOOK
- 고객센터 정보: 전화번호, 운영시간, 점심시간, 휴무일
- 회원 메뉴: Login, Join member, Cart, Order, My Page
- 언어/국가 전환: KR, US
- 검색
- 푸터: 이용약관, 개인정보처리방침, 이용안내, 사업자 정보, 인스타그램 링크
- 월드 배송 선택 모달

개발 포인트:

- Header, Navigation, UtilityMenu, Footer, LanguageSwitcher 컴포넌트로 분리
- 쇼핑 메뉴와 커뮤니티 메뉴를 CMS 또는 관리자에서 수정 가능하도록 구성
- 모바일에서는 메뉴가 과밀해지므로 햄버거 메뉴, 하단 고정 구매 버튼, 접이식 고객센터 정보를 권장

디자인 포인트:

- 현재는 감성적 브랜드 이미지와 커머스 메뉴가 한 화면에 동시에 노출된다.
- 브랜드몰 느낌을 유지하되 구매 전환 버튼은 더 명확하게 보여야 한다.
- 고객센터와 푸터 사업자 정보는 신뢰 요소로 유지하되, 모바일에서는 접이식으로 압축하는 편이 좋다.

### 2.2 메인 페이지

현재 콘텐츠 흐름:

1. 브랜드 슬로건
2. 메인 비주얼
3. SHOP CTA
4. About Us
5. MTWEY 브랜드 스토리
6. 길운 오행 염주 소개
7. 액막이 명태 소개
8. 브랜드 가치 키워드: Hold Back, Energy, Positive Energy
9. SHOP CTA
10. Review 영역
11. Instagram 연결

개발 포인트:

- HeroSection, BrandStorySection, ProductIntroSection, ValueKeywordSection, ReviewPreview, InstagramBanner로 구성
- 이미지와 문구를 관리자에서 교체할 수 있는 콘텐츠 블록 구조 권장
- 주요 CTA는 상품 카테고리 또는 대표 상품 상세로 직접 연결
- 리뷰 영역은 실제 리뷰 데이터를 자동 노출하도록 API 또는 Cafe24 게시판 연동 필요

디자인 포인트:

- 메인 비주얼은 브랜드 감성을 만드는 핵심 자산이므로 고해상도 상품 사진 중심으로 구성
- "오행", "액막이", "행운"의 설명은 추상적이므로 아이콘, 색상 체계, 짧은 카드형 설명으로 보조
- 영문/국문 문구 혼용은 브랜드 감성에는 좋지만, 구매 설득 문구는 국문 중심으로 명확히 정리
- 현재 문구 중 오탈자성 표현은 정리 필요: "stavility", "sences", "Fllow", "offcial" 등

### 2.3 상품 카테고리

현재 카테고리:

- MTWEY: 액막이 명태 10개
- Bracelet: 길운 오행 염주 6개
- Bibang: 부귀 재물 비방 1개

현재 기능:

- 상품 리스트
- 상품명, 썸네일, 가격 노출
- 관심상품 등록
- 정렬: 낮은 가격, 높은 가격, 이름, 신상품, 인기상품
- 조건별 검색
- 상품 비교
- 페이지네이션

개발 포인트:

- ProductList, ProductCard, SortControl, FilterPanel, Pagination 컴포넌트 필요
- 상품 속성: 상품명, 카테고리, 대표 이미지, 판매가, 회원가, 옵션, 재고, 배송비, 태그, 노출 상태
- 상품 비교 기능을 유지할 경우 체크박스 기반 비교 테이블 필요
- 필터는 현재보다 명확하게 구성: 상품 유형, 운 종류, 오행, 가격대, 선물 대상

디자인 포인트:

- 상품 카드에는 "어떤 운을 위한 상품인지"가 즉시 보이게 해야 한다.
- 예: 취업운, 애정운, 건강운, 재물운, 시험운, 귀인운 배지
- 썸네일 이미지 톤을 통일하고, 2열/3열 그리드에서 제품명이 잘리지 않도록 설계
- 가격 위계: 정상가, 판매가, 회원가를 명확히 구분

### 2.4 상품 상세

현재 상품 상세 기능:

- 대표 이미지
- 상품명
- 소비자가, 판매가, 회원 전용 할인가
- 국내/해외 배송 여부
- 배송 방법, 배송비
- 옵션 선택
- 수량 조절
- 총 결제 예정 금액
- 장바구니 담기
- 바로 구매
- 네이버페이 구매
- 찜하기
- 리뷰 보기
- 상세 정보
- 고객 혜택
- 이벤트 안내
- 결제 정보
- 배송 정보
- 교환/반품 정보
- 리뷰 목록
- Q&A 목록
- 재입고 알림 SMS/메일

특이 기능:

- 생년월일, 성별, 양력/음력, 평달/윤달, 출생시간 입력을 통한 부족 오행 조회 기능
- 오행 분포: 목, 화, 토, 금, 수 결과 표시
- 상품 옵션과 오행 추천 구매 흐름이 연결될 수 있는 구조

개발 포인트:

- ProductDetailPage
- ProductGallery
- PriceBox
- OptionSelector
- QuantityStepper
- PurchaseActionBar
- BenefitSection
- ProductContentTabs
- ReviewList
- ProductQnaList
- RestockNotification
- FiveElementCalculator

FiveElementCalculator 개발 설계:

- 입력값: 이름, 성별, 생년월일, 출생시간, 양력/음력, 평달/윤달, 출생시간 모름 여부
- 결과값: 오행별 점수, 부족 오행, 추천 상품 옵션, 안내 문구
- 서버에서 계산 로직을 처리하는 것을 권장한다. 클라이언트에 계산 로직을 모두 노출하면 검증과 유지보수가 어렵다.
- 결과 화면에서 추천 옵션을 바로 선택하거나 해당 오행 상품으로 이동할 수 있게 연결
- 민감한 개인정보가 아니더라도 생년월일을 입력받으므로 개인정보 안내, 저장 여부, 미저장 고지가 필요

디자인 포인트:

- 상품 상세 상단은 "상품 이미지 55%, 구매 정보 45%" 정도의 2단 레이아웃 권장
- 모바일에서는 대표 이미지, 가격, 옵션, 구매 버튼 순서로 단순화
- 오행 조회 기능은 상품 구매 전에 배치하되, 너무 길면 구매 정보가 밀리므로 접이식 또는 별도 추천 박스 형태 권장
- 구매 버튼은 Add to Cart보다 "장바구니", "바로 구매"처럼 국문 중심으로 정리
- 리뷰와 Q&A는 구매 설득에 중요하므로 평점, 사진 리뷰, 최신 문의 답변 상태를 더 잘 보여줘야 한다.

### 2.5 회원/로그인

현재 기능:

- 일반 회원 로그인
- 네이버, Facebook, Google, Kakao, LINE, Apple 로그인
- 아이디 찾기
- 비밀번호 찾기
- 회원가입
- 비회원 구매

개발 포인트:

- Cafe24 사용 시 기본 회원/소셜 로그인 모듈 활용
- 자체 개발 시 OAuth 연동 필요: Kakao, Naver, Google, Apple 우선
- 비회원 주문 조회 기능과 주문 비밀번호 정책 필요
- 회원 전용 할인가가 있으므로 회원 혜택 안내와 가입 전환 UI 필요

디자인 포인트:

- 로그인 화면은 브랜드 감성보다 전환이 우선이다.
- 소셜 로그인 버튼은 플랫폼별 공식 색상과 아이콘 사용
- "회원가 35,900원 적용" 같은 혜택 문구를 로그인/회원가입 CTA 근처에 배치

### 2.6 장바구니/주문

현재 장바구니 기능:

- 국내배송상품/해외배송상품 탭
- 장바구니 보관 기간 안내
- 전체상품주문
- 선택상품주문
- 관심상품 목록
- 옵션 변경
- 이용안내

개발 포인트:

- CartItem, CartSummary, ShippingGroupTabs, WishlistPreview, OptionChangeModal 필요
- 국내/해외 배송 상품은 별도 결제 제한 로직 필요
- 주문서에서는 배송지, 쿠폰, 적립금, 결제수단, 현금영수증, 개인정보 동의 처리 필요
- 네이버페이와 일반 PG 결제 분기 처리 필요

디자인 포인트:

- 비어 있는 장바구니에는 추천 상품 CTA를 노출
- 모바일에서는 주문 요약과 결제 버튼을 하단 고정으로 제공
- 배송비 무료, 회원가, 쿠폰가를 결제 전 요약 영역에서 명확히 표시

### 2.7 커뮤니티

현재 메뉴:

- Q&A
- FAQ
- REVIEW
- LOOKBOOK

Q&A 현재 기능:

- 문의 목록
- 비밀글
- 답변 표시
- 카테고리: 배송 관련 문의, 상품 관련 문의
- 작성자 마스킹
- 작성일, 조회수, 추천, 평점

FAQ 현재 상태:

- 게시글 없음
- 검색
- 글쓰기

REVIEW 현재 기능:

- 리뷰 목록
- 상품 이미지
- 제목
- 작성자 마스킹
- 작성일
- 조회수
- 평점

LOOKBOOK 현재 기능:

- 룩북 상세 게시글
- 이미지 중심 콘텐츠
- 작성일, 조회수
- 목록, 수정, 삭제, 답변, 댓글

개발 포인트:

- BoardList, BoardDetail, BoardSearch, BoardWriteForm, CommentForm, SecretPostAuth 필요
- 리뷰는 상품 상세와 전체 리뷰 게시판 양쪽에서 재사용
- FAQ는 운영 콘텐츠가 비어 있으므로 배송, 교환/반품, 오행 조회, 상품 관리법, 선물 포장, 해외배송 항목을 먼저 채워야 한다.

디자인 포인트:

- 커뮤니티는 표 형태보다 카드형 또는 리스트형으로 가독성을 개선
- Q&A 답변 완료 여부를 뱃지로 표시
- 리뷰는 사진 리뷰와 평점을 우선 노출
- LOOKBOOK은 브랜드 감성 채널이므로 큰 이미지, 짧은 설명, 관련 상품 연결이 필요

### 2.8 글로벌/언어

현재 기능:

- KR 사이트
- US 사이트 연결: https://mtweyglobal.com/
- 월드 배송 국가/언어 선택 모달

개발 포인트:

- 단일 코드베이스 다국어 또는 별도 글로벌몰 중 선택
- 상품명, 상세 이미지, 배송 정책, 통화, 결제수단, 약관이 국가별로 분리되어야 한다.
- hreflang, canonical, Open Graph를 국가별로 정리

디자인 포인트:

- 언어 전환은 KR/US 텍스트만으로는 눈에 잘 띄지 않는다.
- 통화, 배송 가능 국가, 언어 선택을 한 묶음으로 보여주는 것이 좋다.

### 2.9 마케팅/외부 연동

확인된 연동 요소:

- Cafe24
- 네이버페이
- 네이버 로그/검증
- Facebook Pixel
- Kakao SDK
- Snapfit 푸시/챗봇
- Alpha Review
- Smart Popup
- Swiper
- Instagram 외부 링크

개발 포인트:

- 태그 매니저 또는 스크립트 관리 정책 필요
- 장바구니, 구매, 상품 조회, 회원가입 이벤트를 GA4, Meta Pixel, Naver, Kakao에 일관되게 전송
- 외부 스크립트가 많으면 초기 로딩 속도가 느려지므로 지연 로딩과 중요도 분리 필요

디자인 포인트:

- 팝업, 챗봇, 푸시 배너는 구매 CTA를 가리지 않게 위치 조정
- 모바일에서 외부 위젯이 하단 구매 버튼과 겹치지 않도록 안전 영역 확보

## 3. 추천 정보 구조

권장 IA:

- Home
- Shop
  - 액막이 명태
  - 길운 오행 염주
  - 비방
  - 선물 추천
- Five Balance Test
  - 부족 오행 조회
  - 오행별 추천 상품
- Brand
  - About MTWEY
  - Story
  - Lookbook
- Review
- Community
  - Notice
  - FAQ
  - Q&A
- My
  - 로그인
  - 주문조회
  - 마이페이지
  - 장바구니

## 4. 개발 방식 제안

### 4.1 Cafe24 유지형

적합한 경우:

- 빠르게 쇼핑몰을 운영해야 하는 경우
- PG, 네이버페이, 회원, 주문, 배송, 게시판을 기본 기능으로 처리하고 싶은 경우
- 운영자가 Cafe24 관리자에 익숙한 경우

개발 방식:

- Cafe24 스킨 커스터마이징
- 상품 상세 템플릿 개선
- 메인 콘텐츠 블록화
- 오행 조회 기능은 외부 API 또는 Cafe24 앱/스크립트로 추가
- 리뷰, 팝업, 마케팅 스크립트 정리

장점:

- 결제/주문/배송 안정성 확보
- 운영 진입장벽 낮음
- 개발 기간 단축

주의점:

- 자유로운 UI/UX 구현에 제한
- 외부 스크립트 누적으로 성능 저하 가능
- 커스텀 기능의 유지보수 난이도 상승

### 4.2 헤드리스 커머스형

적합한 경우:

- 브랜드 경험과 성능을 크게 개선하려는 경우
- 오행 추천, 선물 추천, 개인화 기능을 핵심 기능으로 키우려는 경우
- 글로벌몰 확장 계획이 있는 경우

기술 스택 예시:

- Frontend: Next.js, React, TypeScript
- Styling: Tailwind CSS 또는 CSS Modules
- Commerce: Cafe24 API, Shopify, Medusa, 또는 자체 커머스 API
- Backend: NestJS 또는 Next.js API Routes
- DB: PostgreSQL
- Cache/Search: Redis, Meilisearch 또는 Elasticsearch
- Image: CDN, WebP/AVIF 변환
- Payment: KG이니시스, 토스페이먼츠, 네이버페이, 카카오페이
- Analytics: GA4, Meta Pixel, Naver Analytics

장점:

- 브랜드 경험과 성능 최적화에 유리
- 추천/진단/콘텐츠 확장에 강함
- 글로벌 확장과 SEO 제어가 쉬움

주의점:

- 주문/재고/배송/정산 운영 개발 범위가 커짐
- 초기 구축 비용과 QA 범위가 증가
- 운영 관리자 기능까지 별도로 고려해야 함

## 5. 핵심 데이터 모델

Product:

- id
- name
- slug
- category
- shortDescription
- description
- price
- salePrice
- memberPrice
- images
- options
- stock
- shippingType
- tags
- luckType
- elementType
- status

ProductOption:

- id
- productId
- name
- values
- priceDelta
- stock

FiveElementResult:

- id
- gender
- calendarType
- birthDate
- birthTime
- isBirthTimeUnknown
- scores: wood, fire, earth, metal, water
- deficientElements
- recommendedProducts
- createdAt

Review:

- id
- productId
- memberId
- rating
- title
- content
- images
- isVisible
- createdAt

Qna:

- id
- productId
- category
- title
- content
- isSecret
- writerName
- status
- answer
- createdAt

Order:

- id
- memberId
- orderItems
- shippingAddress
- paymentMethod
- paymentStatus
- orderStatus
- totalAmount
- createdAt

## 6. 디자인 방향

### 6.1 브랜드 톤

추천 키워드:

- 신비로움
- 정화
- 행운
- 한국적 상징
- 선물
- 안정감
- 고급스러운 생활 오브제

표현 방식:

- 과도한 무속적 표현보다 현대적이고 차분한 "운의 균형" 이미지로 정리
- 실제 상품의 재질, 크기, 패키지, 사용 장면을 충분히 보여주기
- 오행 색상은 포인트로 쓰되 전체 화면을 단일 색조로 만들지 않기

### 6.2 컬러

권장 팔레트:

- Base: Warm White, Soft Charcoal
- Accent: Jade Green, Vermilion Red, Deep Blue, Gold, Stone Gray
- Product Mapping:
  - 목: Green
  - 화: Red
  - 토: Yellow Ochre
  - 금: White/Gold
  - 수: Blue/Black

주의:

- 베이지/브라운 위주로만 가면 흔한 전통 굿즈몰처럼 보일 수 있다.
- 오행 컬러는 상품 추천, 뱃지, 결과 그래프, 옵션 선택에 기능적으로 사용한다.

### 6.3 타이포그래피

권장:

- 국문: Pretendard 또는 Noto Sans KR
- 영문: Poppins 또는 Montserrat
- 브랜드 헤드라인: 넓은 자간보다 안정적인 행간과 여백 중심

주의:

- 영문 감성 문구는 짧게 유지
- 구매/배송/혜택/옵션 문구는 명확한 국문 우선

### 6.4 화면별 디자인

메인:

- 첫 화면에 브랜드명, 대표 상품, 핵심 CTA를 동시에 노출
- "오행 조회하기"를 보조 CTA로 배치하면 차별점이 강해진다.
- 긴 브랜드 설명은 스크롤형 섹션으로 분산

상품 목록:

- 상품 썸네일 통일
- 운 유형 뱃지
- 회원가/판매가 분리
- 빠른 장바구니 또는 상세보기 CTA

상품 상세:

- 상단 구매 정보는 간결하게
- 오행 조회 결과와 옵션 추천 연결
- 상세 이미지는 스토리, 사용법, 패키지, 후기 순으로 설계
- 모바일 하단 고정 구매 바 적용

리뷰:

- 평점 평균, 리뷰 수, 사진 리뷰 필터
- 상품별 리뷰와 전체 리뷰 연결
- 구매 전환을 위해 베스트 리뷰를 상세 상단 근처에 일부 노출

FAQ/Q&A:

- FAQ는 아코디언 UI
- Q&A는 답변상태, 비밀글, 문의 유형 필터 제공

## 7. 개선 우선순위

1순위:

- 메인 CTA 명확화
- 상품 상세 구매 영역 정리
- 모바일 구매 버튼 고정
- FAQ 콘텐츠 작성
- 오탈자 수정

2순위:

- 오행 조회 기능을 구매 추천과 연결
- 리뷰 노출 강화
- 상품 목록 필터 개선
- 상품별 운 유형 뱃지 추가
- 이미지 최적화

3순위:

- 글로벌몰 구조 정리
- 헤드리스 전환 검토
- 개인화 추천
- 선물 추천 플로우
- CRM/리마케팅 자동화

## 8. 제작 일정 예시

Cafe24 개선형:

- 1주차: IA/기획 정리, 디자인 시스템, 메인/상품 상세 와이어프레임
- 2주차: Cafe24 스킨 수정, 상품 목록/상세 UI 개선
- 3주차: 오행 조회 UI 개선, FAQ/리뷰/Q&A 정리
- 4주차: 모바일 QA, 결제/주문 테스트, 속도 최적화, 오픈

헤드리스 신규 구축형:

- 1-2주차: 요구사항 정의, 데이터 모델, 디자인 시스템
- 3-5주차: 프론트엔드 주요 화면 개발
- 6-8주차: 커머스/회원/주문/결제/API 개발
- 9주차: 관리자/콘텐츠 관리
- 10주차: QA, 성능 최적화, SEO, 배포

## 9. 결론

MTWEY 사이트는 일반 쇼핑몰보다 "오행 조회와 행운 추천"이라는 차별화 포인트가 강하다. 따라서 개발과 디자인의 중심은 단순 상품 나열이 아니라 "나에게 부족한 오행을 찾고, 그 결과에 맞는 상품을 자연스럽게 구매하는 흐름"이어야 한다.

현재 Cafe24 기반 기능은 커머스 운영에 필요한 기본기를 이미 갖추고 있다. 단기적으로는 Cafe24 스킨 개선과 콘텐츠 정리가 효율적이며, 장기적으로는 오행 추천, 글로벌몰, 선물 추천, 리뷰 콘텐츠를 강화하는 방향으로 확장하는 것이 좋다.

## 10. 참고 URL

- 메인: https://mtwey.com/
- MTWEY 카테고리: https://mtwey.com/category/mtwey/42/
- Bracelet 카테고리: https://mtwey.com/category/bracelet/44/
- Bibang 카테고리: https://mtwey.com/category/bibang/45/
- 상품 상세 예시: https://mtwey.com/product/%EA%B8%B8%EC%9A%B4-%EC%98%A4%ED%96%89-%EC%97%BC%EC%A3%BC-%EC%A0%84%EC%B2%B4-%EC%98%A4%ED%96%89/42/category/44/display/1/
- Q&A: https://mtwey.com/board/qa/6/
- REVIEW: https://mtwey.com/board/review/4/
- FAQ: https://mtwey.com/board/faq/3/
- LOOKBOOK: https://mtwey.com/board/lookbook/read.html?board_no=1002&no=3
