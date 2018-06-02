/**
 * Internal Dependencies
 */
import getOverlay from "./get-overlay";

/**
 * Generate Style Object for background
 */

function getStyle(attributes) {
  // Block Settings
  const {
    backgroundType,
    solidColor,
    gradient,
    mediaURL,
    overlay,
    overlayType,
    opacity
  } = attributes;

  // Style
  let style = {};

  switch (backgroundType) {
    case "color":
      style = { background: solidColor };
      break;

    case "gradient":
      style = { background: `linear-gradient(to bottom, ${gradient})` };
      break;

    case "image":
      // TOOD: Refactor
      if (overlay && ("color" === overlayType || "gradient" === overlayType)) {
        switch (overlayType) {
          case "color":
            if (solidColor) {
              const overlaySolid = `${solidColor}, ${solidColor}`;
              style = {
                background: `linear-gradient(to bottom, ${getOverlay(
                  overlaySolid,
                  opacity
                )} ), url( ${mediaURL} )`,
                backgroundSize: "cover"
              };
            } else {
              style = {
                background: `url( ${mediaURL} )`,
                backgroundSize: "cover"
              };
            }
            break;

          case "gradient":
            if (gradient) {
              style = {
                background: `linear-gradient(to bottom, ${getOverlay(
                  gradient,
                  opacity
                )}), url( ${mediaURL} )`,
                backgroundSize: "cover"
              };
            } else {
              style = {
                background: `url( ${mediaURL} )`,
                backgroundSize: "cover"
              };
            }

            break;
        }
      } else {
        style = {
          background: `url( ${mediaURL} )`,
          backgroundSize: "cover"
        };
      }

      break;
  }
  return style;
}

export default getStyle;
