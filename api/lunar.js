const DEFAULT_ENDPOINT = "https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService";
const ITEM_FIELDS = [
  "lunYear",
  "lunMonth",
  "lunDay",
  "lunLeapmonth",
  "lunNday",
  "solYear",
  "solMonth",
  "solDay",
  "solLeapyear",
  "solWeek",
  "lunSecha",
  "lunWolgeon",
  "lunIljin",
  "solJd",
];

module.exports = async function handler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const calendarType = url.searchParams.get("calendar") === "lunar" ? "lunar" : "solar";
  const leap = url.searchParams.get("leap") === "true";
  const date = url.searchParams.get("date") || "";
  const parts = date.split("-").map(Number);

  response.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");

  const requestDate = buildRequestDate(url, parts, calendarType);
  if (!requestDate) {
    sendJson(response, 400, { ok: false, message: "날짜 형식이 올바르지 않습니다." });
    return;
  }

  const rawServiceKey = process.env.KASI_SERVICE_KEY || process.env.KASI_SERVICE_KEY_ENCODING || process.env.KASI_SERVICE_KEY_DECODING;
  const serviceKey = normalizeServiceKey(rawServiceKey);
  if (!serviceKey) {
    sendJson(response, 500, { ok: false, message: "KASI_SERVICE_KEY 환경변수가 설정되지 않았습니다." });
    return;
  }

  try {
    const endpoint = process.env.KASI_LUNAR_API_ENDPOINT || DEFAULT_ENDPOINT;
    const operation = calendarType === "lunar" ? "getSolCalInfo" : "getLunCalInfo";
    const params = new URLSearchParams(requestDate);
    const apiUrl = `${endpoint}/${operation}?${params.toString()}&ServiceKey=${serviceKey}`;
    const apiResponse = await fetch(apiUrl);
    const xml = await apiResponse.text();
    const resultCode = pick(xml, "resultCode");
    const resultMsg = pick(xml, "resultMsg") || pick(xml, "resultMag");

    if (!apiResponse.ok || resultCode !== "00") {
      sendJson(response, 502, { ok: false, resultCode, resultMsg, message: "음양력 API 호출에 실패했습니다." });
      return;
    }

    const items = parseItems(xml);
    const item = selectItem(items, calendarType, leap);
    if (!item) {
      sendJson(response, 404, { ok: false, resultCode, resultMsg, message: "변환 가능한 음양력 정보를 찾지 못했습니다." });
      return;
    }

    sendJson(response, 200, {
      ok: true,
      source: `KASI_LrsrCldInfoService.${operation}`,
      calendar: calendarType,
      requestedLeap: calendarType === "lunar" ? (leap ? "윤" : "평") : "",
      item,
    });
  } catch (error) {
    sendJson(response, 500, { ok: false, message: "음양력 API 처리 중 오류가 발생했습니다." });
  }
};

function buildRequestDate(url, parts, calendarType) {
  if (calendarType === "lunar") {
    const lunYear = url.searchParams.get("lunYear") || String(parts[0] || "");
    const lunMonth = url.searchParams.get("lunMonth") || pad2(parts[1]);
    const lunDay = url.searchParams.get("lunDay") || pad2(parts[2]);
    if (!isValidDateParts(lunYear, lunMonth, lunDay)) return null;
    return { lunYear, lunMonth, lunDay };
  }

  const solYear = url.searchParams.get("solYear") || String(parts[0] || "");
  const solMonth = url.searchParams.get("solMonth") || pad2(parts[1]);
  const solDay = url.searchParams.get("solDay") || pad2(parts[2]);
  if (!isValidDateParts(solYear, solMonth, solDay)) return null;
  return { solYear, solMonth, solDay };
}

function isValidDateParts(year, month, day) {
  return /^\d{4}$/.test(year) && /^\d{2}$/.test(month) && /^\d{2}$/.test(day);
}

function parseItems(xml) {
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
  const targets = blocks.length ? blocks : [xml];
  return targets.map((block) => ITEM_FIELDS.reduce((acc, field) => {
    acc[field] = pick(block, field);
    return acc;
  }, {}));
}

function selectItem(items, calendarType, leap) {
  if (!items.length) return null;
  if (calendarType !== "lunar") return items[0];

  const expectedLeap = leap ? "윤" : "평";
  return items.find((item) => item.lunLeapmonth === expectedLeap) || items[0];
}

function pick(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return match ? decodeXml(match[1]) : "";
}

function decodeXml(value) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function normalizeServiceKey(value) {
  if (!value) return "";
  return value.includes("%") ? value : encodeURIComponent(value);
}

function pad2(value) {
  return Number.isFinite(value) ? String(value).padStart(2, "0") : "";
}

function sendJson(response, status, data) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(data));
}
