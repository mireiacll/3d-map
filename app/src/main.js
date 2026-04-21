import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';

import { CesiumViewer } from './viewer/CesiumViewer.js';
import { BuildingLayer } from './layers/BuildingLayer.js';
import { ImageryLayers } from './layers/ImageryLayer.js';
import { ContourLayer } from './layers/ContourLayer.js';
import { BuildingPicker } from './interaction/BuildingPicker.js';
import { ElevationPicker } from './interaction/ElevationPicker.js';
import { LayerPanel } from './ui/LayerPanel.js';
import { InfoPanel } from './ui/InfoPanel.js';
import { Legend } from './ui/Legend.js';

async function init() {
  try {
    console.log('Starting application...');
    
    // Initialize viewer
    const cesiumViewer = new CesiumViewer('cesiumContainer');
    const viewer = cesiumViewer.getViewer();
    
    // Initialize layers
    const imageryLayers = new ImageryLayers(viewer);
    await imageryLayers._initializeLayers();
    
    const buildingLayer = new BuildingLayer(viewer);
    await buildingLayer.load();
    
    const contourLayer = new ContourLayer(viewer);
    //contourLayer.load();
    
    // Initialize UI
    const infoPanel = new InfoPanel('info-panel');
    const legend = new Legend('legend');

    // Store legend globally so LayerPanel can access it
    window.legendInstance = legend;

    const layerPanel = new LayerPanel('layer-panel', imageryLayers, buildingLayer, contourLayer, viewer);
    
    // Initialize interactions
    const buildingPicker = new BuildingPicker(viewer, buildingLayer, infoPanel);
    const elevationPicker = new ElevationPicker(viewer, infoPanel, buildingPicker); 
    
    console.log('✅ Application initialized successfully!');
    
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    alert('Failed to load application. Check console.');
  }
}

init();