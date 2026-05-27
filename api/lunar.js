const DEFAULT_ENDPOINT = "https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService";

module.exports = async function handler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const date = url.searchParams.get("date") || "";
  const parts = date.split("-").map(Number);
  const solYear = url.searchParams.get("solYear") || String(parts[0] || "");
  const solMonth = url.searchParams.get("solMonth") || pad2(parts[1]);
  const solDay = url.searchParams.get("solDay") || pad2(parts[2]);

  response.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");

  if (!/^\d{4}$/.test(solYear) || !/^\d{2}$/.test(solMonth) || !/^\d{2}$/.test(solDay)) {
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
    const params = new URLSearchParams({ solYear, solMonth, solDay });
    const apiUrl = `${endpoint}/getLunCalInfo?${params.toString()}&ServiceKey=${serviceKey}`;
    const apiResponse = await fetch(apiUrl);
    const xml = await apiResponse.text();
    const resultCode = pick(xml, "resultCode");
    const resultMsg = pick(xml, "resultMsg") || pick(xml, "resultMag");

    if (!apiResponse.ok || resultCode !== "00") {
      sendJson(response, 502, { ok: false, resultCode, resultMsg, message: "음양력 API 호출에 실패했습니다." });
      return;
    }

    sendJson(response, 200, {
      ok: true,
      source: "KASI_LrsrCldInfoService.getLunCalInfo",
      item: {
        lunYear: pick(xml, "lunYear"),
        lunMonth: pick(xml, "lunMonth"),
        lunDay: pick(xml, "lunDay"),
        lunLeapmonth: pick(xml, "lunLeapmonth"),
        lunNday: pick(xml, "lunNday"),
        solYear: pick(xml, "solYear"),
        solMonth: pick(xml, "solMonth"),
        solDay: pick(xml, "solDay"),
        solLeapyear: pick(xml, "solLeapyear"),
        solWeek: pick(xml, "solWeek"),
        lunSecha: pick(xml, "lunSecha"),
        lunWolgeon: pick(xml, "lunWolgeon"),
        lunIljin: pick(xml, "lunIljin"),
        solJd: pick(xml, "solJd"),
      },
    });
  } catch (error) {
    sendJson(response, 500, { ok: false, message: "음양력 API 처리 중 오류가 발생했습니다." });
  }
};

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