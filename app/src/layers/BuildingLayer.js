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
          ['${building} === "apartments"', 'color("#FF6B6B", 0.7)'],
          ['${building} === "commercial"', 'color("#4ECDC4", 0.7)'],
          ['${building} === "office"', 'color("#45B7D1", 0.7)'],
          ['${building} === "residential"', 'color("#FFA07A", 0.7)'],
          ['${building} === "house"', 'color("#98D8C8", 0.7)'],
          ['true', 'color("#ADD8E6", 0.7)']
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
