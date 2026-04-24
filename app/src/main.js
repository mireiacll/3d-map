import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';

import { CesiumViewer }        from './viewer/CesiumViewer.js';
import { BuildingLayer }       from './layers/BuildingLayer.js';
import { VWorldBuildingLayer } from './layers/VWorldBuildingLayer.js';
import { ImageryLayers }       from './layers/ImageryLayer.js';
import { ContourLayer }        from './layers/ContourLayer.js';
import { BuildingPicker }      from './interaction/BuildingPicker.js';
import { ElevationPicker }     from './interaction/ElevationPicker.js';
import { LayerPanel }          from './ui/LayerPanel.js';
import { InfoPanel }           from './ui/InfoPanel.js';
import { Legend }              from './ui/Legend.js';

async function init() {
  try {
    console.log('Starting application...');

    const cesiumViewer = new CesiumViewer('cesiumContainer');
    const viewer       = cesiumViewer.getViewer();

    // Imagery
    const imageryLayers = new ImageryLayers(viewer);
    await imageryLayers._initializeLayers();

    // Buildings — Ion source loads eagerly, V-World loads lazily on first switch
    const buildingLayer      = new BuildingLayer(viewer);
    await buildingLayer.load();

    const vworldBuildingLayer = new VWorldBuildingLayer(viewer);
    // Note: no await here — V-World loads lazily when the user selects it

    // Contours
    const contourLayer = new ContourLayer(viewer);
    await contourLayer.load();

    // UI
    const infoPanel = new InfoPanel('info-panel');
    const legend    = new Legend('legend');
    window.legendInstance = legend;

    // LayerPanel now takes vworldBuildingLayer as the 3rd argument
    const layerPanel = new LayerPanel(
      'layer-panel',
      imageryLayers,
      buildingLayer,
      vworldBuildingLayer,
      contourLayer,
      viewer
    );

    // Interactions
    const buildingPicker  = new BuildingPicker(viewer, buildingLayer, infoPanel);
    const elevationPicker = new ElevationPicker(viewer, infoPanel, buildingPicker);

    console.log('✅ Application initialized successfully!');

  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    alert('Failed to load application. Check console.');
  }
}

init();