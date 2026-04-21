import { CESIUM_CONFIG } from '../config.js';
import * as Cesium from 'cesium';

export class LayerPanel {
  constructor(targetId, imageryLayers, buildingLayer, contourLayer, viewer) {
    this.container = document.getElementById(targetId);
    this.imageryLayers = imageryLayers;
    this.buildingLayer = buildingLayer;
    this.contourLayer = contourLayer;
    this.viewer = viewer;
    this.scene = viewer.scene;
    
    this._render();
  }
  
  _render() {
    this.container.innerHTML = '';
    
    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = 'Layer Control';
    this.container.appendChild(title);
    
    // Base maps
    this._addSectionLabel('Background Map');
    this._addBasemapButtons();
    
    // Vector layers
    this._addSectionLabel('Vector Layers');
    this._addLayerRow('Buildings', true, 
      () => this.buildingLayer.getVisibility(),
      (checked) => this.buildingLayer.setVisibility(checked));
    
    this._addLayerRow('Contours', false,
      () => this.contourLayer.getVisibility(),
      (checked) => this.contourLayer.setVisibility(checked),
      true, 'contours');
    
    // Raster layers
    this._addSectionLabel('Raster Layers');
    
    this._addLayerRow('DEM', false,
      () => this.imageryLayers.getLayer('dem')?.show || false,
      (checked) => this.imageryLayers.setLayerVisibility('dem', checked),
      true, 'dem');
    
    this._addLayerRow('Hillshade', false,
      () => this.imageryLayers.getLayer('hillshade')?.show || false,
      (checked) => this.imageryLayers.setLayerVisibility('hillshade', checked),
      true, 'hillshade');
    
    this._addLayerRow('Color Relief', false,
      () => this.imageryLayers.getLayer('colorRelief')?.show || false,
      (checked) => this.imageryLayers.setLayerVisibility('colorRelief', checked),
      true, 'colorRelief');
    
    // Rendering
    this._addSectionLabel('Rendering');
    
    // FIXED: Don't hide globe, just toggle terrain provider
    this._addLayerRow('Terrain', true,
      () => this._isTerrainEnabled(),
      (checked) => this._toggleTerrain(checked));
    
    this._addLayerRow('Lighting', false,
      () => this.scene.globe.enableLighting,
      (checked) => { 
        this.scene.globe.enableLighting = checked;
        this.scene.requestRender();
      });
    
    this._addLayerRow('Atmosphere', true,
      () => this.scene.globe.showGroundAtmosphere,
      (checked) => { 
        this.scene.globe.showGroundAtmosphere = checked;
        this.scene.requestRender();
      });
  }
  
  _isTerrainEnabled() {
    // Check if terrain provider is not the default ellipsoid
    const provider = this.viewer.terrainProvider;
    return !(provider instanceof Cesium.EllipsoidTerrainProvider);
  }
  
  _toggleTerrain(enabled) {
    
    if (enabled) {
      // Restore terrain from config
      const { TERRAIN } = CESIUM_CONFIG;
      if (TERRAIN.useIonTerrain && TERRAIN.ionAssetId) {
        Cesium.CesiumTerrainProvider.fromIonAssetId(TERRAIN.ionAssetId, {
          requestVertexNormals: true,
          requestWaterMask: false
        }).then(terrainProvider => {
          this.viewer.scene.setTerrain(new Cesium.Terrain(terrainProvider));
          this.scene.requestRender();
        });
      }
    } else {
      // Use flat ellipsoid terrain
      this.viewer.scene.setTerrain(
        new Cesium.Terrain(new Cesium.EllipsoidTerrainProvider())
      );
      this.scene.requestRender();
    }
  }
  
  _addSectionLabel(text) {
    const label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = text;
    this.container.appendChild(label);
  }
  
  _addBasemapButtons() {
    const row = document.createElement('div');
    row.className = 'basemap-row';
    
    const osmBtn = document.createElement('button');
    osmBtn.className = 'basemap-btn active';
    osmBtn.textContent = '🗺️ OSM';
    
    const satBtn = document.createElement('button');
    satBtn.className = 'basemap-btn';
    satBtn.textContent = '🛰️ Satellite';
    
    osmBtn.addEventListener('click', () => {
      this.imageryLayers.switchBasemap('osm');
      osmBtn.classList.add('active');
      satBtn.classList.remove('active');
    });
    
    satBtn.addEventListener('click', () => {
      this.imageryLayers.switchBasemap('satellite');
      satBtn.classList.add('active');
      osmBtn.classList.remove('active');
    });
    
    row.appendChild(osmBtn);
    row.appendChild(satBtn);
    this.container.appendChild(row);
  }
  
  _addLayerRow(name, checked, getStateFn, setStateFn, showOpacity = false, layerName = null) {
    const row = document.createElement('div');
    row.className = 'layer-row';
    
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    
    checkbox.addEventListener('change', () => {
      setStateFn(checkbox.checked);
      
      // Update legend visibility
      if (layerName === 'dem') {
        this._updateLegend('dem', checkbox.checked);
      } else if (layerName === 'colorRelief') {
        this._updateLegend('colorRelief', checkbox.checked);
      } else if (layerName === 'contours') {
        this._updateLegend('contours', checkbox.checked);
      }
    });
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(name));
    row.appendChild(label);
    
    if (showOpacity && layerName) {
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'opacity-slider';
      slider.min = 0;
      slider.max = 100;
      
      // Get initial opacity safely
      let initialOpacity = 80;
      try {
        if (layerName === 'contours') {
          const layer = this.contourLayer.getLayer();
          if (layer) {
            initialOpacity = Math.round(layer.alpha * 100);
          }
        } else {
          const layer = this.imageryLayers.getLayer(layerName);
          if (layer) {
            initialOpacity = Math.round(layer.alpha * 100);
          }
        }
      } catch (e) {
        console.warn(`Could not get opacity for ${layerName}:`, e);
      }
      
      slider.value = initialOpacity;
      
      slider.addEventListener('input', () => {
        const opacity = slider.value / 100;
        if (layerName === 'contours') {
          this.contourLayer.setOpacity(opacity);
        } else {
          this.imageryLayers.setLayerOpacity(layerName, opacity);
        }
        this.scene.requestRender();
      });
      
      row.appendChild(slider);
    }
    
    this.container.appendChild(row);
  }
  
  _updateLegend(layerName, visible) {
    // Update legend visibility if legend instance exists
    if (window.legendInstance) {
      window.legendInstance.showSection(layerName, visible);
    }
  }
}