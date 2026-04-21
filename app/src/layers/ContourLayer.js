import * as Cesium from 'cesium';
import { CESIUM_CONFIG } from '../config.js';

// Contours are only meaningful when zoomed in close enough for the terrain
// mesh to have enough resolution. Below this camera height (metres) the
// contour material is removed — mirroring the minZoom:11 you had in OL.
const MAX_CAMERA_HEIGHT = 150_000; // ~zoom 11 equivalent

export class ContourLayer {
  constructor(viewer) {
    this.viewer           = viewer;
    this.isVisible        = false;
    this.opacity          = 0.9;
    this._material        = null;
    this._defaultMaterial = null;
    this._postRenderHandler = null;
  }

  async load() {
    this._buildMaterial();
    this._setupZoomListener();
    console.log('✓ ContourLayer ready (createElevationBandMaterial)');
  }

  // -------------------------------------------------------------------------
  // Build the band material
  // -------------------------------------------------------------------------
  _buildMaterial() {
    const cfg        = CESIUM_CONFIG.CONTOURS;
    const minorColor = Cesium.Color.fromCssColorString(cfg.minorColor);
    const majorColor = Cesium.Color.fromCssColorString(cfg.majorColor);

    const minorHalfWidth = 0.8;
    const majorHalfWidth = 1.8;
    const antialias      = 0.5;

    const layers = [];

    // Transparent base — keeps ocean and sub-50m terrain clean
    layers.push({
      entries: [
        { height: -500, color: new Cesium.Color(0, 0, 0, 0) },
        { height:   49, color: new Cesium.Color(0, 0, 0, 0) },
      ],
      extendDownwards: true,
    });

    const maxHeight = 2200;

    for (let h = cfg.minorSpacing; h <= maxHeight; h += cfg.minorSpacing) {
      const isMajor = h % cfg.majorSpacing === 0;
      const halfW   = isMajor ? majorHalfWidth : minorHalfWidth;
      const color   = isMajor ? majorColor      : minorColor;
      const alpha   = this.opacity;

      layers.push({
        entries: [
          { height: h - halfW - antialias, color: new Cesium.Color(color.red, color.green, color.blue, 0.0)   },
          { height: h - halfW,             color: new Cesium.Color(color.red, color.green, color.blue, alpha) },
          { height: h + halfW,             color: new Cesium.Color(color.red, color.green, color.blue, alpha) },
          { height: h + halfW + antialias, color: new Cesium.Color(color.red, color.green, color.blue, 0.0)   },
        ],
      });
    }

    this._material = Cesium.createElevationBandMaterial({
      scene:  this.viewer.scene,
      layers: layers,
    });
  }

  // -------------------------------------------------------------------------
  // Watch camera height — swap material in/out based on zoom level
  // -------------------------------------------------------------------------
  _setupZoomListener() {
    this._postRenderHandler = () => {
      if (!this.isVisible) return;

      const height = this.viewer.camera.positionCartographic.height;
      const shouldShow = height < MAX_CAMERA_HEIGHT;
      const currentMaterial = this.viewer.scene.globe.material;
      const hasMaterial = currentMaterial === this._material;

      if (shouldShow && !hasMaterial) {
        this.viewer.scene.globe.material = this._material;
        this.viewer.scene.requestRender();
      } else if (!shouldShow && hasMaterial) {
        this.viewer.scene.globe.material = this._defaultMaterial;
        this.viewer.scene.requestRender();
      }
    };

    this.viewer.scene.postRender.addEventListener(this._postRenderHandler);
  }

  // -------------------------------------------------------------------------
  // Visibility
  // -------------------------------------------------------------------------
  setVisibility(visible) {
    this.isVisible = visible;

    if (!visible) {
      // Always restore default when toggled off
      this.viewer.scene.globe.material = this._defaultMaterial;
    } else {
      // Save default material once
      if (this._defaultMaterial === null) {
        this._defaultMaterial = this.viewer.scene.globe.material ?? null;
      }
      // Only actually apply if zoomed in enough
      const height = this.viewer.camera.positionCartographic.height;
      if (height < MAX_CAMERA_HEIGHT) {
        this.viewer.scene.globe.material = this._material;
      }
    }

    this.viewer.scene.requestRender();
  }

  getVisibility() {
    return this.isVisible;
  }

  // -------------------------------------------------------------------------
  // Opacity
  // -------------------------------------------------------------------------
  setOpacity(value) {
    this.opacity = value;
    this._buildMaterial();

    if (this.isVisible) {
      const height = this.viewer.camera.positionCartographic.height;
      if (height < MAX_CAMERA_HEIGHT) {
        this.viewer.scene.globe.material = this._material;
        this.viewer.scene.requestRender();
      }
    }
  }

  getLayer() {
    const self = this;
    return {
      get alpha() { return self.opacity; },
      set alpha(v) { self.setOpacity(v); },
    };
  }
}