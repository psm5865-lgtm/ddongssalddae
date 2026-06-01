// 똥쌀때 앱 아이콘 PNG 생성기 (외부 의존성 없음, Node 내장 모듈만 사용)
// 실행: node brand/gen-icon.cjs
// 디자인: 세로 그라데이션 배경 + 흰 호흡 링 2개 + 가운데 점 (favicon.svg와 동일)
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const C0 = [59, 141, 251]; // #3B8DFB (top)
const C1 = [46, 115, 230]; // #2E73E6 (bottom)

function render(size, ss) {
  const M = size * ss;
  const sc = M / 512;
  const cx = M / 2;
  const cy = M / 2;
  const R1 = 160 * sc, T1 = 10 * sc, A1 = 0.32;
  const R2 = 104 * sc, T2 = 12 * sc, A2 = 0.7;
  const RD = 44 * sc;

  const big = Buffer.alloc(M * M * 4);
  for (let y = 0; y < M; y++) {
    const t = y / (M - 1);
    const br = C0[0] + (C1[0] - C0[0]) * t;
    const bg = C0[1] + (C1[1] - C0[1]) * t;
    const bb = C0[2] + (C1[2] - C0[2]) * t;
    for (let x = 0; x < M; x++) {
      let r = br, g = bg, b = bb;
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (Math.abs(d - R1) <= T1) { r += (255 - r) * A1; g += (255 - g) * A1; b += (255 - b) * A1; }
      if (Math.abs(d - R2) <= T2) { r += (255 - r) * A2; g += (255 - g) * A2; b += (255 - b) * A2; }
      if (d <= RD) { r = 255; g = 255; b = 255; }
      const i = (y * M + x) * 4;
      big[i] = Math.round(r); big[i + 1] = Math.round(g); big[i + 2] = Math.round(b); big[i + 3] = 255;
    }
  }

  // box downsample ss×ss -> size
  const out = Buffer.alloc(size * size * 4);
  const n = ss * ss;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let R = 0, G = 0, B = 0;
      for (let j = 0; j < ss; j++) {
        for (let k = 0; k < ss; k++) {
          const i = (((y * ss + j) * M) + (x * ss + k)) * 4;
          R += big[i]; G += big[i + 1]; B += big[i + 2];
        }
      }
      const o = (y * size + x) * 4;
      out[o] = Math.round(R / n); out[o + 1] = Math.round(G / n); out[o + 2] = Math.round(B / n); out[o + 3] = 255;
    }
  }
  return out;
}

// ---- PNG encode ----
const CRC = (() => {
  const t = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function encodePNG(rgba, w, h) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0;
    rgba.copy(raw, y * (1 + w * 4) + 1, y * w * 4, y * w * 4 + w * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

const outDir = path.join(__dirname);
const sizes = [
  { size: 1024, ss: 3 },
  { size: 600, ss: 3 },
  { size: 512, ss: 4 },
  { size: 192, ss: 4 },
  { size: 180, ss: 4 },
];
for (const { size, ss } of sizes) {
  const rgba = render(size, ss);
  const png = encodePNG(rgba, size, size);
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, png);
  console.log(`${file}  (${size}x${size}, ${(png.length / 1024).toFixed(1)} KB)`);
}
console.log('done');
