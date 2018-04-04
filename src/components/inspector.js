/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const {
	InspectorControls,
	ColorPalette,
	MediaUpload,
} = wp.blocks;
const {
	PanelBody,
	Button,
	ButtonGroup,
	SelectControl,
	ToggleControl,
	RangeControl,
} = wp.components;
const { Fragment } = wp.element;

/**
 * Internal Dependencies
 */
import options from '../data/options';
import gradients from '../data/gradients';

/**
 *
 * @param {object} props component props
 * @returns {object} Component
 */
const Inspector = ( props ) => {
	// Attributes
	const { attributes, setAttributes } = props;
	const {
		backgroundType,
		solidColor,
		gradient,
		mediaID,
		mediaURL,
		overlay,
		overlayType,
		opacity,
	} = attributes;

	// Event(s)
	const onChangeBackgroundType = ( newType ) => {
		setAttributes( {
			backgroundType: newType,
			overlay: undefined,
			overlayType: undefined,
		} );
	};
	const onChangeSolidColor = ( newColor ) => {
		setAttributes( { solidColor: newColor } );
	};
	const onChangeGradient = ( newGradient ) => {
		setAttributes( { gradient: newGradient } );
	};
	const onSelectImage = ( media ) => {
		setAttributes( {
			mediaID: media.id,
			mediaURL: media.url,
		} );
	};
	const onRemoveImage = ( ) => {
		setAttributes( {
			mediaID: undefined,
			mediaURL: undefined,
		} );
	};
	const onChangeOverlay = ( newOverlay ) => {
		setAttributes( { overlay: newOverlay } );
	};
	const onChangeOverlayType = ( newType ) => {
		setAttributes( { overlayType: newType } );
	};
	const onChangeOpacity = ( newOpacity ) => {
		setAttributes( { opacity: newOpacity } );
	};

	// Controls
	const colorControl = <ColorPalette
		value={ solidColor }
		onChange={ onChangeSolidColor }
	/>;

	const gradientControl = <SelectControl
		label={ __( 'Gradient Presets' ) }
		options={ gradients.map( ( preset ) => {
			return {
				value: preset.colors,
				label: preset.name,
			};
		} ) }
		value={ gradient }
		onChange={ onChangeGradient }
	/>;

	// Inspector Controls
	return (
		<InspectorControls>
			<PanelBody title={ __( 'Background Settings' ) } initialOpen={ true } >
				<ButtonGroup aria-label={ __( 'Background Type' ) }>
					{
						options.backgroundType.map( ( type ) => {
							return (
								<Button
									key={ type.label }
									isLarge
									isPrimary={ backgroundType === type.value }
									aria-pressed={ backgroundType === type.value }
									onClick={ ( ) => onChangeBackgroundType( type.value ) }
								>
									{ type.label }
								</Button>
							);
						} )
					}
				</ButtonGroup>

				{ 'color' === backgroundType && colorControl }

				{ 'gradient' === backgroundType && gradientControl }

				{ 'image' === backgroundType &&
					(
						<MediaUpload
							key="mediaupload"
							onSelect={ onSelectImage }
							type="image"
							value={ mediaID }
							render={
								( { open } ) => (
									<Fragment>
										<Button
											className="button-link"
											onClick={ open }>
											{ ! mediaID ?
												__( 'Set background image' ) :
												<img src={ mediaURL } />
											}
										</Button>
									</Fragment>
								)
							}
						/>
					)
				}

				{
					// Actions for background image selected
					( 'image' === backgroundType && mediaID ) &&
						<Fragment>
							<p className="editor-post-featured-image__howto">
								{ __( 'Click the image to edit or update' ) }
							</p>
							<Button
								className="button-link"
								style={ { marginBottom: '20px' } }
								onClick={ onRemoveImage }>
								{ __( 'Remove background image' ) }
							</Button>
						</Fragment>
				}

				{ ( 'image' === backgroundType && mediaID ) &&
				(
					<ToggleControl
						key="togglecontrol"
						label={ __( 'Overlay' ) }
						checked={ !! overlay }
						onChange={ onChangeOverlay }
					/>
				) }

				{ overlay &&
					(
						<ButtonGroup aria-label={ __( 'Overlay Type' ) } key="overlaytype">
							{
								options.backgroundType.map( ( type ) => {
									if ( 'image' === type.value ) {
										return;
									}

									return (
										<Button
											key={ type.label }
											isLarge
											isPrimary={ overlayType === type.value }
											aria-pressed={ overlayType === type.value }
											onClick={ ( ) => onChangeOverlayType( type.value ) }
										>
											{ type.label }
										</Button>
									);
								} )
							}
						</ButtonGroup>
					) }

				{ ( overlay && 'color' === overlayType ) && colorControl }

				{ ( overlay && 'gradient' === overlayType ) && gradientControl }

				{
					( overlay && ( 'color' === overlayType || 'gradient' === overlayType ) )	&&
					(
						<RangeControl
							key="rangecontrol"
							label="Opacity"
							value={ opacity }
							onChange={ onChangeOpacity }
							min={ 1 }
							max={ 10 }
						/>
					)
				}
			</PanelBody>
		</InspectorControls>
	);
};

export default Inspector;
