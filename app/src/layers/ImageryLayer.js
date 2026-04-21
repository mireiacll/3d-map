import * as Cesium from 'cesium';
import { CESIUM_CONFIG } from '../config.js';

export class ImageryLayers {
  constructor(viewer) {
    this.viewer = viewer;
    this.layers = {};
    this.imageryLayers = viewer.imageryLayers;
  }

  async _initializeLayers() {
    console.log('Initializing imagery layers...');

    // OSM base layer (already added by viewer)
    this.layers.osm = this.imageryLayers.get(0);

    // Satellite base layer (Esri World Imagery)
    this.layers.satellite = this.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        credit: 'Esri World Imagery'
      }),
      0
    );
    this.layers.satellite.show = false;

    // DEM layer from GeoServer
    this.layers.dem = this.imageryLayers.addImageryProvider(
      new Cesium.WebMapServiceImageryProvider({
        url: CESIUM_CONFIG.IMAGERY.demWmsUrl,
        layers: CESIUM_CONFIG.IMAGERY.demLayer,
        parameters: {
          transparent: true,
          format: 'image/png',
          styles: 'dem_style'
        }
      })
    );
    this.layers.dem.show = false;
    this.layers.dem.alpha = 0.8;

    // Hillshade layer from GeoServer
    this.layers.hillshade = this.imageryLayers.addImageryProvider(
      new Cesium.WebMapServiceImageryProvider({
        url: CESIUM_CONFIG.IMAGERY.hillshadeWmsUrl,
        layers: CESIUM_CONFIG.IMAGERY.hillshadeLayer,
        parameters: {
          transparent: true,
          format: 'image/png'
        }
      })
    );
    this.layers.hillshade.show = false;
    this.layers.hillshade.alpha = 0.7;

    // Color Relief layer from GeoServer
    this.layers.colorRelief = this.imageryLayers.addImageryProvider(
      new Cesium.WebMapServiceImageryProvider({
        url: CESIUM_CONFIG.IMAGERY.colorReliefWmsUrl,
        layers: CESIUM_CONFIG.IMAGERY.colorReliefLayer,
        parameters: {
          transparent: true,
          format: 'image/png'
        }
      })
    );
    this.layers.colorRelief.show = false;
    this.layers.colorRelief.alpha = 0.8;

    console.log('✓ All imagery layers initialized');
  }

  switchBasemap(name) {
    this.layers.osm.show = (name === 'osm');
    this.layers.satellite.show = (name === 'satellite');
  }

  setLayerVisibility(name, visible) {
    if (this.layers[name]) {
      this.layers[name].show = visible;
    }
  }

  setLayerOpacity(name, alpha) {
    if (this.layers[name]) {
      this.layers[name].alpha = alpha;
    }
  }

  getLayer(name) {
    return this.layers[name];
  }
}