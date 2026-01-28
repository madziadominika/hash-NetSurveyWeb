// src/utils/fspl.js

// Convierte canal Wi-Fi a frecuencia en MHz
export function channelToFrequencyMHz(channel) {
  const ch = Number(channel);
  if (!Number.isFinite(ch)) return null;

  // 2,4 GHz (canales 1-13)
  if (ch >= 1 && ch <= 13) {
    return 2412 + 5 * (ch - 1); // MHz
  }
  if (ch === 14) return 2484;

  // 5 GHz (mapa típico suficiente para tu proyecto)
  const map5GHz = {
    36: 5180,
    40: 5200,
    44: 5220,
    48: 5240,
    52: 5260,
    56: 5280,
    60: 5300,
    64: 5320,
    100: 5500,
    104: 5520,
    108: 5540,
    112: 5560,
    116: 5580,
    120: 5600,
    124: 5620,
    128: 5640,
    132: 5660,
    136: 5680,
    140: 5700,
    149: 5745,
    153: 5765,
    157: 5785,
    161: 5805,
    165: 5825,
  };

  return map5GHz[ch] ?? null;
}

// FSPL en dB para frecuencia (MHz) y distancia (m)
export function fsplDb(frequencyMHz, distanceMeters = 10) {
  if (!frequencyMHz || !distanceMeters) return null;

  const dKm = distanceMeters / 1000; // pasar a km
  // Fórmula estándar: FSPL(dB) = 32.44 + 20*log10(d[km]) + 20*log10(f[MHz])
  const fspl =
    32.44 + 20 * Math.log10(dKm) + 20 * Math.log10(frequencyMHz);

  return fspl;
}

// Resumen FSPL por ubicación a partir del CSV
export function summarizeFsplByLocation(csvData = []) {
  const byLocation = new Map();

  for (const row of csvData) {
    const rawLoc =
      row.Ubicacion ??
      row.ubicacion ??
      row["Ubicación"] ??
      row.location ??
      "";

    const ubicacion = String(rawLoc || "").trim();
    if (!ubicacion) continue;

    const canalRaw =
      row.Canal ?? row.canal ?? row.channel ?? row.CHANNEL ?? row.canal_wifi;
    const channel = Number(canalRaw);
    if (!Number.isFinite(channel)) continue;

    const freq = channelToFrequencyMHz(channel);
    if (!freq) continue;

    const fspl = fsplDb(freq, 10); // 10 metros fijos para tu proyecto

    const key = ubicacion.toLowerCase();
    if (!byLocation.has(key)) {
      byLocation.set(key, {
        ubicacion,
        freqs: new Set(),
        fsplValues: [],
      });
    }

    const entry = byLocation.get(key);
    entry.freqs.add(Math.round(freq)); // redondeo a MHz enteros
    if (fspl != null) entry.fsplValues.push(fspl);
  }

  const result = Array.from(byLocation.values()).map((entry) => {
    const freqsArr = Array.from(entry.freqs).sort((a, b) => a - b);
    const frequenciesText = freqsArr.length
      ? freqsArr.join(", ")
      : "—";

    let fsplText = "—";
    if (entry.fsplValues.length) {
      const avg =
        entry.fsplValues.reduce((acc, v) => acc + v, 0) /
        entry.fsplValues.length;
      fsplText = avg.toFixed(1); // ej: 60.2 dB
    }

    return {
      ubicacion: entry.ubicacion,
      frequenciesText,
      fsplText,
    };
  });

  // Orden alfabético por ubicación
  result.sort((a, b) =>
    a.ubicacion.localeCompare(b.ubicacion, "es")
  );

  return result;
}
