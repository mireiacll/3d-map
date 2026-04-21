import * as Cesium from 'cesium';
import { CESIUM_CONFIG } from '../config.js';

export class BuildingLayer {
  constructor(viewer) {
    this.viewer = viewer;
    this.tileset = null;
    this.isVisible = true;
  }

  async load() {
    const { ionAssetId } = CESIUM_CONFIG.BUILDINGS;

    if (!ionAssetId || ionAssetId === 0) {
      console.warn('⚠️ BuildingLayer: No Ion asset ID set. Please upload your 3D Tiles to Cesium Ion and set CESIUM_CONFIG.BUILDINGS.ionAssetId in config.js');
      return null;
    }

    try {
      console.log(`Loading buildings from Cesium Ion asset ${ionAssetId}...`);
 
      this.tileset = await Cesium.Cesium3DTileset.fromIonAssetId(ionAssetId, {
        // Optional: tune performance
        maximumScreenSpaceError: 16,
      });
 
      this.viewer.scene.primitives.add(this.tileset);
 
      this.tileset.show = this.isVisible;
      this._applyStyle();
 
      console.log('✓ Buildings loaded from Cesium Ion');
      return this.tileset;
    } catch (error) {
      console.error('❌ Failed to load:', error);
    }
  }

  _applyStyle() {
    if (!this.tileset) return;

    this.tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          // Match the categories we created in the Python script
          ['${building_type} === "high_rise"', 'color("#FF6B6B", 0.8)'],    // Soft Red
          ['${building_type} === "medium_rise"', 'color("#4ECDC4", 0.8)'],  // Turquoise
          ['${building_type} === "low_rise"', 'color("#98D8C8", 0.8)'],     // Sage Green
          ['${building_type} === "industrial"', 'color("#A29BFE", 0.8)'],   // Purple
          ['${building_type} === "public"', 'color("#FFE66D", 0.8)'],       // Soft Yellow
          ['${building_type} === "small"', 'color("#DFE6E9", 0.8)'],        // Light Grey
          ['true', 'color("#ADD8E6", 0.7)']                                // Default Blue
        ]
      },
      show: true
    });
  }

  setVisibility(visible) {
    this.isVisible = visible;
    if (this.tileset) {
      this.tileset.show = visible;
    }
  }

  getVisibility() {
    return this.isVisible;
  }
}
