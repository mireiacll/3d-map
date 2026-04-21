import * as Cesium from 'cesium';
import { CESIUM_CONFIG } from '../config.js';

export class CesiumViewer {
  constructor(containerId) {
    Cesium.Ion.defaultAccessToken = CESIUM_CONFIG.ION_TOKEN;
    window.CESIUM_BASE_URL = '/';

    this.viewer = new Cesium.Viewer(containerId, {
      baseLayerPicker: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      homeButton: true,
      sceneModePicker: false,
      navigationHelpButton: false,
      geocoder: false,
      infoBox: false,
      selectionIndicator: false,
      scene3DOnly: true,
      shadows: false,
      shouldAnimate: true,
      
      baseLayer: new Cesium.ImageryLayer(
        new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/'
        })
      )
    });

    this.viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
      e.cancel = true;
      this._flyToKorea();
    });

    this._configureScene();
    this._setInitialView();
    this._initializeTerrain();

    console.log('✓ CesiumViewer initialized');
  }

  _flyToKorea() {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(127.5, 36.5, 1000000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0.0
      },
      duration: 2
    });
  }

  async _initializeTerrain() {
    const { TERRAIN } = CESIUM_CONFIG;

    try {
      if (TERRAIN.useIonTerrain && TERRAIN.ionAssetId) {
        const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(
          TERRAIN.ionAssetId,
          {
            requestVertexNormals: true,
            requestWaterMask: false
          }
        );

        this.viewer.scene.setTerrain(new Cesium.Terrain(terrainProvider));
        console.log('✓ Terrain loaded');
      }
    } catch (error) {
      console.error('❌ Terrain failed:', error);
    }
  }

  _configureScene() {
    const scene = this.viewer.scene;
    scene.globe.enableLighting = false;
    scene.globe.showGroundAtmosphere = true;
    scene.skyAtmosphere.show = true;
    scene.globe.depthTestAgainstTerrain = true;
    scene.globe.maximumScreenSpaceError = 1.5;
    scene.requestRenderMode = true;
    scene.maximumRenderTimeChange = Infinity;
  }

  _setInitialView() {
    const { DEFAULT_VIEW } = CESIUM_CONFIG;

    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        DEFAULT_VIEW.longitude,
        DEFAULT_VIEW.latitude,
        DEFAULT_VIEW.height
      ),
      orientation: {
        heading: Cesium.Math.toRadians(DEFAULT_VIEW.heading),
        pitch: Cesium.Math.toRadians(DEFAULT_VIEW.pitch),
        roll: Cesium.Math.toRadians(DEFAULT_VIEW.roll),
      },
    });
  }

  getViewer() {
    return this.viewer;
  }

  getScene() {
    return this.viewer.scene;
  }
}