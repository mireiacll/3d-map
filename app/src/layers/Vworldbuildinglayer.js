import * as Cesium from 'cesium';
import { CESIUM_CONFIG } from '../config.js';

const BUILDING_STYLE = new Cesium.Cesium3DTileStyle({
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
  }
});

export class VWorldBuildingLayer {
  constructor(viewer) {
    this.viewer        = viewer;
    this.tilesets      = [];   // holds both Seoul + Gyeonggi once loaded
    this.isVisible     = false;
    this._loading      = false;
    this._loaded       = false;
  }

  async load() {
    if (this._loaded || this._loading) return;
    this._loading = true;

    const { seoulAssetId, gyeonggiAssetId1, gyeonggiAssetId2, gyeonggiAssetId3 } = CESIUM_CONFIG.VWORLD_BUILDINGS;
    const token = CESIUM_CONFIG.ION_TOKEN_VWORLD;

    // Temporarily set the second account token so Ion resolves these assets
    const originalToken = Cesium.Ion.defaultAccessToken;
    Cesium.Ion.defaultAccessToken = token;

    try {
      console.log('Loading V-World buildings from Cesium Ion...');

      const toLoad = [];
      if (seoulAssetId)    toLoad.push(seoulAssetId);
      if (gyeonggiAssetId1) toLoad.push(gyeonggiAssetId1);
      if (gyeonggiAssetId2) toLoad.push(gyeonggiAssetId2);
      if (gyeonggiAssetId3) toLoad.push(gyeonggiAssetId3);


      if (toLoad.length === 0) {
        console.warn('⚠️ VWorldBuildingLayer: No asset IDs set in CESIUM_CONFIG.VWORLD_BUILDINGS');
        return;
      }

      for (const assetId of toLoad) {
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId);
        this.viewer.scene.primitives.add(tileset);
        tileset.style = BUILDING_STYLE;
        tileset.show  = this.isVisible;
        this.tilesets.push(tileset);
        console.log(`✓ V-World tileset loaded (Ion asset ${assetId})`);
      }

      this._loaded = true;
    } catch (err) {
      console.error('❌ Failed to load V-World buildings:', err);
    } finally {
      // Restore the original token for everything else
      Cesium.Ion.defaultAccessToken = originalToken;
      this._loading = false;
    }
  }

  setVisibility(visible) {
    this.isVisible = visible;

    // First time turning on — trigger lazy load
    if (visible && !this._loaded) {
      this.load();
      return;
    }

    this.tilesets.forEach(t => t.show = visible);
    this.viewer.scene.requestRender();
  }

  getVisibility() {
    return this.isVisible;
  }
}