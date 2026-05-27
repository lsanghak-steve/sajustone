const stems = [
  { ko: "갑", hanja: "甲", element: "wood", yinYang: "양" },
  { ko: "을", hanja: "乙", element: "wood", yinYang: "음" },
  { ko: "병", hanja: "丙", element: "fire", yinYang: "양" },
  { ko: "정", hanja: "丁", element: "fire", yinYang: "음" },
  { ko: "무", hanja: "戊", element: "earth", yinYang: "양" },
  { ko: "기", hanja: "己", element: "earth", yinYang: "음" },
  { ko: "경", hanja: "庚", element: "metal", yinYang: "양" },
  { ko: "신", hanja: "辛", element: "metal", yinYang: "음" },
  { ko: "임", hanja: "壬", element: "water", yinYang: "양" },
  { ko: "계", hanja: "癸", element: "water", yinYang: "음" },
];

const branches = [
  { ko: "자", hanja: "子", animal: "쥐", element: "water" },
  { ko: "축", hanja: "丑", animal: "소", element: "earth" },
  { ko: "인", hanja: "寅", animal: "호랑이", element: "wood" },
  { ko: "묘", hanja: "卯", animal: "토끼", element: "wood" },
  { ko: "진", hanja: "辰", animal: "용", element: "earth" },
  { ko: "사", hanja: "巳", animal: "뱀", element: "fire" },
  { ko: "오", hanja: "午", animal: "말", element: "fire" },
  { ko: "미", hanja: "未", animal: "양", element: "earth" },
  { ko: "신", hanja: "申", animal: "원숭이", element: "metal" },
  { ko: "유", hanja: "酉", animal: "닭", element: "metal" },
  { ko: "술", hanja: "戌", animal: "개", element: "earth" },
  { ko: "해", hanja: "亥", animal: "돼지", element: "water" },
];

const elementInfo = {
  wood: { ko: "목", hanja: "木", label: "목(木)", message: "성장, 기획, 시작의 에너지를 보완하는 방향이 어울립니다." },
  fire: { ko: "화", hanja: "火", label: "화(火)", message: "표현력, 활력, 확산의 에너지를 보완하는 방향이 어울립니다." },
  earth: { ko: "토", hanja: "土", label: "토(土)", message: "안정감, 균형, 신뢰의 에너지를 보완하는 방향이 어울립니다." },
  metal: { ko: "금", hanja: "金", label: "금(金)", message: "결단력, 정리, 집중의 에너지를 보완하는 방향이 어울립니다." },
  water: { ko: "수", hanja: "水", message: "지혜, 유연함, 회복의 에너지를 보완하는 방향이 어울립니다.", label: "수(水)" },
};

const elementOrder = ["wood", "fire", "earth", "metal", "water"];

const monthBoundaries = [
  { month: 1, day: 6, branch: 1, order: 12 },
  { month: 2, day: 4, branch: 2, order: 1 },
  { month: 3, day: 6, branch: 3, order: 2 },
  { month: 4, day: 5, branch: 4, order: 3 },
  { month: 5, day: 6, branch: 5, order: 4 },
  { month: 6, day: 6, branch: 6, order: 5 },
  { month: 7, day: 7, branch: 7, order: 6 },
  { month: 8, day: 8, branch: 8, order: 7 },
  { month: 9, day: 8, branch: 9, order: 8 },
  { month: 10, day: 8, branch: 10, order: 9 },
  { month: 11, day: 7, branch: 11, order: 10 },
  { month: 12, day: 7, branch: 0, order: 11 },
];

const form = document.querySelector("#saju-form");
const birthDateInput = document.querySelector("#birth-date");
const birthTimeInput = document.querySelector("#birth-time");
const unknownTimeInput = document.querySelector("#unknown-time");
const sampleButton = document.querySelector("#sample-button");
const resultTitle = document.querySelector("#result-title");
const emptyState = document.querySelector("#empty-state");
const resultContent = document.querySelector("#result-content");
const pillarsEl = document.querySelector("#pillars");
const barsEl = document.querySelector("#element-bars");
const deficientTitle = document.querySelector("#deficient-title");
const deficientCopy = document.querySelector("#deficient-copy");
const detailedReadingEl = document.querySelector("#detailed-reading");
const stoneCardsEl = document.querySelector("#stone-cards");
const luckCardsEl = document.querySelector("#luck-cards");
const currentYearTitle = document.querySelector("#current-year-title");
const currentYearLuckCardsEl = document.querySelector("#current-year-luck-cards");
const advancedReportEl = document.querySelector("#advanced-report");
const calendarGridEl = document.querySelector("#calendar-grid");
const calendarNoteEl = document.querySelector("#calendar-note");
const submitButton = form.querySelector("button[type=submit]");

unknownTimeInput.addEventListener("change", () => {
  birthTimeInput.disabled = unknownTimeInput.checked;
});

sampleButton.addEventListener("click", () => {
  document.querySelector("#name").value = "샘플";
  birthDateInput.value = "1995-08-15";
  birthTimeInput.value = "09:30";
  unknownTimeInput.checked = false;
  birthTimeInput.disabled = false;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!birthDateInput.value) {
    birthDateInput.focus();
    return;
  }

  const dateParts = birthDateInput.value.split("-").map(Number);
  const timeParts = birthTimeInput.value.split(":").map(Number);
  const input = {
    name: document.querySelector("#name").value.trim(),
    year: dateParts[0],
    month: dateParts[1],
    day: dateParts[2],
    hour: unknownTimeInput.checked ? null : timeParts[0],
    minute: unknownTimeInput.checked ? null : timeParts[1],
    gender: document.querySelector("input[name=gender]:checked")?.value || "male",
  };

  submitButton.disabled = true;
  const previousButtonText = submitButton.textContent;
  submitButton.textContent = "공식 음양력 조회 중";

  try {
    const lunarInfo = await fetchOfficialLunarInfo(birthDateInput.value);
    renderResult(calculateSaju(input, lunarInfo), input);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = previousButtonText;
  }
});

async function fetchOfficialLunarInfo(dateValue) {
  try {
    const response = await fetch(`/api/lunar?date=${encodeURIComponent(dateValue)}`);
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      return {
        ok: false,
        message: data?.message || "공식 음양력 정보를 불러오지 못했습니다.",
      };
    }

    return data;
  } catch {
    return {
      ok: false,
      message: "공식 음양력 API에 연결할 수 없어 기존 계산값으로 표시합니다.",
    };
  }
}

function parseGanjiPillar(value) {
  if (!value) return null;
  const korean = value.split("(")[0].trim();
  if (korean.length < 2) return null;

  const stemIndex = stems.findIndex((stem) => stem.ko === korean[0]);
  const branchIndex = branches.findIndex((branch) => branch.ko === korean[1]);

  if (stemIndex === -1 || branchIndex === -1) return null;
  return { stemIndex, branchIndex };
}
function calculateSaju(input, lunarInfo = null) {
  const yearPillar = getYearPillar(input.year, input.month, input.day);
  const monthPillar = getMonthPillar(input.year, input.month, input.day, yearPillar.stemIndex);
  const officialDayPillar = parseGanjiPillar(lunarInfo?.item?.lunIljin);
  const dayPillar = officialDayPillar || getDayPillar(input.year, input.month, input.day);
  const hourPillar = input.hour === null ? null : getHourPillar(input.hour, dayPillar.stemIndex);
  const pillars = [
    { label: "년주", ...yearPillar },
    { label: "월주", ...monthPillar },
    { label: "일주", ...dayPillar },
    hourPillar ? { label: "시주", ...hourPillar } : { label: "시주", empty: true },
  ];

  const scores = elementOrder.reduce((acc, element) => {
    acc[element] = 0;
    return acc;
  }, {});

  pillars.forEach((pillar) => {
    if (pillar.empty) return;
    scores[stems[pillar.stemIndex].element] += 1;
    scores[branches[pillar.branchIndex].element] += 1;
  });

  const minScore = Math.min(...Object.values(scores));
  const deficient = elementOrder.filter((element) => scores[element] === minScore);
  const advanced = generateAdvancedReportData(pillars, scores, input);

  return { pillars, scores, deficient, lunarInfo, usesOfficialDayPillar: Boolean(officialDayPillar), advanced };
}
function getYearPillar(year, month, day) {
  const effectiveYear = month < 2 || (month === 2 && day < 4) ? year - 1 : year;
  const index = positiveMod(effectiveYear - 4, 60);
  return {
    stemIndex: index % 10,
    branchIndex: index % 12,
  };
}

function getMonthPillar(year, month, day, yearStemIndex) {
  const boundary = getMonthBoundary(month, day);
  const startStemByYearStem = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stemIndex = (startStemByYearStem[yearStemIndex] + boundary.order - 1) % 10;
  return {
    stemIndex,
    branchIndex: boundary.branch,
  };
}

function getMonthBoundary(month, day) {
  let selected = monthBoundaries[10];

  for (const boundary of monthBoundaries) {
    if (month > boundary.month || (month === boundary.month && day >= boundary.day)) {
      selected = boundary;
    }
  }

  return selected;
}

function getDayPillar(year, month, day) {
  const index = positiveMod(getJulianDayNumber(year, month, day) + 49, 60);
  return {
    stemIndex: index % 10,
    branchIndex: index % 12,
  };
}

function getHourPillar(hour, dayStemIndex) {
  const branchIndex = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const startStemByDayStem = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  return {
    stemIndex: (startStemByDayStem[dayStemIndex] + branchIndex) % 10,
    branchIndex,
  };
}

function getJulianDayNumber(year, month, day) {
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
}

function positiveMod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function renderResult(result, input) {
  const displayName = input.name ? `${input.name}님의` : "입력하신";
  resultTitle.textContent = `${displayName} 오행 결과`;
  emptyState.classList.add("hidden");
  resultContent.classList.remove("hidden");

  pillarsEl.innerHTML = result.pillars.map(renderPillar).join("");
  renderCalendarInfo(result);
  barsEl.innerHTML = renderBars(result.scores);

  const chips = result.deficient
    .map((element) => `<span class="deficient-chip ${element}">${elementInfo[element].label}</span>`)
    .join("");
  const messages = result.deficient.map((element) => elementInfo[element].message).join(" ");

  deficientTitle.innerHTML = chips;
  deficientCopy.textContent = messages;
  stoneCardsEl.innerHTML = renderStoneRecommendations(result.deficient);
  luckCardsEl.innerHTML = renderLuckCards(generateLuckReadings(result, input));
  const currentYearLuck = generateCurrentYearLuckReadings(result, input);
  currentYearTitle.textContent = `${currentYearLuck.year}년 ${currentYearLuck.pillarName} 올해 운세`;
  currentYearLuckCardsEl.innerHTML = renderLuckCards(currentYearLuck.readings);
  advancedReportEl.innerHTML = renderAdvancedReport(result, input);
  detailedReadingEl.innerHTML = generateDetailedReading(result, input)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}


function renderCalendarInfo(result) {
  const info = result.lunarInfo;

  if (!info?.ok || !info.item) {
    calendarGridEl.innerHTML = `
      <div class="calendar-item calendar-wide">
        <span>공식 음양력 API</span>
        <strong>기존 계산값 사용</strong>
      </div>
    `;
    calendarNoteEl.textContent = info?.message || "공식 음양력 정보를 불러오지 못해 기존 자체 계산으로 결과를 표시했습니다.";
    return;
  }

  const item = info.item;
  const lunarDate = `${item.lunYear}년 ${Number(item.lunMonth)}월 ${Number(item.lunDay)}일`;
  const leapText = `${item.lunLeapmonth || "-"} · 음력 ${item.lunNday || "-"}일 달`;
  const solarText = `${item.solYear}-${item.solMonth}-${item.solDay} (${item.solWeek || "-"})`;
  const officialText = result.usesOfficialDayPillar ? "공식 일진을 일주에 반영" : "공식 일진 표시만 반영";

  calendarGridEl.innerHTML = [
    { label: "양력 기준", value: solarText },
    { label: "음력 날짜", value: lunarDate },
    { label: "평달/윤달", value: leapText },
    { label: "양력 윤년", value: item.solLeapyear || "-" },
    { label: "세차", value: item.lunSecha || "-" },
    { label: "월건", value: item.lunWolgeon || "-" },
    { label: "일진", value: item.lunIljin || "-" },
    { label: "율리우스 적일", value: item.solJd || "-" },
    { label: "계산 보정", value: officialText },
  ].map((entry) => `
    <div class="calendar-item">
      <span>${escapeHtml(entry.label)}</span>
      <strong>${escapeHtml(entry.value)}</strong>
    </div>
  `).join("");

  calendarNoteEl.textContent = "한국천문연구원 음양력 정보제공 서비스 응답을 기준으로 음력 정보와 일진을 확인했습니다. 월주는 절기 기준 간단 계산을 유지합니다.";
}
const stoneRecommendations = {
  wood: {
    image: "./assets/stone-gallery/GreenAventurine.png", bracelet: "./assets/bracelet-gallery/GreenAventurine_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF",
    title: "목(木) 기운 추천석",
    tone: "초록 계열",
    summary: "성장, 시작, 회복, 기획의 기운을 상징합니다.",
    stones: [
      { name: "그린 아벤츄린", color: "#3f9f6a", image: "./assets/stone-gallery/GreenAventurine.png", bracelet: "./assets/bracelet-gallery/GreenAventurine_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF", meaning: "새로운 시작과 안정적인 성장을 상징하는 천연석입니다." },
      { name: "말라카이트", color: "#1f7a4d", image: "./assets/stone-gallery/Malachite.png", bracelet: "./assets/bracelet-gallery/Malachite_bra.png", meaning: "정체된 흐름을 바꾸고 변화의 용기를 돕는 상징석입니다." },
      { name: "페리도트", color: "#8abf45", image: "./assets/stone-gallery/Peridot.png", bracelet: "./assets/bracelet-gallery/Peridot_bra.png", meaning: "가벼운 활력과 긍정적인 회복감을 더하는 데 어울립니다." },
    ],
    tip: "목 기운이 부족할 때는 초록색 포인트나 식물 가까이에 두는 방식이 잘 어울립니다.",
  },
  fire: {
    image: "./assets/stone-gallery/Garnet.png", bracelet: "./assets/bracelet-gallery/Garnet_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF",
    title: "화(火) 기운 추천석",
    tone: "붉은 계열",
    summary: "표현, 열정, 활력, 자신감의 기운을 상징합니다.",
    stones: [
      { name: "가넷", color: "#8f1d2c", image: "./assets/stone-gallery/Garnet.png", bracelet: "./assets/bracelet-gallery/Garnet_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF", meaning: "집중력과 지속적인 열정을 상징하는 붉은 천연석입니다." },
      { name: "카넬리안", color: "#d85f2a", image: "./assets/stone-gallery/Carnelian.png", bracelet: "./assets/bracelet-gallery/Carnelian_bra.png", meaning: "표현력과 행동력을 깨우는 따뜻한 에너지의 상징석입니다." },
      { name: "레드 재스퍼", color: "#ad3f32", image: "./assets/stone-gallery/RedJasper.png", bracelet: "./assets/bracelet-gallery/RedJasper_bra.png", meaning: "흔들림 없는 활력과 실행력을 보완하는 데 어울립니다." },
    ],
    tip: "화 기운이 부족할 때는 발표, 만남, 중요한 시작이 있는 날에 붉은 계열 스톤을 포인트로 쓰면 좋습니다.",
  },
  earth: {
    image: "./assets/stone-gallery/TigerEye.png", bracelet: "./assets/bracelet-gallery/TigerEye_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF",
    title: "토(土) 기운 추천석",
    tone: "노랑·갈색 계열",
    summary: "안정, 균형, 현실감, 신뢰의 기운을 상징합니다.",
    stones: [
      { name: "타이거 아이", color: "#b4772f", image: "./assets/stone-gallery/TigerEye.png", bracelet: "./assets/bracelet-gallery/TigerEye_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF", meaning: "현실 감각과 중심을 잡는 힘을 상징하는 천연석입니다." },
      { name: "시트린", color: "#e0ad32", image: "./assets/stone-gallery/Citrine.png", bracelet: "./assets/bracelet-gallery/Citrine_bra.png", meaning: "밝은 자신감과 결과를 만드는 감각을 보완하는 데 어울립니다." },
      { name: "스모키 쿼츠", color: "#756050", image: "./assets/stone-gallery/SmokyQuartz.png", bracelet: "./assets/bracelet-gallery/SmokyQuartz_bra.png", meaning: "불안정한 마음을 가라앉히고 차분한 판단을 상징합니다." },
    ],
    tip: "토 기운이 부족할 때는 책상, 지갑, 업무 공간처럼 현실적인 결정을 하는 곳에 두기 좋습니다.",
  },
  metal: {
    image: "./assets/stone-gallery/ClearQuartz.png", bracelet: "./assets/bracelet-gallery/ClearQuartz_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF",
    title: "금(金) 기운 추천석",
    tone: "흰색·금속성 계열",
    summary: "정리, 결단, 집중, 보호의 기운을 상징합니다.",
    stones: [
      { name: "클리어 쿼츠", color: "#d9dde0", image: "./assets/stone-gallery/ClearQuartz.png", bracelet: "./assets/bracelet-gallery/ClearQuartz_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF", meaning: "생각을 맑게 정리하고 방향성을 세우는 상징석입니다." },
      { name: "헤마타이트", color: "#4d5356", image: "./assets/stone-gallery/Hematite.png", bracelet: "./assets/bracelet-gallery/Hematite_bra.png", meaning: "흐트러진 에너지를 모으고 단단한 집중을 돕는 이미지가 있습니다." },
      { name: "화이트 하울라이트", color: "#f0eee8", image: "./assets/stone-gallery/WhiteHowlite.png", bracelet: "./assets/bracelet-gallery/WhiteHowlite_bra.png", meaning: "차분함과 절제, 감정 정리를 상징하는 흰색 계열 천연석입니다." },
    ],
    tip: "금 기운이 부족할 때는 중요한 선택, 정리, 계약, 계획 수립 시 가까이 두는 방식이 어울립니다.",
  },
  water: {
    image: "./assets/stone-gallery/LapisLazuli.png", bracelet: "./assets/bracelet-gallery/LapisLazuli_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF",
    title: "수(水) 기운 추천석",
    tone: "파랑·검정 계열",
    summary: "지혜, 유연함, 감정 정화, 휴식의 기운을 상징합니다.",
    stones: [
      { name: "아쿠아마린", color: "#7fbfd1", image: "./assets/stone-gallery/Aquamarine.png", bracelet: "./assets/bracelet-gallery/Aquamarine_bra.png", meaning: "부드러운 소통과 감정의 흐름을 상징하는 파란 천연석입니다." },
      { name: "라피스 라줄리", color: "#264a9b", image: "./assets/stone-gallery/LapisLazuli.png", bracelet: "./assets/bracelet-gallery/LapisLazuli_bra.png", purchaseUrl: "https://smartstore.naver.com/diachae/products/13198469969?nl-ts-pid=jmTp0dqos5wssNkfsXR-078576&NaPm=ct%3Dmpmpq3z3%7Cci%3DCnRsbQAAAZ5kn1orAH57Ng%2E%2E02%7Ctr%3Dpmax%7Chk%3D0df335c9e0b65ba8a66532f86fe5aa785ab74218%7Cnacn%3DeeGcHwAeCbYJF", meaning: "깊은 통찰과 내면의 지혜를 떠올리게 하는 상징석입니다." },
      { name: "블랙 옵시디언", color: "#1b1b1d", image: "./assets/stone-gallery/BlackObsidian.png", bracelet: "./assets/bracelet-gallery/BlackObsidian_bra.png", meaning: "복잡한 마음을 비우고 보호의 이미지를 더하는 데 어울립니다." },
    ],
    tip: "수 기운이 부족할 때는 휴식 공간, 명상 시간, 잠들기 전 루틴과 함께 활용하기 좋습니다.",
  },
};

function renderStoneRecommendations(deficientElements) {
  return deficientElements.map((element) => {
    const recommendation = stoneRecommendations[element];
    const stones = recommendation.stones.map((stone) => `
      <li class="stone-item">
        <div class="stone-media-pair">
          <a class="stone-buy-link" href="${escapeHtml(recommendation.purchaseUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(stone.name)} 팔찌 구매 페이지 새 탭으로 열기">
            <img class="stone-thumb" src="${escapeHtml(stone.image)}" alt="${escapeHtml(stone.name)} 원석 이미지">
          </a>
          <a class="stone-buy-link" href="${escapeHtml(recommendation.purchaseUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(stone.name)} 팔찌 구매 페이지 새 탭으로 열기">
            <img class="bracelet-thumb" src="${escapeHtml(stone.bracelet)}" alt="${escapeHtml(stone.name)} 팔찌 이미지">
          </a>
        </div>
        <div class="stone-copy">
          <strong>${escapeHtml(stone.name)}</strong>
          <p>${escapeHtml(stone.meaning)}</p>
        </div>
      </li>
    `).join("");

    return `
      <article class="stone-card ${element}">
        <img class="stone-photo" src="${escapeHtml(recommendation.image)}" alt="${escapeHtml(recommendation.title)} 이미지">
        <div class="stone-card-head">
          <span class="stone-symbol">${elementInfo[element].hanja}</span>
          <div>
            <h4>${escapeHtml(recommendation.title)}</h4>
            <p>${escapeHtml(recommendation.tone)} · ${escapeHtml(recommendation.summary)}</p>
          </div>
        </div>
        <ul class="stone-list">${stones}</ul>
        <div class="stone-tip">${escapeHtml(recommendation.tip)}</div>
      </article>
    `;
  }).join("");
}
const elementRelations = {
  wood: { wealth: "earth", business: "metal" },
  fire: { wealth: "metal", business: "water" },
  earth: { wealth: "water", business: "wood" },
  metal: { wealth: "wood", business: "fire" },
  water: { wealth: "fire", business: "earth" },
};

function generateLuckReadings(result, input) {
  const dayPillar = result.pillars[2];
  const dayElement = stems[dayPillar.stemIndex].element;
  const relations = elementRelations[dayElement];
  const wealthElement = relations.wealth;
  const businessElement = relations.business;
  const strongestScore = Math.max(...Object.values(result.scores));
  const weakestScore = Math.min(...Object.values(result.scores));
  const balanceGap = strongestScore - weakestScore;
  const strongest = getElementsByScore(result.scores, strongestScore).map((element) => elementInfo[element].label).join(", ");
  const deficient = result.deficient.map((element) => elementInfo[element].label).join(", ");
  const wealthLevel = getScoreLevel(result.scores[wealthElement]);
  const businessLevel = getScoreLevel(result.scores[businessElement]);
  const loveScore = result.scores.fire + result.scores.earth;
  const loveLevel = loveScore >= 4 ? "활발" : loveScore >= 2 ? "보통" : "보완";
  const overallLevel = balanceGap <= 1 ? "균형" : balanceGap <= 2 ? "조정" : "보완";
  const name = input.name || "사용자";

  return [
    {
      title: "재물운",
      badge: wealthLevel,
      body: `${name}님의 재물운은 일간이 제어하는 ${elementInfo[wealthElement].label} 기운을 중심으로 봅니다. 이 기운은 돈을 벌고, 지키고, 현실적인 결과로 바꾸는 힘과 연결됩니다. 현재 ${elementInfo[wealthElement].label} 점수는 ${result.scores[wealthElement]}점이므로 ${wealthLevel === "강함" ? "성과를 만들 기회가 오면 적극적으로 붙잡는 편이 좋습니다. 다만 지출 기준을 분명히 세워야 재물이 흩어지지 않습니다." : wealthLevel === "보통" ? "무리한 확장보다 꾸준한 수입 구조와 반복 가능한 습관을 만드는 쪽이 안정적입니다." : "재물 흐름을 키우려면 기록, 예산, 저축, 작은 수익 경험처럼 현실 감각을 먼저 보완하는 것이 좋습니다."}`,
    },
    {
      title: "사업운",
      badge: businessLevel,
      body: `사업운은 책임, 압박, 사회적 역할을 뜻하는 ${elementInfo[businessElement].label} 기운과 월주의 계절감을 함께 참고합니다. 현재 ${elementInfo[businessElement].label} 점수는 ${result.scores[businessElement]}점입니다. ${businessLevel === "강함" ? "주도권을 잡고 구조를 만드는 힘이 비교적 잘 드러납니다. 혼자 밀어붙이기보다 협업 규칙과 숫자 관리를 세우면 사업성이 좋아집니다." : businessLevel === "보통" ? "아이디어를 바로 확장하기보다 검증, 고객 반응, 운영 루틴을 쌓아가면 안정적인 성장이 가능합니다." : "사업을 크게 벌이기 전 기준, 계약, 일정, 책임 범위를 명확히 하는 훈련이 필요합니다."}`,
    },
    {
      title: "연애운",
      badge: loveLevel,
      body: `연애운은 특정 글자 하나보다 표현력, 안정감, 관계의 균형을 함께 봅니다. 현재 화(火)와 토(土)의 합은 ${loveScore}점입니다. ${loveLevel === "활발" ? "감정 표현과 관계를 끌어가는 힘이 비교적 살아 있어 호감이 생기면 빠르게 가까워질 수 있습니다. 대신 상대의 속도도 존중해야 오래 갑니다." : loveLevel === "보통" ? "관계에서 과한 계산보다 자연스러운 대화와 꾸준한 신뢰가 중요합니다. 마음을 표현하는 빈도를 조금 더 늘리면 흐름이 부드러워집니다." : "마음을 숨기거나 혼자 판단하기 쉬우므로 감정 표현, 약속의 안정감, 편안한 만남의 리듬을 의식적으로 만들어야 합니다."}`,
    },
    {
      title: "종합운",
      badge: overallLevel,
      body: `전체 오행에서 가장 강한 기운은 ${strongest}, 보완이 필요한 기운은 ${deficient}입니다. 강약 차이는 ${balanceGap}점으로 나타납니다. ${overallLevel === "균형" ? "비교적 한쪽으로 치우치지 않은 구조라 상황에 따라 유연하게 움직이기 좋습니다." : overallLevel === "조정" ? "특정 기운이 앞서기 쉬우므로 중요한 선택 전에는 속도와 균형을 점검하는 과정이 필요합니다." : "강한 기운과 약한 기운의 차이가 커서 장점은 뚜렷하지만 피로도 함께 생길 수 있습니다. 부족 오행을 생활 습관과 환경으로 보완하면 전체 흐름이 안정됩니다."}`,
    },
  ];
}

function getScoreLevel(score) {
  if (score >= 3) return "강함";
  if (score >= 1) return "보통";
  return "보완";
}

function renderLuckCards(readings) {
  return readings.map((reading) => `
    <article class="luck-card">
      <div class="luck-card-head">
        <h4>${escapeHtml(reading.title)}</h4>
        <span class="luck-badge">${escapeHtml(reading.badge)}</span>
      </div>
      <p>${escapeHtml(reading.body)}</p>
    </article>
  `).join("");
}
function generateCurrentYearLuckReadings(result, input) {
  const currentYear = new Date().getFullYear();
  const currentPillar = getYearPillar(currentYear, 7, 1);
  const currentStem = stems[currentPillar.stemIndex];
  const currentBranch = branches[currentPillar.branchIndex];
  const currentElements = [currentStem.element, currentBranch.element];
  const currentLabels = currentElements.map((element) => elementInfo[element].label).join(", ");
  const dayElement = stems[result.pillars[2].stemIndex].element;
  const relations = elementRelations[dayElement];
  const wealthElement = relations.wealth;
  const businessElement = relations.business;
  const name = input.name || "사용자";
  const strongestScore = Math.max(...Object.values(result.scores));
  const strongest = getElementsByScore(result.scores, strongestScore);
  const yearComplementsDeficient = result.deficient.some((element) => currentElements.includes(element));
  const yearAmplifiesStrong = strongest.some((element) => currentElements.includes(element));
  const wealthMatch = currentElements.includes(wealthElement);
  const businessMatch = currentElements.includes(businessElement);
  const loveBoost = currentElements.includes("fire") || currentElements.includes("earth");
  const balanceLabel = yearComplementsDeficient ? "보완" : yearAmplifiesStrong ? "강화" : "흐름";

  return {
    year: currentYear,
    pillarName: getPillarName(currentPillar),
    readings: [
      {
        title: "올해 재물운",
        badge: wealthMatch ? "상승" : "관리",
        body: `${currentYear}년은 ${getPillarName(currentPillar)}의 해로 ${currentLabels} 기운이 들어옵니다. ${name}님의 재물 오행은 ${elementInfo[wealthElement].label}입니다. ${wealthMatch ? "올해 기운이 재물 오행과 직접 맞닿아 있어 수익 기회, 거래, 판매, 금전적 결과를 만들 계기가 생기기 쉽습니다. 다만 기회가 곧 안정 수익이 되는 것은 아니므로 계약 조건과 지출 계획을 꼼꼼히 보는 것이 좋습니다." : "올해는 재물 자체를 크게 밀어붙이기보다 돈의 흐름을 정리하고, 새는 지출을 줄이며, 수입 구조를 안정시키는 쪽이 유리합니다. 작은 수익 경험을 반복해 신뢰를 쌓는 방식이 좋습니다."}`,
      },
      {
        title: "올해 사업운",
        badge: businessMatch ? "확장" : "정비",
        body: `사업운은 일간을 압박하고 사회적 책임을 만드는 ${elementInfo[businessElement].label} 기운을 함께 봅니다. ${businessMatch ? "올해의 천간/지지 오행이 사업 오행과 연결되어 일, 직책, 거래처, 프로젝트 면에서 움직임이 커질 수 있습니다. 확장 욕심만 앞세우기보다 운영 체계, 일정 관리, 역할 분담을 먼저 잡으면 성과가 좋아집니다." : "올해는 무리한 확장보다 사업 구조를 점검하고, 상품성, 고객 반응, 반복 매출, 협업 기준을 다듬는 데 힘을 쓰면 좋습니다. 준비가 탄탄할수록 다음 기회가 왔을 때 빠르게 움직일 수 있습니다."}`,
      },
      {
        title: "올해 연애운",
        badge: loveBoost ? "활성" : "차분",
        body: `연애운은 감정 표현의 화(火), 안정감의 토(土), 그리고 사주 전체의 균형을 함께 참고합니다. ${loveBoost ? "올해는 관계를 움직이게 하는 표현력이나 안정감의 기운이 들어와 만남, 대화, 호감 표현을 시도하기 좋습니다. 다만 감정 속도가 빨라질 수 있으니 상대의 리듬을 확인하는 태도가 중요합니다." : "올해는 강한 사건성보다 차분하게 관계를 살피는 흐름에 가깝습니다. 새로운 인연을 기다리기만 하기보다 자연스러운 접점, 소개, 취미 모임처럼 부담 없는 연결을 늘리면 흐름이 부드러워집니다."}`,
      },
      {
        title: "올해 종합운",
        badge: balanceLabel,
        body: `올해 들어오는 ${currentLabels} 기운은 ${yearComplementsDeficient ? "부족 오행을 일부 보완해 전체 균형을 잡는 데 도움을 줄 수 있습니다. 평소 약하다고 느낀 영역을 시도해보면 의외로 좋은 반응을 얻을 수 있습니다." : yearAmplifiesStrong ? "이미 강한 기운을 더 키우는 방향이라 장점은 뚜렷하게 드러나지만 과속이나 피로가 생기지 않도록 조절이 필요합니다." : "기존 사주 구조와 직접 강하게 부딪히기보다 새로운 자극을 주는 흐름입니다. 큰 결정보다는 흐름을 관찰하며 필요한 선택을 단계적으로 하는 편이 좋습니다."} 현재 운세는 간단형 세운 해석이므로 실제 대운, 월운, 합충 관계까지 보려면 더 정밀한 만세력 계산이 필요합니다.`
      },
    ],
  };
}
const hiddenStemMap = {
  0: [9],
  1: [5, 9, 7],
  2: [0, 2, 4],
  3: [1],
  4: [4, 1, 9],
  5: [2, 4, 6],
  6: [3, 5],
  7: [5, 3, 1],
  8: [6, 8, 4],
  9: [7],
  10: [4, 7, 3],
  11: [8, 0],
};

const lifeStageTable = [
  ["목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘", "절", "태", "양", "장생"],
  ["병", "쇠", "제왕", "건록", "관대", "목욕", "장생", "양", "태", "절", "묘", "사"],
  ["태", "양", "장생", "목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘", "절"],
  ["절", "묘", "사", "병", "쇠", "제왕", "건록", "관대", "목욕", "장생", "양", "태"],
  ["태", "양", "장생", "목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘", "절"],
  ["절", "묘", "사", "병", "쇠", "제왕", "건록", "관대", "목욕", "장생", "양", "태"],
  ["사", "묘", "절", "태", "양", "장생", "목욕", "관대", "건록", "제왕", "쇠", "병"],
  ["장생", "양", "태", "절", "묘", "사", "병", "쇠", "제왕", "건록", "관대", "목욕"],
  ["제왕", "쇠", "병", "사", "묘", "절", "태", "양", "장생", "목욕", "관대", "건록"],
  ["건록", "관대", "목욕", "장생", "양", "태", "절", "묘", "사", "병", "쇠", "제왕"],
];

const solarTerms = ["소한", "입춘", "경칩", "청명", "입하", "망종", "소서", "입추", "백로", "한로", "입동", "대설"];
const twelveSalNames = ["겁살", "재살", "천살", "지살", "년살", "월살", "망신살", "장성살", "반안살", "역마살", "육해살", "화개살"];
const branchRelationRules = {
  육합: [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]],
  충: [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]],
  형: [[0, 3], [1, 10], [2, 5], [5, 8], [7, 10]],
  파: [[0, 9], [1, 4], [2, 11], [3, 6], [5, 8], [7, 10]],
  해: [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]],
  원진: [[0, 7], [1, 6], [2, 9], [3, 8], [4, 11], [5, 10]],
  귀문: [[0, 9], [1, 6], [2, 7], [3, 8], [4, 11], [5, 10]],
};
const heavenlyCombos = [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]];
const triadGroups = [
  { name: "수국", branches: [8, 0, 4] },
  { name: "목국", branches: [11, 3, 7] },
  { name: "화국", branches: [2, 6, 10] },
  { name: "금국", branches: [5, 9, 1] },
];

function generateAdvancedReportData(pillars, scores, input) {
  const dayStemIndex = pillars[2].stemIndex;
  const yearStem = stems[pillars[0].stemIndex];
  const forward = (input.gender === "male" && yearStem.yinYang === "양") || (input.gender === "female" && yearStem.yinYang === "음");
  return {
    displayPillars: getDisplayPillars(pillars),
    deepRows: buildDeepRows(pillars, dayStemIndex),
    greatLuck: buildGreatLuck(pillars[1], pillars[0].branchIndex, dayStemIndex, input, forward),
    yearlyLuck: buildYearlyLuck(pillars[0].branchIndex, dayStemIndex),
    monthlyLuck: buildMonthlyLuck(dayStemIndex, input.year),
    relations: buildRelationSummary(pillars),
    sals: buildSalSummary(pillars),
    direction: forward ? "순행" : "역행",
    currentAge: new Date().getFullYear() - input.year + 1,
    scores,
  };
}

function getDisplayPillars(pillars) {
  return [
    { key: "hour", label: "시주", pillar: pillars[3] },
    { key: "day", label: "일주", pillar: pillars[2] },
    { key: "month", label: "월주", pillar: pillars[1] },
    { key: "year", label: "연주", pillar: pillars[0] },
  ];
}

function buildDeepRows(pillars, dayStemIndex) {
  return getDisplayPillars(pillars).map(({ label, pillar }) => {
    if (pillar.empty) {
      return { label, ganji: "-", tenGod: "-", mainHiddenTenGod: "-", hiddenTenGods: "-", hiddenStems: "-", lifeStage: "-", branchSal: "-", specialSals: "출생시간 확인 필요" };
    }
    const hidden = hiddenStemMap[pillar.branchIndex] || [];
    return {
      label,
      ganji: getPillarHanja(pillar),
      tenGod: getTenGod(dayStemIndex, pillar.stemIndex),
      mainHiddenTenGod: hidden[0] !== undefined ? getTenGod(dayStemIndex, hidden[0]) : "-",
      hiddenTenGods: hidden.map((stemIndex) => getTenGod(dayStemIndex, stemIndex)).join(", "),
      hiddenStems: hidden.map((stemIndex) => stems[stemIndex].hanja).join(""),
      lifeStage: getLifeStage(dayStemIndex, pillar.branchIndex),
      branchSal: getTwelveSal(pillars[0].branchIndex, pillar.branchIndex),
      specialSals: getSpecialSals(pillars, pillar).join(", ") || "-",
    };
  });
}

function buildGreatLuck(monthPillar, yearBranchIndex, dayStemIndex, input, forward) {
  const monthCycle = getCycleIndex(monthPillar);
  const startAge = 9;
  const rows = Array.from({ length: 10 }, (_, index) => {
    const age = startAge + index * 10;
    const cycleIndex = positiveMod(monthCycle + (forward ? index + 1 : -(index + 1)), 60);
    const pillar = cyclePillar(cycleIndex);
    return {
      age,
      range: `${age}세`,
      ganji: getPillarHanja(pillar),
      stem: stems[pillar.stemIndex].hanja,
      branch: branches[pillar.branchIndex].hanja,
      startYear: input.year + age - 1,
      direction: forward ? "순행" : "역행",
      current: new Date().getFullYear() - input.year + 1 >= age && new Date().getFullYear() - input.year + 1 < age + 10 ? "●" : "",
      sal: getTwelveSal(yearBranchIndex, pillar.branchIndex),
      lifeStage: getLifeStage(dayStemIndex, pillar.branchIndex),
    };
  });
  return forward ? rows : rows.reverse();
}

function buildYearlyLuck(yearBranchIndex, dayStemIndex) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, index) => {
    const year = currentYear - 9 + index;
    const pillar = getYearPillar(year, 7, 1);
    return {
      year,
      ganji: getPillarHanja(pillar),
      stem: stems[pillar.stemIndex].hanja,
      branch: branches[pillar.branchIndex].hanja,
      sal: getTwelveSal(yearBranchIndex, pillar.branchIndex),
      lifeStage: getLifeStage(dayStemIndex, pillar.branchIndex),
    };
  });
}

function buildMonthlyLuck(dayStemIndex, year) {
  const yearPillar = getYearPillar(new Date().getFullYear(), 7, 1);
  return Array.from({ length: 12 }, (_, index) => {
    const month = 12 - index;
    const pillar = getMonthPillar(new Date().getFullYear(), month, 15, yearPillar.stemIndex);
    return {
      month,
      name: `${month}월`,
      ganji: getPillarHanja(pillar),
      stem: stems[pillar.stemIndex].hanja,
      branch: branches[pillar.branchIndex].hanja,
      sal: getTwelveSal(getYearPillar(year, 7, 1).branchIndex, pillar.branchIndex),
      lifeStage: getLifeStage(dayStemIndex, pillar.branchIndex),
      stemTenGod: getTenGod(dayStemIndex, pillar.stemIndex),
      branchTenGod: getTenGod(dayStemIndex, (hiddenStemMap[pillar.branchIndex] || [pillar.stemIndex])[0]),
      term: solarTerms[month - 1],
    };
  });
}

function buildRelationSummary(pillars) {
  const known = getDisplayPillars(pillars).filter(({ pillar }) => !pillar.empty);
  const stemPairs = [];
  const branchRows = { 지장간: {}, 방합: {}, 삼합: {}, 반합: {}, 육합: {}, 충: {}, 형: {}, 파: {}, 해: {}, 원진: {}, 귀문: {} };

  known.forEach(({ label, pillar }) => {
    branchRows.지장간[label] = (hiddenStemMap[pillar.branchIndex] || []).map((stemIndex) => stems[stemIndex].hanja).join("");
  });

  for (let i = 0; i < known.length; i += 1) {
    for (let j = i + 1; j < known.length; j += 1) {
      const first = known[i];
      const second = known[j];
      if (matchesPair(heavenlyCombos, first.pillar.stemIndex, second.pillar.stemIndex)) {
        stemPairs.push({ type: "합", pair: `${stems[first.pillar.stemIndex].hanja}${stems[second.pillar.stemIndex].hanja}`, pillars: `${first.label}-${second.label}`, desc: `${stems[first.pillar.stemIndex].hanja}${stems[second.pillar.stemIndex].hanja}합` });
      }
      Object.entries(branchRelationRules).forEach(([type, pairs]) => {
        if (matchesPair(pairs, first.pillar.branchIndex, second.pillar.branchIndex)) {
          branchRows[type][first.label] = appendCell(branchRows[type][first.label], `${branches[first.pillar.branchIndex].hanja}${branches[second.pillar.branchIndex].hanja}`);
          branchRows[type][second.label] = appendCell(branchRows[type][second.label], `${branches[first.pillar.branchIndex].hanja}${branches[second.pillar.branchIndex].hanja}`);
        }
      });
    }
  }

  triadGroups.forEach((group) => {
    const matches = known.filter(({ pillar }) => group.branches.includes(pillar.branchIndex));
    if (matches.length >= 3) {
      matches.forEach(({ label }) => { branchRows.삼합[label] = appendCell(branchRows.삼합[label], group.name); });
    } else if (matches.length === 2) {
      matches.forEach(({ label }) => { branchRows.반합[label] = appendCell(branchRows.반합[label], group.name); });
    }
  });

  return { heavenly: stemPairs, branchRows };
}

function buildSalSummary(pillars) {
  return getDisplayPillars(pillars).map(({ label, pillar }) => {
    if (pillar.empty) return { label, branchSal: "-", ganSal: "-", special: "출생시간 확인 필요", all: "-" };
    const branchSal = getTwelveSal(pillars[0].branchIndex, pillar.branchIndex);
    const special = getSpecialSals(pillars, pillar).join(", ") || "-";
    return { label, branchSal, ganSal: "-", special, all: [branchSal, special].filter((value) => value && value !== "-").join(", ") || "-" };
  });
}

function getTenGod(dayStemIndex, targetStemIndex) {
  const dayStem = stems[dayStemIndex];
  const targetStem = stems[targetStemIndex];
  const samePolarity = dayStem.yinYang === targetStem.yinYang;
  if (dayStem.element === targetStem.element) return samePolarity ? "비견" : "겁재";
  if (creates(dayStem.element, targetStem.element)) return samePolarity ? "식신" : "상관";
  if (controls(dayStem.element, targetStem.element)) return samePolarity ? "편재" : "정재";
  if (controls(targetStem.element, dayStem.element)) return samePolarity ? "편관" : "정관";
  if (creates(targetStem.element, dayStem.element)) return samePolarity ? "편인" : "정인";
  return "-";
}

function creates(source, target) {
  return { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" }[source] === target;
}

function controls(source, target) {
  return { wood: "earth", fire: "metal", earth: "water", metal: "wood", water: "fire" }[source] === target;
}

function getLifeStage(dayStemIndex, branchIndex) {
  return lifeStageTable[dayStemIndex][branchIndex] || "-";
}

function getTwelveSal(yearBranchIndex, branchIndex) {
  return twelveSalNames[positiveMod(branchIndex - yearBranchIndex, 12)];
}

function getSpecialSals(pillars, pillar) {
  const dayPillar = pillars[2];
  const sals = [];
  if (stems[pillar.stemIndex].element === branches[pillar.branchIndex].element) sals.push("간여지동");
  if (matchesPair(branchRelationRules.원진, dayPillar.branchIndex, pillar.branchIndex)) sals.push("원진");
  if (matchesPair(branchRelationRules.귀문, dayPillar.branchIndex, pillar.branchIndex)) sals.push("귀문");
  if (matchesPair(branchRelationRules.충, dayPillar.branchIndex, pillar.branchIndex)) sals.push("충");
  if (["장생", "건록", "제왕"].includes(getLifeStage(dayPillar.stemIndex, pillar.branchIndex))) sals.push("활력성");
  return [...new Set(sals)];
}

function renderAdvancedReport(result, input) {
  const data = result.advanced;
  const displayPillars = data.displayPillars;
  const genderText = input.gender === "female" ? "여성" : "남성";
  const pillarColumns = displayPillars.map((entry) => entry.label);
  const pillarValues = displayPillars.map(({ pillar }) => pillar.empty ? "-" : getPillarHanja(pillar));
  const elementValues = elementOrder.map((element) => String(result.scores[element]));
  const deepRows = [
    ["십성", ...data.deepRows.map((row) => row.tenGod)],
    ["정기지지십성", ...data.deepRows.map((row) => row.mainHiddenTenGod)],
    ["지지십성", ...data.deepRows.map((row) => row.hiddenTenGods)],
    ["지장간", ...data.deepRows.map((row) => row.hiddenStems)],
    ["봉법12운성", ...data.deepRows.map((row) => row.lifeStage)],
    ["지지 신살", ...data.deepRows.map((row) => row.branchSal)],
    ["특수 신살", ...data.deepRows.map((row) => row.specialSals)],
  ];
  const branchRelationRows = Object.entries(data.relations.branchRows).map(([type, cells]) => [type, ...displayPillars.map((entry) => cells[entry.label] || "")]);
  const heavenlyRows = data.relations.heavenly.length
    ? data.relations.heavenly.map((row) => [row.type, row.pair, row.pillars, row.desc])
    : [["-", "-", "-", "천간합이 강하게 드러나지 않습니다."]];
  const salRows = [
    ["지지 신살", ...data.sals.map((row) => row.branchSal)],
    ["천간 신살", ...data.sals.map((row) => row.ganSal)],
    ["특수 신살", ...data.sals.map((row) => row.special)],
    ["종합 신살", ...data.sals.map((row) => row.all)],
  ];

  return `
    <div class="report-note">입력 기준: ${escapeHtml(genderText)} · ${escapeHtml(input.year)}년 ${escapeHtml(input.month)}월 ${escapeHtml(input.day)}일 ${input.hour === null ? "출생시간 모름" : `${escapeHtml(String(input.hour).padStart(2, "0"))}:${escapeHtml(String(input.minute).padStart(2, "0"))}`} · 대운 방향 ${escapeHtml(data.direction)} · 현재 ${escapeHtml(data.currentAge)}세</div>
    ${renderReportTable("사주 4주", pillarColumns, [pillarValues])}
    ${renderReportTable("오행 분포", elementOrder.map((element) => elementInfo[element].label), [elementValues])}
    ${renderReportTable("심층 분석: 십성 & 12운성", ["구분", ...pillarColumns], deepRows)}
    ${renderReportTable("대운", ["나이범위", "간지", "천간", "지지", "시작연도", "방향", "현재", "신살", "12운성"], data.greatLuck.map((row) => [row.range, row.ganji, row.stem, row.branch, row.startYear, row.direction, row.current, row.sal, row.lifeStage]))}
    ${renderReportTable("세운", ["연도", "간지", "천간", "지지", "신살", "12운성"], data.yearlyLuck.map((row) => [row.year, row.ganji, row.stem, row.branch, row.sal, row.lifeStage]))}
    ${renderReportTable("월운", ["월", "월명", "간지", "천간", "지지", "신살", "12운성", "천간십성", "지지십성", "절기"], data.monthlyLuck.map((row) => [row.month, row.name, row.ganji, row.stem, row.branch, row.sal, row.lifeStage, row.stemTenGod, row.branchTenGod, row.term]))}
    ${renderReportTable("천간 특수관계", ["유형", "관계쌍", "기둥", "설명"], heavenlyRows)}
    ${renderReportTable("지지 형·충·회·합 해석", ["구분", ...pillarColumns], branchRelationRows)}
    ${renderReportTable("종합 신살", ["구분", ...pillarColumns], salRows)}
    ${renderReportStones(result.deficient)}
  `;
}

function renderReportTable(title, columns, rows) {
  return `
    <div class="report-table-block">
      <h4>${escapeHtml(title)}</h4>
      <div class="report-table-wrap">
        <table class="report-table">
          <thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell ?? "")}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderReportStones(deficientElements) {
  const stones = deficientElements.flatMap((element) => stoneRecommendations[element].stones.slice(0, 3).map((stone) => ({ ...stone, element })));
  return `
    <div class="report-table-block">
      <h4>부족 오행 추천 원석 사진</h4>
      <div class="report-stone-grid">
        ${stones.map((stone) => `
          <a class="report-stone-card" href="${escapeHtml(stone.purchaseUrl || stoneRecommendations[stone.element].purchaseUrl)}" target="_blank" rel="noopener noreferrer">
            <img src="${escapeHtml(stone.image)}" alt="${escapeHtml(stone.name)} 원석 사진">
            <strong>${escapeHtml(stone.name)}</strong>
            <span>${escapeHtml(elementInfo[stone.element].label)}</span>
          </a>
        `).join("")}
      </div>
    </div>
  `;
}

function getCycleIndex(pillar) {
  return Array.from({ length: 60 }, (_, index) => index).find((index) => index % 10 === pillar.stemIndex && index % 12 === pillar.branchIndex) || 0;
}

function cyclePillar(index) {
  return { stemIndex: positiveMod(index, 10), branchIndex: positiveMod(index, 12) };
}

function getPillarHanja(pillar) {
  if (pillar.empty) return "-";
  return `${stems[pillar.stemIndex].hanja}${branches[pillar.branchIndex].hanja}`;
}

function matchesPair(pairs, first, second) {
  return pairs.some(([left, right]) => (left === first && right === second) || (left === second && right === first));
}

function appendCell(current, value) {
  return current ? `${current}, ${value}` : value;
}
function generateDetailedReading(result, input) {
  const name = input.name || "사용자";
  const knownPillars = result.pillars.filter((pillar) => !pillar.empty);
  const yearPillar = result.pillars[0];
  const monthPillar = result.pillars[1];
  const dayPillar = result.pillars[2];
  const hourPillar = result.pillars[3];
  const dayStem = stems[dayPillar.stemIndex];
  const dayBranch = branches[dayPillar.branchIndex];
  const strongest = getElementsByScore(result.scores, Math.max(...Object.values(result.scores)));
  const weakest = result.deficient;
  const totalScore = Object.values(result.scores).reduce((sum, score) => sum + score, 0);
  const scoreSummary = elementOrder.map((element) => `${elementInfo[element].label} ${result.scores[element]}점`).join(", ");
  const officialCalendarText = result.lunarInfo?.ok && result.lunarInfo.item
    ? `한국천문연구원 공식 음양력 기준으로 음력 ${result.lunarInfo.item.lunYear}년 ${Number(result.lunarInfo.item.lunMonth)}월 ${Number(result.lunarInfo.item.lunDay)}일, ${result.lunarInfo.item.lunLeapmonth}달, 일진 ${result.lunarInfo.item.lunIljin}, 월건 ${result.lunarInfo.item.lunWolgeon}, 세차 ${result.lunarInfo.item.lunSecha} 정보를 확인했습니다. ${result.usesOfficialDayPillar ? "이 중 일진은 일주 계산에 우선 반영했습니다." : "다만 일진 파싱이 되지 않아 기존 자체 일주 계산을 유지했습니다."}`
    : "공식 음양력 API 정보를 불러오지 못해 기존 자체 계산 방식으로 사주 기둥을 산출했습니다.";
  const pillarSummary = knownPillars.map((pillar) => `${pillar.label} ${getPillarName(pillar)}`).join(", ");
  const strongestLabels = strongest.map((element) => elementInfo[element].label).join(", ");
  const weakestLabels = weakest.map((element) => elementInfo[element].label).join(", ");
  const weakMessages = weakest.map((element) => elementInfo[element].message).join(" ");
  const timeText = hourPillar.empty
    ? "출생시간을 모르는 상태이므로 시주는 제외하고 해석합니다. 시주는 내면의 욕구, 잠재력, 말년의 흐름을 볼 때 참고하는 기둥이라 시간이 확인되면 결과가 조금 더 선명해집니다."
    : `출생시간까지 입력되어 시주 ${getPillarName(hourPillar)}도 함께 반영했습니다. 시주는 겉으로 드러난 성향보다 내면의 욕구, 깊은 습관, 오래 두고 발휘되는 가능성을 보는 데 도움을 줍니다.`;

  return [
    `${name}님의 사주는 입력한 생년월일을 기준으로 ${pillarSummary}의 흐름으로 계산됩니다. ${officialCalendarText} 사주는 태어난 해, 달, 날, 시간을 각각 하나의 기둥으로 세우고, 각 기둥의 천간과 지지를 합쳐 여덟 글자로 사람의 기질과 균형을 살피는 방식입니다. 여기서 년주는 성장 배경과 외부에 보이는 첫인상, 월주는 태어난 계절과 사회적 무대, 일주는 자기 자신과 관계 방식, 시주는 내면의 가능성과 후반 흐름을 보는 기준으로 활용됩니다.`,
    `가장 중심이 되는 글자는 일주의 천간, 즉 일간입니다. ${name}님의 일간은 ${dayStem.ko}${dayStem.hanja}, ${dayStem.yinYang} ${elementInfo[dayStem.element].label}의 성향으로 표시됩니다. 일간은 사주에서 나 자신을 상징하므로 성격을 볼 때 가장 먼저 살피는 기준입니다. 일지는 ${dayBranch.ko}${dayBranch.hanja}로, 일간이 실제 관계와 생활 속에서 어떤 환경을 만나는지 보여줍니다. 다만 일간 하나만으로 성격을 단정하면 해석이 얕아지므로 주변 기둥들이 일간을 돕는지, 소모시키는지, 균형을 잡아주는지를 함께 봐야 합니다.`,
    `이번 결과의 오행 점수는 총 ${totalScore}점 기준으로 ${scoreSummary}입니다. 점수가 높은 오행은 사주 안에서 자주 드러나는 기운이며, 낮은 오행은 의식적으로 보완하면 균형감을 얻기 쉬운 기운입니다. 현재 가장 강하게 나타나는 기운은 ${strongestLabels}이고, 상대적으로 부족하게 잡힌 기운은 ${weakestLabels}입니다. 강한 기운은 장점으로 쓰이면 추진력과 개성이 되지만, 지나치면 고집이나 피로감으로 나타날 수 있습니다. 부족한 기운은 약점이라는 뜻이 아니라 삶에서 더 의식적으로 길러야 할 방향으로 이해하는 것이 좋습니다.`,
    `년주 ${getPillarName(yearPillar)}는 ${elementInfo[stems[yearPillar.stemIndex].element].label}의 천간과 ${elementInfo[branches[yearPillar.branchIndex].element].label}의 지지를 품고 있어 바깥 환경과 첫인상의 색을 만듭니다. 월주 ${getPillarName(monthPillar)}는 계절의 힘을 나타내기 때문에 직업적 태도, 사회성, 성장 방식에 큰 영향을 준다고 봅니다. 같은 일간이라도 월주가 어떤 오행을 가지고 있느냐에 따라 표현 방식이 달라집니다. 그래서 생년월일을 입력해 사주를 볼 때는 단순히 띠만 보는 것보다 월주의 계절감과 일간의 관계를 함께 읽는 것이 훨씬 중요합니다.`,
    `${timeText} 현재 프로그램은 각 천간과 지지의 대표 오행을 1점씩 더해 분포를 보여주는 간단형 해석입니다. 실제 명리학에서는 지장간, 십성, 합충형해, 대운과 세운, 절기의 정확한 시각까지 함께 보지만, 이 화면에서는 사용자가 자신의 기본 구조를 쉽게 이해하도록 핵심 정보만 먼저 정리합니다. 따라서 결과는 상담용 단정문이 아니라 사주를 처음 이해하기 위한 안내문으로 받아들이는 것이 좋습니다.`,
    `부족 오행으로 표시된 ${weakestLabels}은 지금 사주 구조에서 보완 포인트로 볼 수 있습니다. ${weakMessages} 예를 들어 목이 부족하면 새로운 계획을 세우고 꾸준히 성장시키는 습관이 도움이 되고, 화가 부족하면 표현과 활동성을 키우는 일이 좋습니다. 토가 부족하면 루틴과 안정감을 만들고, 금이 부족하면 정리와 기준 세우기를 연습하며, 수가 부족하면 휴식과 유연한 사고를 의식적으로 챙기는 방식으로 균형을 잡을 수 있습니다.`,
    `이 해석의 목적은 운명을 고정해서 말하는 것이 아니라, 자신에게 익숙한 에너지와 덜 익숙한 에너지를 알아차리게 하는 데 있습니다. 사주는 타고난 기질을 보여주는 언어이고, 실제 삶은 선택, 환경, 관계, 노력에 따라 계속 달라집니다. 그래서 결과 화면은 “좋다” 또는 “나쁘다”보다 “어떤 기운이 강하고 어떤 기운을 보완하면 편안한가”에 초점을 맞추는 것이 좋습니다. 이후 이 기능을 상품 추천과 연결한다면 부족 오행에 맞는 색상, 원석, 염주, 선물 메시지를 자연스럽게 제안할 수 있습니다.`,
  ];
}

function getElementsByScore(scores, targetScore) {
  return elementOrder.filter((element) => scores[element] === targetScore);
}

function getPillarName(pillar) {
  const stem = stems[pillar.stemIndex];
  const branch = branches[pillar.branchIndex];
  return `${stem.ko}${branch.ko}(${stem.hanja}${branch.hanja})`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function renderPillar(pillar) {
  if (pillar.empty) {
    return `
      <article class="pillar-card muted">
        <p class="pillar-label">${pillar.label}</p>
        <div class="pillar-main"><strong>?</strong><span>출생시간 모름</span></div>
        <div class="element-tags"><span class="tag earth">미계산</span></div>
      </article>
    `;
  }

  const stem = stems[pillar.stemIndex];
  const branch = branches[pillar.branchIndex];

  return `
    <article class="pillar-card">
      <p class="pillar-label">${pillar.label}</p>
      <div class="pillar-main">
        <strong>${stem.ko}${branch.ko}</strong>
        <span>${stem.hanja}${branch.hanja}</span>
      </div>
      <div>${stem.yinYang} ${elementInfo[stem.element].label} / ${branch.animal}띠</div>
      <div class="element-tags">
        <span class="tag ${stem.element}">천간 ${elementInfo[stem.element].label}</span>
        <span class="tag ${branch.element}">지지 ${elementInfo[branch.element].label}</span>
      </div>
    </article>
  `;
}

function renderBars(scores) {
  const max = Math.max(...Object.values(scores), 1);

  return elementOrder.map((element) => {
    const percent = Math.max(4, (scores[element] / max) * 100);

    return `
      <div class="bar-row">
        <div class="bar-name">${elementInfo[element].label}</div>
        <div class="track"><div class="fill ${element}" style="width: ${percent}%"></div></div>
        <div class="bar-score">${scores[element]}</div>
      </div>
    `;
  }).join("");
}
