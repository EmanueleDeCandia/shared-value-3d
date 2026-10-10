const intFmt = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });
const eurFmt = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });
const dec1Fmt = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const dec4Fmt = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export function fmtInt(v: number): string {
  return intFmt.format(Math.round(v));
}

export function fmtEur(v: number): string {
  return "€ " + eurFmt.format(Math.round(v));
}

export function fmtKm(v: number): string {
  return intFmt.format(Math.round(v)) + " km";
}

export function fmtT(v: number): string {
  return dec1Fmt.format(v) + " t";
}

export function fmtPct(v: number): string {
  // v is a ratio 0..1
  return intFmt.format(Math.round(v * 100)) + "%";
}

export function fmtPctRaw(v: number): string {
  return intFmt.format(Math.round(v)) + "%";
}

export function fmtK(v: number): string {
  return dec4Fmt.format(v).replace(/0+$/, "").replace(/\.$/, "");
}

export function fmtOrd(v: number): string {
  return intFmt.format(Math.round(v)) + " ord./anno";
}

export function fmtUnit(v: number): string {
  return intFmt.format(Math.round(v));
}

export type FmtKind =
  | "int"
  | "eur"
  | "km"
  | "t"
  | "pct"
  | "k"
  | "ord";

export function formatValue(kind: FmtKind, v: number): string {
  switch (kind) {
    case "int":
      return fmtInt(v);
    case "eur":
      return fmtEur(v);
    case "km":
      return fmtKm(v);
    case "t":
      return fmtT(v);
    case "pct":
      return fmtPct(v);
    case "k":
      return fmtK(v);
    case "ord":
      return fmtOrd(v);
  }
}

export function clamp(v: number, a: number, b: number): number {
  return v < a ? a : v > b ? b : v;
}
