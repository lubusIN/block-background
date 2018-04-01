/**
 * External Dependencies
 */
import assign from 'lodash.assign';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { getWrapperDisplayName } = wp.element;

/**
 * Internal Dependencies
*/
import backgroundSettings from './data/attributes';
import Inspector from './components/inspector';

/**
 * Filters registered block settings, extending attributes with background settings
 *
 * @param {Object} settings Original block settings.
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings ) {
	// Use Lodash's assign to gracefully handle if attributes are undefined
	settings.attributes = assign( settings.attributes, backgroundSettings );

	return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * background settings.
 *
 * @param {function|Component} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
function withInspectorControl( BlockEdit ) {
	const WrappedBlockEdit = ( props ) => {
		return [
			<BlockEdit key="block-edit-background" { ...props } />,
			props.isSelected && <Inspector { ... { ...props } } />,
		];
	};
	WrappedBlockEdit.displayName = getWrapperDisplayName( BlockEdit, 'block-background' );

	return WrappedBlockEdit;
}

/**
 * Override the default block element to add background wrapper props.
 *
 * @param  {Function} BlockListBlock Original component
 * @return {Function}                Wrapped component
 */
function withBackground( BlockListBlock ) {
	const WrappedComponent = ( props ) => {
		let wrapperProps = props.wrapperProps;
		wrapperProps = { ...wrapperProps, 'data-test': 'working' };

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};

	WrappedComponent.displayName = getWrapperDisplayName( BlockListBlock, 'block-background' );

	return WrappedComponent;
}

/**
 * Override props assigned to save component to inject background atttributes
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Filtered props applied to save element.
 */
function addAssignedBackground( extraProps, blockType, attributes ) {
	extraProps = { ...extraProps, 'data-test': 'Working' };
	return extraProps;
}

addFilter( 'blocks.registerBlockType', 'lubus/background/attribute', addAttribute );
addFilter( 'blocks.BlockEdit', 'lubus/background/inspector', withInspectorControl );
addFilter( 'editor.BlockListBlock', 'lubus/background/withBackground', withBackground );
addFilter( 'blocks.getSaveContent.extraProps', 'lubus/background/addAssignedBackground', addAssignedBackground );
