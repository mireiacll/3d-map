import * as Cesium from 'cesium';
import { CESIUM_CONFIG } from '../config.js';

export class BuildingLayer {
  constructor(viewer) {
    this.viewer    = viewer;
    this.tileset   = null;
    this.isVisible = true;
  }

  async load() {
    const { ionAssetId } = CESIUM_CONFIG.BUILDINGS;

    if (!ionAssetId || ionAssetId === 0) {
      console.warn('⚠️ BuildingLayer: No Ion asset ID set. Please set CESIUM_CONFIG.BUILDINGS.ionAssetId in config.js');
      return null;
    }

    try {
      console.log(`Loading buildings from Cesium Ion asset ${ionAssetId}...`);

      this.tileset = await Cesium.Cesium3DTileset.fromIonAssetId(ionAssetId, {
        maximumScreenSpaceError: 16,
      });

      this.viewer.scene.primitives.add(this.tileset);

      // Apply initial visibility AFTER the tileset is added
      this.tileset.show = this.isVisible;
      this._applyStyle();

      console.log('✓ Buildings loaded from Cesium Ion');
      return this.tileset;
    } catch (error) {
      console.error('❌ Failed to load buildings from Cesium Ion:', error);
    }
  }

  _applyStyle() {
    if (!this.tileset) return;

    this.tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ['${building_type} === "high_rise"',   'color("#FF6B6B", 0.8)'],
          ['${building_type} === "medium_rise"', 'color("#4ECDC4", 0.8)'],
          ['${building_type} === "low_rise"',    'color("#98D8C8", 0.8)'],
          ['${building_type} === "industrial"',  'color("#A29BFE", 0.8)'],
          ['${building_type} === "public"',      'color("#FFE66D", 0.8)'],
          ['${building_type} === "small"',       'color("#DFE6E9", 0.8)'],
          ['true',                               'color("#ADD8E6", 0.7)'],
        ]
      },
      show: true
    });
  }

  setVisibility(visible) {
    this.isVisible = visible;

    if (this.tileset) {
      this.tileset.show = visible;
      this.viewer.scene.requestRender();
    } else {
      console.warn('BuildingLayer: tileset not loaded yet, visibility will apply on load');
    }
  }

  getVisibility() {
    return this.isVisible;
  }
}