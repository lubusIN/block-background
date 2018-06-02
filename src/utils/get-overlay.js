/**
 * External Dependencies
 */
import tinycolor from "tinycolor2";

/**
 * Generate overlay
 *
 * @param {string} colors comma seperated list of colors
 * @param {number} opacity overlay opacity
 *
 * @returns {string} color overlay
 */
const getOverlay = (colors, opacity) => {
  const objColors = colors.split(",");
  const overlayAlpha = opacity / 10;

  const cssColor = objColors
    .map(colorCode => {
      const color = tinycolor(colorCode);
      color.toRgbString(); // "rgb(255, 0, 0)"
      color.setAlpha(overlayAlpha);
      color.toRgbString(); // "rgba(255, 0, 0, 0.5)"
      return color;
    })
    .join(",");

  return cssColor;
};

export default getOverlay;
