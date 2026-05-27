# Sajustone 개발 계획 정리본 for Claude

이 문서는 기존 `plan.md`에 누적된 작업 계획을 중복 제거하고, 현재 구현 상태 기준으로 재구성한 인수인계용 문서입니다. 시간순 기록이 아니라 기능/구조/운영 관점으로 정리합니다.

## 1. 프로젝트 개요

Sajustone은 사용자가 이름, 성별, 생년월일, 출생시간, 양력/음력 여부를 입력하면 사주 4주와 오행 분포를 계산하고, 한국천문연구원 음양력 API를 활용해 공식 날짜/일진 정보를 보정한 뒤 상세 사주 리포트와 천연석 추천을 제공하는 정적 웹앱입니다.

주요 화면은 `saju-five-elements/index.html`이며, Vercel 배포 시 루트(`/`)는 `saju-five-elements/`로 이동하도록 구성되어 있습니다.

## 2. 현재 핵심 기능

### 입력 기능

- 이름 입력
- 성별 선택: 남자/여자
- 달력 선택: 양력/음력
- 음력 선택 시 윤달 여부 체크
- 생년월일 입력
- 출생시간 입력 또는 `출생시간을 모릅니다` 선택
- 샘플 입력 버튼

### 사주 계산 기능

- 년주, 월주, 일주, 시주 계산
- 출생시간 미입력 시 시주 제외
- 천간/지지의 대표 오행을 기준으로 오행 점수 계산
- 부족 오행 도출
- 한국천문연구원 공식 `lunIljin`을 파싱할 수 있으면 일주 계산에 우선 반영

### 음양력 API 기능

- `api/lunar.js`: Vercel 서버리스 API
- `saju-five-elements/dev-server.mjs`: 로컬 개발 서버용 동일 API 라우트
- 양력 입력 시 `getLunCalInfo` 호출
- 음력 입력 시 `getSolCalInfo` 호출 후 양력 날짜로 변환하여 계산
- 음력 윤달/평달 후보가 여러 개일 경우 사용자가 선택한 윤달 여부를 우선 적용
- API 실패 시 양력 입력은 기존 계산으로 fallback
- 음력 입력은 변환 실패 시 잘못된 날짜 계산을 중단하고 안내

### 결과 표시 기능

- 사주 4주 카드
- 공식 음양력 정보 카드
  - 입력 달력
  - 양력 기준일
  - 음력 날짜
  - 평달/윤달
  - 양력 윤년
  - 세차
  - 월건
  - 일진
  - 율리우스 적일
  - 계산 보정 여부
- 오행 분포 그래프
- 부족 오행 안내
- 올해 운세 카드
- 상세 만세력 리포트
- 사주 상세 해설
- 천연석 추천 섹션

## 3. 상세 만세력 리포트 구조

현재 상세 리포트는 `ex.md` 예시를 참고해 표 중심으로 구성되어 있습니다.

### 리포트 상단 요약 카드

- 일주
- 시주
- 강한 오행
- 보완 오행
- 대운 방향
- 올해 세운

### 표 섹션

- 사주 4주
- 오행 분포
- 심층 분석: 십성 & 12운성
- 대운
- 세운
- 월운
- 천간 특수관계
- 지지 형·충·회·합 해석
- 종합 신살

### 가독성 개선 기준

- 표는 compact 스타일 적용
- 표 컨테이너는 모바일에서 가로 스크롤 가능
- 표 첫 열은 sticky 처리
- 표 제목 옆에 행 수 배지 표시
- 긴 원석 추천은 리포트 내부에서 제거하고 하단 추천 섹션으로 분리

## 4. 천연석 추천 기능

### 추천 기준

- 목(木): 성장, 시작, 기획, 회복을 상징하는 초록 계열 천연석
- 화(火): 표현, 열정, 활력, 자신감을 상징하는 붉은 계열 천연석
- 토(土): 안정, 균형, 현실감, 신뢰를 상징하는 노랑/갈색 계열 천연석
- 금(金): 정리, 결단, 집중, 보호를 상징하는 흰색/금속성 계열 천연석
- 수(水): 지혜, 유연함, 감정 정화, 휴식을 상징하는 파랑/검정 계열 천연석

### 이미지 구성

- 원석 이미지: `saju-five-elements/assets/stone-gallery/`
- 팔찌 이미지: `saju-five-elements/assets/bracelet-gallery/`
- 메인 오행 그래픽: `saju-five-elements/assets/sajumain.png`

### 표시 방식

- 천연석 추천은 결과 화면 하단에 배치
- 원석 이미지와 팔찌 이미지를 상단에 표시
- 이름과 설명은 이미지 아래에 표시
- 원석/팔찌 이미지를 클릭하면 새 탭으로 구매 페이지 이동
- 모든 구매 링크는 지정된 네이버 스마트스토어 상품 URL로 통일

### 주의 사항

천연석 설명은 의학적/과학적 효능 보장이 아니라 오행 상징과 브랜드 경험을 연결하는 콘텐츠입니다. 문구는 참고형으로 유지해야 합니다.

## 5. 원석 전체 보기 페이지

`stones.html`은 사주를 입력하지 않아도 전체 원석 이미지를 볼 수 있는 갤러리 페이지입니다.

### 기능

- 메인 페이지의 `원석 전체 보기` 링크에서 이동
- 목/화/토/금/수 오행별 원석 이미지 확인
- 원석 이미지와 팔찌 이미지 함께 표시
- 사주 계산기로 돌아가기 링크 제공

## 6. 디자인/UX 기준

### 전체 톤

- 부드럽고 편안한 한글 UI 폰트 사용
- 과하게 단단한 인상을 줄이고 차분한 상담형 분위기 유지
- 상품 이미지와 사주 콘텐츠가 어울리도록 밝은 카드형 UI 사용

### 메인 그래픽

- 기존 평면 오행 그래픽 대신 `sajumain.png` 입체형 오행 원판 이미지 사용
- 메인 첫 화면에서 서비스의 상징이 바로 보이도록 유지

### 결과 화면 순서

현재 결과 화면 흐름은 다음 순서가 기준입니다.

1. 사주 4주
2. 공식 음양력 정보
3. 오행 분포
4. 부족 오행
5. 올해 운세
6. 상세 만세력 리포트
7. 사주 상세 해설
8. 천연석 추천

## 7. 배포 및 환경변수

### Vercel 루트 연결

- 루트 `vercel.json`에서 `/`를 `/saju-five-elements/`로 리다이렉트
- 루트 `index.html`은 Vercel 설정이 적용되지 않는 환경을 위한 fallback

### API 키 관리

`.env` 파일은 Git에 올리지 않습니다. 로컬 개발에서는 `.env`를 사용하고, Vercel 배포에서는 Vercel Dashboard의 Environment Variables에 등록합니다.

필수 환경변수:

```env
KASI_SERVICE_KEY=공공데이터포털_인증키
KASI_LUNAR_API_ENDPOINT=https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService
```

Vercel에 환경변수를 추가하거나 수정한 뒤에는 반드시 Redeploy가 필요합니다.

## 8. 현재 제거/폐기된 방향

아래 항목은 과거 계획에는 있었지만 현재 제품 기준에서는 제거되었거나 다른 구조로 대체되었습니다.

- 일반 `운세 요약` 섹션: 제거됨
  - 재물운/사업운/연애운/종합운 일반 카드는 더 이상 표시하지 않음
  - 현재는 `올해 운세`와 상세 만세력 리포트 중심으로 구성
- Pinterest 참고 이미지 버튼: 제거됨
  - 외부 Pinterest 링크 대신 앱 내부 원석/팔찌 이미지를 사용
- 상세 리포트 내부 원석 카드: 제거됨
  - 원석 추천은 화면 하단의 전용 섹션으로 통합
- AI API를 통한 실시간 해설 생성: 현재 범위 아님
  - 정적 템플릿 기반 해설 사용

## 9. 주요 파일 역할

### 루트

- `index.html`: 앱 폴더로 이동하는 fallback 진입점
- `vercel.json`: Vercel 루트 리다이렉트 설정
- `api/lunar.js`: Vercel 서버리스 음양력 API 프록시
- `.gitignore`: `.env`, 임시 추출 폴더 제외
- `plan.md`: 작업 과정 기록 원본
- `plan_claude.md`: 중복 제거된 인수인계용 정리본

### 앱 폴더

- `saju-five-elements/index.html`: 메인 사주 계산기 화면
- `saju-five-elements/app.js`: 사주 계산, API 호출, 리포트 생성, 천연석 추천 렌더링
- `saju-five-elements/styles.css`: 전체 UI 스타일
- `saju-five-elements/stones.html`: 원석 전체 보기 페이지
- `saju-five-elements/dev-server.mjs`: 로컬 개발 서버 및 `/api/lunar` 라우트
- `saju-five-elements/assets/`: 앱에서 사용하는 이미지 자산

## 10. 검증 기준

변경 후 최소 확인 항목은 다음과 같습니다.

```powershell
node --check api\lunar.js
node --check saju-five-elements\dev-server.mjs
node --check saju-five-elements\app.js
git diff --check
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:4174/ | Select-Object -ExpandProperty StatusCode
```

음양력 API 예시 확인:

```powershell
Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:4174/api/lunar?calendar=solar&date=1979-08-15'
Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:4174/api/lunar?calendar=lunar&date=1979-06-23&leap=true'
Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:4174/api/lunar?calendar=lunar&date=1979-06-23&leap=false'
```

기대 예시:

- 양력 `1979-08-15` → 음력 `1979-06-23 윤달`
- 음력 `1979-06-23`, 윤달 → 양력 `1979-08-15`
- 음력 `1979-06-23`, 평달 → 양력 `1979-07-16`

## 11. 향후 개선 후보

- 절기 시각 기반 월주/년주 정밀 보정
- 대운 시작 나이 정밀 계산
- 지장간/십성/신살 계산 로직 고도화
- 모바일 상세 리포트 표 UX 추가 개선
- 실제 상품 촬영 이미지로 원석/팔찌 이미지 교체
- 구매 링크를 원석별/오행별 상품 페이지로 세분화
- Vercel 환경변수 설정 안내 문서 추가
