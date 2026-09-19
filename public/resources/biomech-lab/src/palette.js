// Shared between chart, reference bands, and anatomical highlights.
export const seriesColors = ["#6bbcff", "#c59aff", "#ffa300", "#71d6aa"];
export const sequencingSegments = ["rpv", "rta", "lar", "lha"];
export function bandColor(hex) {
  return (
    "#" +
    hex
      .slice(1)
      .match(/../g)
      .map((c) =>
        Math.round(parseInt(c, 16) * 0.32)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
