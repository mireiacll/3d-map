import * as Cesium from 'cesium';
import { CESIUM_CONFIG } from '../config.js';

export class BuildingLayer {
  constructor(viewer) {
    this.viewer = viewer;
    this.tileset = null;
    this.isVisible = true;
  }

  async load() {
    const { tiles3DUrl } = CESIUM_CONFIG.BUILDINGS;

    try {
      this.tileset = await Cesium.Cesium3DTileset.fromUrl(tiles3DUrl);
      this.viewer.scene.primitives.add(this.tileset);

      await this.tileset.readyPromise;

      this.tileset.show = this.isVisible;

      this._applyStyle();
      
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
