/**
 * External Dependencies
 */
import { assign } from "lodash";
import classnames from "classnames";

/**
 * WordPress Dependencies
 */
import { addFilter } from "@wordpress/hooks";
import { Fragment } from "@wordpress/element";
import { createHigherOrderComponent } from "@wordpress/compose";

/**
 * Internal Dependencies
 */
import backgroundSettings from "./data/attributes";
import Inspector from "./components/inspector";
import getStyle from "./utils/get-style";
import "./style.scss";

/**
 * Filters registered block settings, extending attributes with background settings
 *
 * @param {Object} settings Original block settings.
 * @return {Object} Filtered block settings.
 */
function addAttributes(settings) {
  // Use Lodash's assign to gracefully handle if attributes are undefined
  settings.attributes = assign(settings.attributes, backgroundSettings);
  return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * background settings.
 *
 * @param {function|Component} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent(BlockEdit => {
  return props => {
    return (
      <Fragment>
        {props.isSelected && <Inspector {...{ ...props }} />}
        <BlockEdit {...props} />
      </Fragment>
    );
  };
}, "withInspectorControl");

/**
 * Override the default block element to add background wrapper props.
 *
 * @param  {Function} BlockListBlock Original component
 * @return {Function}                Wrapped component
 */
const withBackground = createHigherOrderComponent(BlockListBlock => {
  return props => {
    let wrapperProps = props.wrapperProps;
    wrapperProps = {
      ...wrapperProps,
      style: getStyle(props.block.attributes)
    };

    return <BlockListBlock {...props} wrapperProps={wrapperProps} />;
  };
}, "withBackground");

/**
 * Override props assigned to save component to inject background atttributes
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Filtered props applied to save element.
 */
function addBackground(extraProps, blockType, attributes) {
  const { backgroundType, solidColor, gradient, imageID } = attributes;

  if (backgroundType && (solidColor || gradient || imageID)) {
    extraProps.style = assign(extraProps.style, getStyle(attributes));
    extraProps.className = classnames(extraProps.className, "has-background");
  }

  return extraProps;
}

addFilter(
  "blocks.registerBlockType",
  "lubus/background/attribute",
  addAttributes
);
addFilter(
  "editor.BlockEdit",
  "lubus/background/inspector",
  withInspectorControl
);
addFilter(
  "editor.BlockListBlock",
  "lubus/background/withBackground",
  withBackground
);
addFilter(
  "blocks.getSaveContent.extraProps",
  "lubus/background/addAssignedBackground",
  addBackground
);
