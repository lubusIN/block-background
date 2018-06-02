/**
 * Attributes Object
 */
const backgroundSettings = {
  backgroundType: {
    type: "string"
  },
  solidColor: {
    type: "string"
  },
  gradient: {
    type: "string"
  },
  mediaID: {
    type: "number"
  },
  mediaURL: {
    type: "string"
  },
  overlay: {
    type: "boolean"
  },
  overlayType: {
    type: "string"
  },
  opacity: {
    type: "number",
    default: 5
  }
};

export default backgroundSettings;
