<?php
/**
 * Contributors: lubus, ajitbohra
 * Plugin Name: Block Background
 * Plugin URI: https://www.lubus.in
 * Description: Extend gutenberg blocks with additional background options
 * Author: LUBUS
 * Author URI: https://lubus.in
 * Version: 1.0.4
 * Text Domain: blockbg
 * Domain Path: /languages
 * GitHub Plugin URI: https://github.com/lubusIN/block-background
 * Tags: gutenberg, block, background, image, gradient
 * Requires at least: 3.0.1
 * Tested up to:  5.0.2
 * Stable tag: 1.0.4
 * License: GPLv3 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @package LubusIN_Block_Background
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'LubusIN_Block_Background' ) ) :
/**
 * LubusIN_Block_Background Class.
 *
 * Main Class.
 *
 * @since 1.0.0
 */
class LubusIN_Block_Background {
	/**
	 * Instance.
	 *
	 * @since
	 * @access private
	 * @var LubusIN_Block_Background
	 */
	static private $instance;

	/**
	 * Singleton pattern.
	 *
	 * @since
	 * @access private
	 */
	private function __construct() {
		$this->setup_constants();
        $this->init_hooks();
	}


	/**
	 * Get instance.
	 *
	 * @since
	 * @access public
	 * @return LubusIN_Block_Background
	 */
	public static function get_instance() {
		if ( null === static::$instance ) {
			self::$instance = new static();
		}

		return self::$instance;
	}

	/**
	 * Hook into actions and filters.
	 *
	 * @since  1.0.0
	 */
	private function init_hooks() {
		// Set up localization on init Hook.
		add_action( 'init', array( $this, 'load_textdomain' ), 0 );
		add_action( 'enqueue_block_editor_assets', array( $this, 'register_block_background' ) );
	}

	/**
	 * Throw error on object clone
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object, therefore we don't want the object to be cloned.
	 *
	 * @since  1.0
	 * @access protected
	 *
	 * @return void
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden.
		blockbg_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'blockbg' ), '1.0' );
	}

	/**
	 * Disable unserializing of the class
	 *
	 * @since  1.0
	 * @access protected
	 *
	 * @return void
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden.
		blockbg_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'blockbg' ), '1.0' );
	}

	/**
	 * Setup plugin constants
	 *
	 * @since  1.0
	 * @access private
	 *
	 * @return void
	 */
	private function setup_constants() {
		// Plugin version
		if ( ! defined( 'BLOCKBG_VERSION' ) ) {
			define( 'BLOCKBG_VERSION', '1.0.0' );
		}
		// Plugin Root File
		if ( ! defined( 'BLOCKBG_PLUGIN_FILE' ) ) {
			define( 'BLOCKBG_PLUGIN_FILE', __FILE__ );
		}
		// Plugin Folder Path
		if ( ! defined( 'BLOCKBG_PLUGIN_DIR' ) ) {
			define( 'BLOCKBG_PLUGIN_DIR', plugin_dir_path( BLOCKBG_PLUGIN_FILE ) );
		}
		// Plugin Folder URL
		if ( ! defined( 'BLOCKBG_PLUGIN_URL' ) ) {
			define( 'BLOCKBG_PLUGIN_URL', plugin_dir_url( BLOCKBG_PLUGIN_FILE ) );
		}
		// Plugin Basename aka: "block-background/block-background.php"
		if ( ! defined( 'BLOCKBG_PLUGIN_BASENAME' ) ) {
			define( 'BLOCKBG_PLUGIN_BASENAME', plugin_basename( BLOCKBG_PLUGIN_FILE ) );
		}
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @since  1.0.0
	 * @access public
	 *
	 * @return void
	 */
	public function load_textdomain() {
		$locale = apply_filters( 'plugin_locale', get_locale(), 'blockbg' );
		// wp-content/languages/plugin-name/plugin-name-en_EN.mo.
		load_textdomain( 'blockbg', trailingslashit( WP_LANG_DIR ) . 'block-background' . '/' . 'block-background' . '-' . $locale . '.mo' );
		// wp-content/plugins/plugin-name/languages/plugin-name-en_EN.mo.
		load_plugin_textdomain( 'blockbg', false, basename( BLOCKBG_PLUGIN_DIR ) . '/languages/' );
	}

	/**
	 * Registers scripts
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return void
	 */
	public function register_block_background(){
		$block_js = 'build/script.js';
		$block_css = 'build/style.css';

		// Script
		wp_register_script(
			'block-background-js',
			BLOCKBG_PLUGIN_URL . $block_js,
			array(
				'wp-i18n',
				'wp-blocks',
				'wp-hooks',
				'wp-element',
				'wp-components',
				'wp-editor',
			),
			filemtime( BLOCKBG_PLUGIN_DIR . $block_js )
		);

		// Common stlyes
		wp_register_style(
			'block-background',
			BLOCKBG_PLUGIN_URL . $block_css,
			array(),
			filemtime(BLOCKBG_PLUGIN_DIR . $block_css)
		);

		wp_enqueue_style( 'block-background' );
		wp_enqueue_script( 'block-background-js' );
	}
}

endif;

LubusIN_Block_Background::get_instance();
?>
