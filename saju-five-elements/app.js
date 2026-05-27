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

const solarTermSearchWindowDays = 3;
const solarTermBoundaries = [
  { name: "소한", month: 1, fallbackDay: 6, branch: 1, order: 12, targetLongitude: 285 },
  { name: "입춘", month: 2, fallbackDay: 4, branch: 2, order: 1, targetLongitude: 315 },
  { name: "경칩", month: 3, fallbackDay: 6, branch: 3, order: 2, targetLongitude: 345 },
  { name: "청명", month: 4, fallbackDay: 5, branch: 4, order: 3, targetLongitude: 15 },
  { name: "입하", month: 5, fallbackDay: 6, branch: 5, order: 4, targetLongitude: 45 },
  { name: "망종", month: 6, fallbackDay: 6, branch: 6, order: 5, targetLongitude: 75 },
  { name: "소서", month: 7, fallbackDay: 7, branch: 7, order: 6, targetLongitude: 105 },
  { name: "입추", month: 8, fallbackDay: 8, branch: 8, order: 7, targetLongitude: 135 },
  { name: "백로", month: 9, fallbackDay: 8, branch: 9, order: 8, targetLongitude: 165 },
  { name: "한로", month: 10, fallbackDay: 8, branch: 10, order: 9, targetLongitude: 195 },
  { name: "입동", month: 11, fallbackDay: 7, branch: 11, order: 10, targetLongitude: 225 },
  { name: "대설", month: 12, fallbackDay: 7, branch: 0, order: 11, targetLongitude: 255 },
];

const form = document.querySelector("#saju-form");
const birthDateInput = document.querySelector("#birth-date");
const birthTimeInput = document.querySelector("#birth-time");
const unknownTimeInput = document.querySelector("#unknown-time");
const calendarTypeInputs = Array.from(document.querySelectorAll?.("input[name=calendar-type]") || []);
const lunarLeapRow = document.querySelector("#lunar-leap-row");
const lunarLeapInput = document.querySelector("#lunar-leap");
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
const currentYearTitle = document.querySelector("#current-year-title");
const currentYearLuckCardsEl = document.querySelector("#current-year-luck-cards");
const advancedReportEl = document.querySelector("#advanced-report");
const calendarGridEl = document.querySelector("#calendar-grid");
const calendarNoteEl = document.querySelector("#calendar-note");
const submitButton = form.querySelector("button[type=submit]");

unknownTimeInput.addEventListener("change", () => {
  birthTimeInput.disabled = unknownTimeInput.checked;
});

calendarTypeInputs.forEach((input) => input.addEventListener("change", toggleLunarLeapField));
toggleLunarLeapField();

sampleButton.addEventListener("click", () => {
  document.querySelector("#name").value = "샘플";
  birthDateInput.value = "1995-08-15";
  birthTimeInput.value = "09:30";
  unknownTimeInput.checked = false;
  document.querySelector("input[name=calendar-type][value=solar]").checked = true;
  lunarLeapInput.checked = false;
  toggleLunarLeapField();
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
  const calendarType = getSelectedCalendarType();
  const input = {
    name: document.querySelector("#name").value.trim(),
    enteredYear: dateParts[0],
    enteredMonth: dateParts[1],
    enteredDay: dateParts[2],
    year: dateParts[0],
    month: dateParts[1],
    day: dateParts[2],
    hour: unknownTimeInput.checked ? null : timeParts[0],
    minute: unknownTimeInput.checked ? null : timeParts[1],
    gender: document.querySelector("input[name=gender]:checked")?.value || "male",
    calendarType,
    isLunarLeap: calendarType === "lunar" && lunarLeapInput.checked,
  };

  submitButton.disabled = true;
  const previousButtonText = submitButton.textContent;
  submitButton.textContent = "공식 음양력 조회 중";

  try {
    const lunarInfo = await fetchOfficialLunarInfo(birthDateInput.value, input.calendarType, input.isLunarLeap);
    const calculationDate = getCalculationDate(input, lunarInfo);
    if (!calculationDate) {
      window.alert(lunarInfo.message || "음력 날짜를 양력으로 변환하지 못했습니다. 날짜와 윤달 여부를 확인해 주세요.");
      return;
    }

    input.year = calculationDate.year;
    input.month = calculationDate.month;
    input.day = calculationDate.day;
    renderResult(calculateSaju(input, lunarInfo), input);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = previousButtonText;
  }
});

async function fetchOfficialLunarInfo(dateValue, calendarType = "solar", isLunarLeap = false) {
  try {
    const params = new URLSearchParams({
      date: dateValue,
      calendar: calendarType,
      leap: isLunarLeap ? "true" : "false",
    });
    const response = await fetch(`/api/lunar?${params.toString()}`);
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      return {
        ok: false,
        calendar: calendarType,
        message: data?.message || (calendarType === "lunar" ? "공식 음력 변환 정보를 불러오지 못했습니다." : "공식 음양력 정보를 불러오지 못했습니다."),
      };
    }

    return data;
  } catch {
    return {
      ok: false,
      calendar: calendarType,
      message: calendarType === "lunar" ? "공식 음력 변환 API에 연결할 수 없습니다." : "공식 음양력 API에 연결할 수 없어 기존 계산값으로 표시합니다.",
    };
  }
}

function getSelectedCalendarType() {
  return document.querySelector("input[name=calendar-type]:checked")?.value || "solar";
}

function toggleLunarLeapField() {
  const isLunar = getSelectedCalendarType() === "lunar";
  if (isLunar) {
    lunarLeapRow.classList.remove("hidden");
  } else {
    lunarLeapRow.classList.add("hidden");
    lunarLeapInput.checked = false;
  }
}

function getCalculationDate(input, lunarInfo) {
  if (input.calendarType !== "lunar") {
    return { year: input.year, month: input.month, day: input.day };
  }

  if (!lunarInfo?.ok || !lunarInfo.item?.solYear || !lunarInfo.item?.solMonth || !lunarInfo.item?.solDay) {
    return null;
  }

  return {
    year: Number(lunarInfo.item.solYear),
    month: Number(lunarInfo.item.solMonth),
    day: Number(lunarInfo.item.solDay),
  };
}
function getBirthInputLabel(input) {
  const calendarLabel = input.calendarType === "lunar" ? `음력${input.isLunarLeap ? " 윤달" : " 평달"}` : "양력";
  return `${calendarLabel} ${input.enteredYear ?? input.year}년 ${input.enteredMonth ?? input.month}월 ${input.enteredDay ?? input.day}일`;
}

function getSolarConversionLabel(input) {
  if (input.calendarType !== "lunar") return "";
  return `양력 변환 ${input.year}년 ${input.month}월 ${input.day}일`;
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
  const yearPillar = getYearPillar(input.year, input.month, input.day, input.hour, input.minute);
  const monthPillar = getMonthPillar(input.year, input.month, input.day, yearPillar.stemIndex, input.hour, input.minute);
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
function getYearPillar(year, month, day, hour = 12, minute = 0) {
  const birthDate = new Date(year, month - 1, day, hour ?? 12, minute ?? 0, 0, 0);
  const ipchun = getSolarTermBoundary(year, solarTermBoundaries[1]);
  const effectiveYear = birthDate < ipchun.date ? year - 1 : year;
  const index = positiveMod(effectiveYear - 4, 60);
  return {
    stemIndex: index % 10,
    branchIndex: index % 12,
    effectiveYear,
    yearCorrection: {
      termName: ipchun.name,
      termDateLabel: formatDateTime(ipchun.date),
      source: ipchun.source,
      isPrecise: ipchun.isPrecise,
      applied: effectiveYear !== year,
    },
  };
}

function getMonthPillar(year, month, day, yearStemIndex, hour = 12, minute = 0) {
  const boundary = getMonthBoundary(year, month, day, hour, minute);
  const startStemByYearStem = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stemIndex = (startStemByYearStem[yearStemIndex] + boundary.order - 1) % 10;
  return {
    stemIndex,
    branchIndex: boundary.branch,
    solarTerm: boundary,
  };
}

function getMonthBoundary(year, month, day, hour = 12, minute = 0) {
  const birthDate = new Date(year, month - 1, day, hour ?? 12, minute ?? 0, 0, 0);
  const candidates = [year - 1, year]
    .flatMap((termYear) => solarTermBoundaries.map((boundary) => getSolarTermBoundary(termYear, boundary)))
    .sort((a, b) => a.date - b.date);
  const selected = [...candidates].reverse().find((boundary) => boundary.date <= birthDate) || candidates[candidates.length - 1];
  return {
    ...selected,
    diffHours: selected ? Math.abs(birthDate - selected.date) / 3600000 : 0,
  };
}

function getSolarTermBoundary(year, boundary) {
  const calculated = getSolarTermDate(year, boundary);
  const date = calculated || new Date(year, boundary.month - 1, boundary.fallbackDay, 0, 0, 0, 0);
  return {
    ...boundary,
    year,
    date,
    day: date.getDate(),
    isPrecise: Boolean(calculated),
    source: calculated ? "태양 황경 기준 절기 시각" : "고정 날짜 fallback",
  };
}

function getSolarTermDate(year, boundary) {
  if (!Number.isFinite(boundary.targetLongitude)) return null;
  let low = new Date(year, boundary.month - 1, boundary.fallbackDay - solarTermSearchWindowDays, 0, 0, 0, 0).getTime();
  let high = new Date(year, boundary.month - 1, boundary.fallbackDay + solarTermSearchWindowDays, 23, 59, 59, 999).getTime();
  const lowDelta = getSignedSolarLongitudeDelta(new Date(low), boundary.targetLongitude);
  const highDelta = getSignedSolarLongitudeDelta(new Date(high), boundary.targetLongitude);

  if (lowDelta > 0 || highDelta < 0) return null;

  for (let i = 0; i < 52; i += 1) {
    const mid = Math.floor((low + high) / 2);
    const delta = getSignedSolarLongitudeDelta(new Date(mid), boundary.targetLongitude);
    if (delta >= 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  const date = new Date(high);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getSignedSolarLongitudeDelta(date, targetLongitude) {
  return normalizeAngle(getApparentSolarLongitude(date) - targetLongitude + 180) - 180;
}

function getApparentSolarLongitude(date) {
  const julianDay = date.getTime() / 86400000 + 2440587.5;
  const t = (julianDay - 2451545.0) / 36525;
  const geometricMeanLongitude = normalizeAngle(280.46646 + t * (36000.76983 + t * 0.0003032));
  const meanAnomaly = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const anomalyRad = degreesToRadians(meanAnomaly);
  const equationOfCenter = Math.sin(anomalyRad) * (1.914602 - t * (0.004817 + 0.000014 * t))
    + Math.sin(2 * anomalyRad) * (0.019993 - 0.000101 * t)
    + Math.sin(3 * anomalyRad) * 0.000289;
  const trueLongitude = geometricMeanLongitude + equationOfCenter;
  const omega = 125.04 - 1934.136 * t;
  return normalizeAngle(trueLongitude - 0.00569 - 0.00478 * Math.sin(degreesToRadians(omega)));
}

function normalizeAngle(angle) {
  return positiveMod(angle, 360);
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
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
  renderCalendarInfo(result, input);
  barsEl.innerHTML = renderBars(result.scores);

  const chips = result.deficient
    .map((element) => `<span class="deficient-chip ${element}">${elementInfo[element].label}</span>`)
    .join("");
  const messages = result.deficient.map((element) => elementInfo[element].message).join(" ");

  deficientTitle.innerHTML = chips;
  deficientCopy.textContent = messages;
  stoneCardsEl.innerHTML = renderStoneRecommendations(result.deficient);
  const currentYearLuck = generateCurrentYearLuckReadings(result, input);
  currentYearTitle.textContent = `${currentYearLuck.year}년 ${currentYearLuck.pillarName} 올해 운세`;
  currentYearLuckCardsEl.innerHTML = renderLuckCards(currentYearLuck.readings);
  advancedReportEl.innerHTML = renderAdvancedReport(result, input);
  detailedReadingEl.innerHTML = generateDetailedReading(result, input)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}


function renderCalendarInfo(result, input) {
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
  const inputCalendarText = input.calendarType === "lunar" ? `음력 ${input.isLunarLeap ? "윤달" : "평달"}` : "양력";
  const officialText = result.usesOfficialDayPillar ? "공식 일진을 일주에 반영" : "공식 일진 표시만 반영";

  calendarGridEl.innerHTML = [
    { label: "입력 달력", value: inputCalendarText },
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

  calendarNoteEl.textContent = input.calendarType === "lunar"
    ? "입력한 음력 날짜를 한국천문연구원 음양력 정보제공 서비스로 양력 변환한 뒤 사주 계산에 반영했습니다."
    : "입력한 양력 날짜의 공식 음력 정보와 일진을 한국천문연구원 음양력 정보제공 서비스 기준으로 확인했습니다.";
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
const symbolicStarDescriptions = {
  도화: { type: "관계/표현", desc: "매력, 관계성, 표현력이 드러나는 자리입니다. 사람을 끌어들이는 힘으로 쓰되 감정 소모를 조절하는 것이 좋습니다." },
  역마: { type: "이동/변화", desc: "이동, 확장, 변화에 반응하는 자리입니다. 환경을 바꾸거나 새로운 시장을 탐색할 때 힘이 납니다." },
  화개: { type: "몰입/전문성", desc: "취향, 연구, 예술성, 깊은 몰입을 만들 수 있는 자리입니다. 혼자 쌓는 실력이 강점이 됩니다." },
  장성: { type: "주도/책임", desc: "주도권과 책임감이 살아나는 자리입니다. 앞에서 정리하고 이끄는 역할에 힘이 실립니다." },
  천을귀인: { type: "조력/완충", desc: "도움, 보호, 문제 완충의 상징으로 봅니다. 사람과 제도적 지원을 잘 활용하면 좋습니다." },
  문창: { type: "학습/기획", desc: "학습, 문서, 기획, 말과 글의 정리에 유리한 자리입니다. 지식을 구조화할수록 빛이 납니다." },
  양인: { type: "결단/추진", desc: "강한 결단력과 돌파력을 뜻합니다. 속도와 힘은 장점이지만 과격한 판단은 조절이 필요합니다." },
  괴강: { type: "집중/독립", desc: "주관, 집중력, 독립성이 강하게 잡히는 조합입니다. 기준을 세우면 큰 추진력이 됩니다." },
  공망: { type: "비움/재정비", desc: "채워지지 않은 빈자리처럼 느껴질 수 있는 지점입니다. 집착보다 재정비와 유연한 운영이 도움이 됩니다." },
};
const branchGroupStarTargets = {
  도화: { water: 9, fire: 3, metal: 6, wood: 0 },
  역마: { water: 2, fire: 8, metal: 11, wood: 5 },
  화개: { water: 4, fire: 10, metal: 1, wood: 7 },
  장성: { water: 0, fire: 6, metal: 9, wood: 3 },
};
const noblemanBranchesByStem = {
  0: [1, 7], 4: [1, 7], 6: [1, 7],
  1: [0, 8], 5: [0, 8],
  2: [11, 9], 3: [11, 9],
  8: [3, 5], 9: [3, 5],
  7: [6, 2],
};
const literatureStarByStem = { 0: 5, 1: 6, 2: 8, 4: 8, 3: 9, 5: 9, 6: 11, 7: 0, 8: 2, 9: 3 };
const bladeStarByStem = { 0: 3, 1: 2, 2: 6, 4: 6, 3: 5, 5: 5, 6: 9, 7: 8, 8: 0, 9: 11 };
const strongPillarStars = [
  { stemIndex: 6, branchIndex: 4 },
  { stemIndex: 6, branchIndex: 10 },
  { stemIndex: 8, branchIndex: 4 },
  { stemIndex: 4, branchIndex: 10 },
];

function generateAdvancedReportData(pillars, scores, input) {
  const dayStemIndex = pillars[2].stemIndex;
  const yearStem = stems[pillars[0].stemIndex];
  const forward = (input.gender === "male" && yearStem.yinYang === "양") || (input.gender === "female" && yearStem.yinYang === "음");
  const luckStart = calculateGreatLuckStart(input, forward);
  const solarCorrection = buildSolarCorrectionSummary(pillars);
  return {
    displayPillars: getDisplayPillars(pillars),
    deepRows: buildDeepRows(pillars, dayStemIndex),
    greatLuck: buildGreatLuck(pillars[1], pillars[0].branchIndex, dayStemIndex, input, forward, luckStart),
    yearlyLuck: buildYearlyLuck(pillars[0].branchIndex, dayStemIndex),
    monthlyLuck: buildMonthlyLuck(dayStemIndex, input.year),
    relations: buildRelationSummary(pillars),
    sals: buildSalSummary(pillars),
    symbolicStars: buildSymbolicStarSummary(pillars),
    direction: forward ? "순행" : "역행",
    luckStart,
    solarCorrection,
    currentAge: getFullAge(input),
    scores,
  };
}

function buildSolarCorrectionSummary(pillars) {
  const yearCorrection = pillars[0].yearCorrection || {};
  const monthTerm = pillars[1].solarTerm || {};
  const nearBoundary = Number.isFinite(monthTerm.diffHours) && monthTerm.diffHours <= 24;
  const source = yearCorrection.isPrecise && monthTerm.isPrecise ? "시각 보정" : "날짜 fallback";
  return {
    source,
    appliedLabel: source,
    yearTermName: yearCorrection.termName || "입춘",
    yearTermDateLabel: yearCorrection.termDateLabel || "-",
    yearApplied: Boolean(yearCorrection.applied),
    effectiveYear: pillars[0].effectiveYear || "-",
    monthTermName: monthTerm.name || "-",
    monthTermDateLabel: monthTerm.date ? formatDateTime(monthTerm.date) : "-",
    monthBranch: monthTerm.branch !== undefined ? `${branches[monthTerm.branch].hanja}${branches[monthTerm.branch].ko}` : "-",
    nearBoundary,
    note: nearBoundary ? "절기 경계 24시간 이내 출생으로 월주 판별에 절기 시각을 우선 반영했습니다." : "절기 시각 기준으로 월주와 년주 경계를 판별했습니다.",
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
      return { label, ganji: "-", tenGod: "-", mainHiddenTenGod: "-", hiddenTenGods: "-", hiddenStems: "-", hiddenStemDetail: "-", hiddenStemItems: [], lifeStage: "-", branchSal: "-", specialSals: "출생시간 확인 필요" };
    }
    const hidden = hiddenStemMap[pillar.branchIndex] || [];
    const hiddenStemItems = hidden.map((stemIndex) => ({ stem: stems[stemIndex].hanja, tenGod: getTenGod(dayStemIndex, stemIndex) }));
    return {
      label,
      ganji: getPillarHanja(pillar),
      tenGod: getTenGod(dayStemIndex, pillar.stemIndex),
      mainHiddenTenGod: hidden[0] !== undefined ? getTenGod(dayStemIndex, hidden[0]) : "-",
      hiddenTenGods: hiddenStemItems.map((item) => item.tenGod).join(", "),
      hiddenStems: hiddenStemItems.map((item) => item.stem).join(""),
      hiddenStemDetail: hiddenStemItems.map((item) => `${item.stem}(${item.tenGod})`).join(", "),
      hiddenStemItems,
      lifeStage: getLifeStage(dayStemIndex, pillar.branchIndex),
      branchSal: getTwelveSal(pillars[0].branchIndex, pillar.branchIndex),
      specialSals: getSpecialSals(pillars, pillar).join(", ") || "-",
    };
  });
}

function buildGreatLuck(monthPillar, yearBranchIndex, dayStemIndex, input, forward, luckStart) {
  const monthCycle = getCycleIndex(monthPillar);
  const currentAge = getFullAge(input);
  const rows = Array.from({ length: 10 }, (_, index) => {
    const startMonths = luckStart.totalMonths + index * 120;
    const cycleIndex = positiveMod(monthCycle + (forward ? index + 1 : -(index + 1)), 60);
    const pillar = cyclePillar(cycleIndex);
    const startDate = addMonths(getBirthDate(input), startMonths);
    const startAgeYears = startMonths / 12;
    return {
      startMonths,
      startAgeYears,
      startAgeLabel: formatAgeFromMonths(startMonths),
      ganji: getPillarHanja(pillar),
      stem: stems[pillar.stemIndex].hanja,
      branch: branches[pillar.branchIndex].hanja,
      startYear: startDate.getFullYear(),
      startDateLabel: formatYearMonth(startDate),
      direction: forward ? "순행" : "역행",
      current: currentAge >= startAgeYears && currentAge < startAgeYears + 10 ? "●" : "",
      sal: getTwelveSal(yearBranchIndex, pillar.branchIndex),
      lifeStage: getLifeStage(dayStemIndex, pillar.branchIndex),
    };
  });
  return forward ? rows : rows.reverse();
}

function calculateGreatLuckStart(input, forward) {
  const birthDate = getBirthDate(input);
  const termCandidates = [birthDate.getFullYear() - 1, birthDate.getFullYear(), birthDate.getFullYear() + 1]
    .flatMap((year) => solarTermBoundaries.map((boundary) => getSolarTermBoundary(year, boundary)))
    .sort((a, b) => a.date - b.date);
  const target = forward
    ? termCandidates.find((term) => term.date > birthDate)
    : [...termCandidates].reverse().find((term) => term.date < birthDate);
  const diffMs = target ? Math.abs(target.date - birthDate) : 0;
  const diffDays = diffMs / 86400000;
  const totalMonths = Math.max(1, Math.round(diffDays * 4));

  return {
    totalMonths,
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    ageLabel: formatAgeFromMonths(totalMonths),
    termName: target?.name || "-",
    termDateLabel: target ? formatDateTime(target.date) : "-",
    diffDays,
    source: target?.source || "-",
  };
}

function getBirthDate(input) {
  return new Date(input.year, input.month - 1, input.day, input.hour ?? 12, input.minute ?? 0, 0, 0);
}

function getFullAge(input) {
  const today = new Date();
  let age = today.getFullYear() - input.year;
  const birthdayThisYear = new Date(today.getFullYear(), input.month - 1, input.day);
  if (today < birthdayThisYear) age -= 1;
  return Math.max(0, age);
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function formatAgeFromMonths(totalMonths) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `만 ${months}개월`;
  if (months === 0) return `만 ${years}년`;
  return `만 ${years}년 ${months}개월`;
}

function formatYearMonth(date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatDateTime(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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
  const symbolicStars = buildSymbolicStarSummary(pillars);
  return getDisplayPillars(pillars).map(({ label, pillar }) => {
    if (pillar.empty) return { label, branchSal: "-", ganSal: "-", symbolic: "출생시간 확인 필요", special: "출생시간 확인 필요", all: "-" };
    const branchSal = getTwelveSal(pillars[0].branchIndex, pillar.branchIndex);
    const symbolic = symbolicStars
      .filter((star) => star.positions.includes(label))
      .map((star) => star.name)
      .join(", ") || "-";
    const special = getSpecialSals(pillars, pillar).join(", ") || "-";
    return { label, branchSal, ganSal: "-", symbolic, special, all: [branchSal, symbolic, special].filter((value) => value && value !== "-").join(", ") || "-" };
  });
}

function buildSymbolicStarSummary(pillars) {
  const known = getDisplayPillars(pillars).filter(({ pillar }) => !pillar.empty);
  const dayPillar = pillars[2];
  const yearPillar = pillars[0];
  const collected = [];

  [
    { label: "년지", branchIndex: yearPillar.branchIndex },
    { label: "일지", branchIndex: dayPillar.branchIndex },
  ].forEach((basis) => {
    const group = getBranchGroup(basis.branchIndex);
    Object.entries(branchGroupStarTargets).forEach(([name, targets]) => {
      addSymbolicStar(collected, known, name, `${basis.label} ${branches[basis.branchIndex].hanja} 기준`, [targets[group]]);
    });
  });

  addSymbolicStar(collected, known, "천을귀인", `일간 ${stems[dayPillar.stemIndex].hanja} 기준`, noblemanBranchesByStem[dayPillar.stemIndex] || []);
  addSymbolicStar(collected, known, "문창", `일간 ${stems[dayPillar.stemIndex].hanja} 기준`, [literatureStarByStem[dayPillar.stemIndex]]);
  addSymbolicStar(collected, known, "양인", `일간 ${stems[dayPillar.stemIndex].hanja} 기준`, [bladeStarByStem[dayPillar.stemIndex]]);
  addStrongPillarStar(collected, known);
  addEmptyBranchStar(collected, known, dayPillar);

  return mergeSymbolicStars(collected).slice(0, 8);
}

function addSymbolicStar(collected, known, name, basis, targetBranches) {
  const normalizedTargets = targetBranches.filter((branchIndex) => branchIndex !== undefined);
  if (!normalizedTargets.length) return;
  const positions = known
    .filter(({ pillar }) => normalizedTargets.includes(pillar.branchIndex))
    .map(({ label }) => label);
  if (!positions.length) return;
  const meta = symbolicStarDescriptions[name];
  collected.push({
    name,
    type: meta.type,
    basis,
    positions,
    target: normalizedTargets.map((branchIndex) => `${branches[branchIndex].hanja}${branches[branchIndex].ko}`).join(", "),
    desc: meta.desc,
  });
}

function addStrongPillarStar(collected, known) {
  const positions = known
    .filter(({ pillar }) => strongPillarStars.some((rule) => rule.stemIndex === pillar.stemIndex && rule.branchIndex === pillar.branchIndex))
    .map(({ label }) => label);
  if (!positions.length) return;
  const meta = symbolicStarDescriptions.괴강;
  collected.push({ name: "괴강", type: meta.type, basis: "간지 조합 기준", positions, target: "庚辰, 庚戌, 壬辰, 戊戌", desc: meta.desc });
}

function addEmptyBranchStar(collected, known, dayPillar) {
  const emptyBranches = getEmptyBranches(dayPillar);
  const positions = known
    .filter(({ pillar }) => emptyBranches.includes(pillar.branchIndex))
    .map(({ label }) => label);
  if (!positions.length) return;
  const meta = symbolicStarDescriptions.공망;
  collected.push({
    name: "공망",
    type: meta.type,
    basis: `일주 ${getPillarHanja(dayPillar)} 순공 기준`,
    positions,
    target: emptyBranches.map((branchIndex) => `${branches[branchIndex].hanja}${branches[branchIndex].ko}`).join(", "),
    desc: meta.desc,
  });
}

function mergeSymbolicStars(stars) {
  const map = new Map();
  stars.forEach((star) => {
    const key = `${star.name}:${star.positions.join("/")}:${star.target}`;
    if (!map.has(key)) {
      map.set(key, { ...star, basisList: [star.basis] });
    } else {
      map.get(key).basisList.push(star.basis);
    }
  });
  return Array.from(map.values()).map((star) => ({ ...star, basis: [...new Set(star.basisList)].join(" · ") }));
}

function getBranchGroup(branchIndex) {
  if ([8, 0, 4].includes(branchIndex)) return "water";
  if ([2, 6, 10].includes(branchIndex)) return "fire";
  if ([5, 9, 1].includes(branchIndex)) return "metal";
  return "wood";
}

function getEmptyBranches(dayPillar) {
  const branchAtJia = positiveMod(dayPillar.branchIndex - dayPillar.stemIndex, 12);
  return [positiveMod(branchAtJia - 2, 12), positiveMod(branchAtJia - 1, 12)];
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
    ["지장간 상세", ...data.deepRows.map((row) => row.hiddenStemDetail)],
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
    ["주요 신살", ...data.sals.map((row) => row.symbolic)],
    ["특수 신살", ...data.sals.map((row) => row.special)],
    ["종합 신살", ...data.sals.map((row) => row.all)],
  ];
  const strongest = getElementsByScore(result.scores, Math.max(...Object.values(result.scores))).map((element) => elementInfo[element].label).join(", ");
  const deficient = result.deficient.map((element) => elementInfo[element].label).join(", ");
  const dayPillarName = getPillarHanja(result.pillars[2]);
  const hourPillarName = result.pillars[3].empty ? "시간 미입력" : getPillarHanja(result.pillars[3]);
  const currentYearLuck = data.yearlyLuck.find((row) => row.year === new Date().getFullYear()) || data.yearlyLuck[data.yearlyLuck.length - 1];
  const symbolicStarNames = data.symbolicStars.length ? data.symbolicStars.map((star) => star.name).slice(0, 3).join(", ") : "특이 신살 약함";
  const overviewItems = [
    { label: "일주", value: dayPillarName, detail: "나 자신과 관계 방식" },
    { label: "시주", value: hourPillarName, detail: "내면과 후반 흐름" },
    { label: "강한 오행", value: strongest, detail: "자주 드러나는 기운" },
    { label: "보완 오행", value: deficient, detail: "의식적으로 채울 기운" },
    { label: "절기 보정", value: data.solarCorrection.appliedLabel, detail: `월주 ${data.solarCorrection.monthTermName}` },
    { label: "주요 신살", value: symbolicStarNames, detail: "위치와 활용 포인트" },
    { label: "대운", value: data.direction, detail: `초운 ${data.luckStart.ageLabel}` },
    { label: "올해 세운", value: currentYearLuck.ganji, detail: `${currentYearLuck.year}년 · ${currentYearLuck.sal}` },
  ];
  return `
    <div class="report-note">입력 기준: ${escapeHtml(genderText)} · ${escapeHtml(getBirthInputLabel(input))}${input.calendarType === "lunar" ? ` · ${escapeHtml(getSolarConversionLabel(input))}` : ""} · ${input.hour === null ? "출생시간 모름" : `${escapeHtml(String(input.hour).padStart(2, "0"))}:${escapeHtml(String(input.minute).padStart(2, "0"))}`} · 대운 방향 ${escapeHtml(data.direction)} · 초운 ${escapeHtml(data.luckStart.ageLabel)} · 대운 기준절기 ${escapeHtml(data.luckStart.termName)}(${escapeHtml(data.luckStart.termDateLabel)}) · 현재 만 ${escapeHtml(data.currentAge)}세</div>
    ${renderSolarCorrection(data.solarCorrection)}
    ${renderReportOverview(overviewItems)}
    ${renderReportTable("사주 4주", pillarColumns, [pillarValues])}
    ${renderReportTable("오행 분포", elementOrder.map((element) => elementInfo[element].label), [elementValues])}
    ${renderReportTable("심층 분석: 십성 & 12운성", ["구분", ...pillarColumns], deepRows)}
    ${renderReportTable("대운", ["시작나이", "간지", "천간", "지지", "시작시점", "방향", "현재", "신살", "12운성"], data.greatLuck.map((row) => [row.startAgeLabel, row.ganji, row.stem, row.branch, row.startDateLabel, row.direction, row.current, row.sal, row.lifeStage]))}
    ${renderReportTable("세운", ["연도", "간지", "천간", "지지", "신살", "12운성"], data.yearlyLuck.map((row) => [row.year, row.ganji, row.stem, row.branch, row.sal, row.lifeStage]))}
    ${renderReportTable("월운", ["월", "월명", "간지", "천간", "지지", "신살", "12운성", "천간십성", "지지십성", "절기"], data.monthlyLuck.map((row) => [row.month, row.name, row.ganji, row.stem, row.branch, row.sal, row.lifeStage, row.stemTenGod, row.branchTenGod, row.term]))}
    ${renderReportTable("천간 특수관계", ["유형", "관계쌍", "기둥", "설명"], heavenlyRows)}
    ${renderReportTable("지지 형·충·회·합 해석", ["구분", ...pillarColumns], branchRelationRows)}
    ${renderReportTable("종합 신살", ["구분", ...pillarColumns], salRows)}
  `;
}

function renderHiddenStemStructure(rows) {
  return `
    <div class="structure-grid">
      ${rows.map((row) => `
        <article class="structure-card">
          <div class="structure-card-head">
            <span>${escapeHtml(row.label)}</span>
            <strong>${escapeHtml(row.ganji)}</strong>
            <em>${escapeHtml(row.tenGod)}</em>
          </div>
          <div class="hidden-chip-row">
            ${row.hiddenStemItems.length ? row.hiddenStemItems.map((item) => `<span class="hidden-chip"><b>${escapeHtml(item.stem)}</b>${escapeHtml(item.tenGod)}</span>`).join("") : `<span class="hidden-chip muted">${escapeHtml(row.hiddenStemDetail)}</span>`}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderSymbolicStars(stars) {
  if (!stars.length) {
    return `
      <div class="symbolic-star-grid single">
        <article class="symbolic-star-card">
          <div><span>주요 신살</span><strong>강하게 드러난 항목 없음</strong></div>
          <p>현재 원국에서는 우선 적용 신살이 강하게 겹치지 않습니다. 기본 오행과 십성 구조를 중심으로 해석하면 좋습니다.</p>
        </article>
      </div>
    `;
  }
  return `
    <div class="symbolic-star-grid">
      ${stars.map((star) => `
        <article class="symbolic-star-card">
          <div>
            <span>${escapeHtml(star.type)}</span>
            <strong>${escapeHtml(star.name)}</strong>
          </div>
          <dl>
            <div><dt>위치</dt><dd>${escapeHtml(star.positions.join(", "))}</dd></div>
            <div><dt>기준</dt><dd>${escapeHtml(star.basis)}</dd></div>
            <div><dt>대상</dt><dd>${escapeHtml(star.target)}</dd></div>
          </dl>
          <p>${escapeHtml(star.desc)}</p>
        </article>
      `).join("")}
    </div>
  `;
}
function renderSolarCorrection(correction) {
  return `
    <div class="solar-correction-card">
      <div>
        <span>절기 보정</span>
        <strong>${escapeHtml(correction.appliedLabel)}</strong>
      </div>
      <dl>
        <div><dt>년주 기준</dt><dd>${escapeHtml(correction.yearTermName)} · ${escapeHtml(correction.yearTermDateLabel)} · 적용년 ${escapeHtml(correction.effectiveYear)}</dd></div>
        <div><dt>월주 기준</dt><dd>${escapeHtml(correction.monthTermName)} · ${escapeHtml(correction.monthTermDateLabel)} · ${escapeHtml(correction.monthBranch)}</dd></div>
        <div><dt>판별 메모</dt><dd>${escapeHtml(correction.note)}</dd></div>
      </dl>
    </div>
  `;
}

function renderReportOverview(items) {
  return `
    <div class="report-overview">
      ${items.map((item) => `
        <div class="report-overview-card">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
          <em>${escapeHtml(item.detail)}</em>
        </div>
      `).join("")}
    </div>
  `;
}
function renderReportTable(title, columns, rows) {
  return `
    <div class="report-table-block">
      <h4><span>${escapeHtml(title)}</span><small>${rows.length}행</small></h4>
      <div class="report-table-wrap">
        <table class="report-table">
          <thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell ?? "")}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
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
    `${name}님의 사주는 ${getBirthInputLabel(input)}을 기준으로 ${input.calendarType === "lunar" ? `${getSolarConversionLabel(input)}로 변환해 ` : ""}${pillarSummary}의 흐름으로 계산됩니다. ${officialCalendarText} 사주는 태어난 해, 달, 날, 시간을 각각 하나의 기둥으로 세우고, 각 기둥의 천간과 지지를 합쳐 여덟 글자로 사람의 기질과 균형을 살피는 방식입니다. 여기서 년주는 성장 배경과 외부에 보이는 첫인상, 월주는 태어난 계절과 사회적 무대, 일주는 자기 자신과 관계 방식, 시주는 내면의 가능성과 후반 흐름을 보는 기준으로 활용됩니다.`,
    `가장 중심이 되는 글자는 일주의 천간, 즉 일간입니다. ${name}님의 일간은 ${dayStem.ko}${dayStem.hanja}, ${dayStem.yinYang} ${elementInfo[dayStem.element].label}의 성향으로 표시됩니다. 일간은 사주에서 나 자신을 상징하므로 성격을 볼 때 가장 먼저 살피는 기준입니다. 일지는 ${dayBranch.ko}${dayBranch.hanja}로, 일간이 실제 관계와 생활 속에서 어떤 환경을 만나는지 보여줍니다. 다만 일간 하나만으로 성격을 단정하면 해석이 얕아지므로 주변 기둥들이 일간을 돕는지, 소모시키는지, 균형을 잡아주는지를 함께 봐야 합니다.`,
    `이번 결과의 오행 점수는 총 ${totalScore}점 기준으로 ${scoreSummary}입니다. 점수가 높은 오행은 사주 안에서 자주 드러나는 기운이며, 낮은 오행은 의식적으로 보완하면 균형감을 얻기 쉬운 기운입니다. 현재 가장 강하게 나타나는 기운은 ${strongestLabels}이고, 상대적으로 부족하게 잡힌 기운은 ${weakestLabels}입니다. 강한 기운은 장점으로 쓰이면 추진력과 개성이 되지만, 지나치면 고집이나 피로감으로 나타날 수 있습니다. 부족한 기운은 약점이라는 뜻이 아니라 삶에서 더 의식적으로 길러야 할 방향으로 이해하는 것이 좋습니다.`,
    `년주 ${getPillarName(yearPillar)}는 ${elementInfo[stems[yearPillar.stemIndex].element].label}의 천간과 ${elementInfo[branches[yearPillar.branchIndex].element].label}의 지지를 품고 있어 바깥 환경과 첫인상의 색을 만듭니다. 월주 ${getPillarName(monthPillar)}는 계절의 힘을 나타내기 때문에 직업적 태도, 사회성, 성장 방식에 큰 영향을 준다고 봅니다. 같은 일간이라도 월주가 어떤 오행을 가지고 있느냐에 따라 표현 방식이 달라집니다. 그래서 생년월일을 입력해 사주를 볼 때는 단순히 띠만 보는 것보다 월주의 계절감과 일간의 관계를 함께 읽는 것이 훨씬 중요합니다.`,
    `${timeText} 상세 리포트에는 각 지지 속 지장간과 일간 기준 십성을 함께 표시했습니다. 지장간은 겉으로 바로 보이는 천간보다 생활 속에서 천천히 드러나는 숨은 기운으로 볼 수 있고, 십성은 그 기운이 나에게 친구, 표현, 재성, 관성, 인성 중 어떤 역할로 작동하는지 살피는 기준입니다. 주요 신살은 도화, 역마, 화개, 장성, 천을귀인, 문창, 양인, 괴강, 공망을 우선 적용하되 불안한 단정 대신 위치와 활용 포인트 중심으로 정리했습니다.`,
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
