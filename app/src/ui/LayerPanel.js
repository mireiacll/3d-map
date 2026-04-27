// import { CESIUM_CONFIG } from '../config.js';
// import * as Cesium from 'cesium';

// export class LayerPanel {
//   constructor(targetId, imageryLayers, buildingLayer, vworldBuildingLayer, contourLayer, viewer) {
//     this.container            = document.getElementById(targetId);
//     this.imageryLayers        = imageryLayers;
//     this.buildingLayer        = buildingLayer;          // Ion / OSM 3D tiles
//     this.vworldBuildingLayer  = vworldBuildingLayer;    // V-World SHP tiles
//     this.contourLayer         = contourLayer;
//     this.viewer               = viewer;
//     this.scene                = viewer.scene;

//     // Track which building source is active: 'ion' | 'vworld'
//     this._activeBuildingSource = 'ion';

//     this._render();
//   }

//   _render() {
//     this.container.innerHTML = '';

//     const title = document.createElement('div');
//     title.className = 'panel-title';
//     title.textContent = 'Layer Control';
//     this.container.appendChild(title);

//     // Base maps
//     this._addSectionLabel('Background Map');
//     this._addBasemapButtons();

//     // Vector layers
//     this._addSectionLabel('Vector Layers');
//     this._addBuildingRow();   // Buildings row with source toggle

//     this._addLayerRow('Contours', false,
//       () => this.contourLayer.getVisibility(),
//       (checked) => this.contourLayer.setVisibility(checked),
//       true, 'contours');

//     // Raster layers
//     this._addSectionLabel('Raster Layers');

//     this._addLayerRow('DEM', false,
//       () => this.imageryLayers.getLayer('dem')?.show || false,
//       (checked) => this.imageryLayers.setLayerVisibility('dem', checked),
//       true, 'dem');

//     this._addLayerRow('Hillshade', false,
//       () => this.imageryLayers.getLayer('hillshade')?.show || false,
//       (checked) => this.imageryLayers.setLayerVisibility('hillshade', checked),
//       true, 'hillshade');

//     this._addLayerRow('Color Relief', false,
//       () => this.imageryLayers.getLayer('colorRelief')?.show || false,
//       (checked) => this.imageryLayers.setLayerVisibility('colorRelief', checked),
//       true, 'colorRelief');

//     // Rendering
//     this._addSectionLabel('Rendering');

//     this._addLayerRow('Terrain', true,
//       () => this._isTerrainEnabled(),
//       (checked) => this._toggleTerrain(checked));

//     this._addLayerRow('Lighting', false,
//       () => this.scene.globe.enableLighting,
//       (checked) => {
//         this.scene.globe.enableLighting = checked;
//         this.scene.requestRender();
//       });

//     this._addLayerRow('Atmosphere', true,
//       () => this.scene.globe.showGroundAtmosphere,
//       (checked) => {
//         this.scene.globe.showGroundAtmosphere = checked;
//         this.scene.skyAtmosphere.show = checked;
//         this.scene.requestRender();
//       });
//   }

//   // ── Buildings row ─────────────────────────────────────────────────────────
//   // Layout:
//   //   [✓] Buildings
//   //   [ ION ]  [ V-World ]   ← source toggle (where slider normally goes)
//   _addBuildingRow() {
//     // Top line: checkbox + label
//     const row = document.createElement('div');
//     row.className = 'layer-row';

//     const label    = document.createElement('label');
//     const checkbox = document.createElement('input');
//     checkbox.type    = 'checkbox';
//     checkbox.checked = true;

//     checkbox.addEventListener('change', () => {
//       this._setActiveBuildingVisible(checkbox.checked);
//       this.scene.requestRender();
//     });

//     label.appendChild(checkbox);
//     label.appendChild(document.createTextNode('Buildings'));
//     row.appendChild(label);
//     this.container.appendChild(row);

//     // Second line: source toggle buttons (Ion | V-World)
//     const btnRow = document.createElement('div');
//     btnRow.className = 'basemap-row';
//     btnRow.style.marginTop = '4px';
//     btnRow.style.marginBottom = '8px';

//     const ionBtn    = document.createElement('button');
//     ionBtn.className = 'basemap-btn active';
//     ionBtn.textContent = 'Ion';

//     const vworldBtn = document.createElement('button');
//     vworldBtn.className = 'basemap-btn';
//     vworldBtn.textContent = 'V-World';

//     ionBtn.addEventListener('click', () => {
//       if (this._activeBuildingSource === 'ion') return;
//       this._activeBuildingSource = 'ion';

//       // Show Ion, hide V-World
//       if (checkbox.checked) {
//         this.buildingLayer.setVisibility(true);
//         this.vworldBuildingLayer.setVisibility(false);
//       }

//       ionBtn.classList.add('active');
//       vworldBtn.classList.remove('active');
//       this.scene.requestRender();
//     });

//     vworldBtn.addEventListener('click', () => {
//       if (this._activeBuildingSource === 'vworld') return;
//       this._activeBuildingSource = 'vworld';

//       // Show V-World, hide Ion
//       if (checkbox.checked) {
//         this.buildingLayer.setVisibility(false);
//         this.vworldBuildingLayer.setVisibility(true);
//       }

//       vworldBtn.classList.add('active');
//       ionBtn.classList.remove('active');
//       this.scene.requestRender();
//     });

//     btnRow.appendChild(ionBtn);
//     btnRow.appendChild(vworldBtn);
//     this.container.appendChild(btnRow);
//   }

//   /** Show/hide whichever source is currently selected */
//   _setActiveBuildingVisible(visible) {
//     if (this._activeBuildingSource === 'ion') {
//       this.buildingLayer.setVisibility(visible);
//     } else {
//       this.vworldBuildingLayer.setVisibility(visible);
//     }
//   }

//   // ── Helpers ───────────────────────────────────────────────────────────────
//   _isTerrainEnabled() {
//     return !(this.viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider);
//   }

//   _toggleTerrain(enabled) {
//     if (enabled) {
//       const { TERRAIN } = CESIUM_CONFIG;
//       if (TERRAIN.useIonTerrain && TERRAIN.ionAssetId) {
//         Cesium.CesiumTerrainProvider.fromIonAssetId(TERRAIN.ionAssetId, {
//           requestVertexNormals: true,
//           requestWaterMask: false
//         }).then(tp => {
//           this.viewer.scene.setTerrain(new Cesium.Terrain(tp));
//           this.scene.requestRender();
//         });
//       }
//     } else {
//       this.viewer.scene.setTerrain(new Cesium.Terrain(new Cesium.EllipsoidTerrainProvider()));
//       this.scene.requestRender();
//     }
//   }

//   _addSectionLabel(text) {
//     const label = document.createElement('div');
//     label.className = 'section-label';
//     label.textContent = text;
//     this.container.appendChild(label);
//   }

//   _addBasemapButtons() {
//     const row = document.createElement('div');
//     row.className = 'basemap-row';

//     const osmBtn = document.createElement('button');
//     osmBtn.className = 'basemap-btn active';
//     osmBtn.textContent = '🗺️ OSM';

//     const satBtn = document.createElement('button');
//     satBtn.className = 'basemap-btn';
//     satBtn.textContent = '🛰️ Satellite';

//     osmBtn.addEventListener('click', () => {
//       this.imageryLayers.switchBasemap('osm');
//       osmBtn.classList.add('active');
//       satBtn.classList.remove('active');
//     });

//     satBtn.addEventListener('click', () => {
//       this.imageryLayers.switchBasemap('satellite');
//       satBtn.classList.add('active');
//       osmBtn.classList.remove('active');
//     });

//     row.appendChild(osmBtn);
//     row.appendChild(satBtn);
//     this.container.appendChild(row);
//   }

//   _addLayerRow(name, checked, getStateFn, setStateFn, showOpacity = false, layerName = null) {
//     const row = document.createElement('div');
//     row.className = 'layer-row';

//     const label    = document.createElement('label');
//     const checkbox = document.createElement('input');
//     checkbox.type    = 'checkbox';
//     checkbox.checked = checked;

//     checkbox.addEventListener('change', () => {
//       setStateFn(checkbox.checked);
//       this.scene.requestRender();

//       if (layerName === 'dem')         this._updateLegend('dem',         checkbox.checked);
//       else if (layerName === 'colorRelief') this._updateLegend('colorRelief', checkbox.checked);
//       else if (layerName === 'contours')    this._updateLegend('contours',    checkbox.checked);
//     });

//     label.appendChild(checkbox);
//     label.appendChild(document.createTextNode(name));
//     row.appendChild(label);

//     if (showOpacity && layerName) {
//       const slider = document.createElement('input');
//       slider.type      = 'range';
//       slider.className = 'opacity-slider';
//       slider.min = 0;
//       slider.max = 100;

//       let initialOpacity = 80;
//       try {
//         const layer = layerName === 'contours'
//           ? this.contourLayer.getLayer()
//           : this.imageryLayers.getLayer(layerName);
//         if (layer) initialOpacity = Math.round(layer.alpha * 100);
//       } catch (e) { /* ignore */ }

//       slider.value = initialOpacity;

//       slider.addEventListener('input', () => {
//         const opacity = slider.value / 100;
//         if (layerName === 'contours') {
//           this.contourLayer.setOpacity(opacity);
//         } else {
//           this.imageryLayers.setLayerOpacity(layerName, opacity);
//         }
//         this.scene.requestRender();
//       });

//       row.appendChild(slider);
//     }

//     this.container.appendChild(row);
//   }

//   _updateLegend(layerName, visible) {
//     if (window.legendInstance) {
//       window.legendInstance.showSection(layerName, visible);
//     }
//   }
// }

import { CESIUM_CONFIG } from '../config.js';
import * as Cesium from 'cesium';

export class LayerPanel {
  constructor(targetId, imageryLayers, buildingLayer, vworldBuildingLayer, contourLayer, viewer) {
    this.container            = document.getElementById(targetId);
    this.imageryLayers        = imageryLayers;
    this.buildingLayer        = buildingLayer;
    this.vworldBuildingLayer  = vworldBuildingLayer;
    this.contourLayer         = contourLayer;
    this.viewer               = viewer;
    this.scene                = viewer.scene;

    this._activeBuildingSource = 'ion';

    this._render();
  }

  _render() {
    this.container.innerHTML = '';

    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = 'Layer Control';
    this.container.appendChild(title);

    this._addSectionLabel('Background Map');
    this._addBasemapButtons();

    this._addSectionLabel('Vector Layers');
    this._addBuildingRow();

    this._addLayerRow('Contours', false,
      () => this.contourLayer.getVisibility(),
      (checked) => this.contourLayer.setVisibility(checked),
      true, 'contours');

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

    this._addSectionLabel('Rendering');

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
        this.scene.skyAtmosphere.show = checked;
        this.scene.requestRender();
      });
  }

  _addBuildingRow() {
    const row = document.createElement('div');
    row.className = 'layer-row';

    const label    = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = true;

    checkbox.addEventListener('change', () => {
      this._setActiveBuildingVisible(checkbox.checked);
      this.scene.requestRender();
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode('Buildings'));
    row.appendChild(label);
    this.container.appendChild(row);

    const btnRow = document.createElement('div');
    btnRow.className = 'basemap-row';
    btnRow.style.marginTop = '4px';
    btnRow.style.marginBottom = '8px';

    const ionBtn    = document.createElement('button');
    ionBtn.className = 'basemap-btn active';
    ionBtn.textContent = 'Ion';

    const vworldBtn = document.createElement('button');
    vworldBtn.className = 'basemap-btn';
    vworldBtn.textContent = 'V-World';

    ionBtn.addEventListener('click', () => {
      if (this._activeBuildingSource === 'ion') return;
      this._activeBuildingSource = 'ion';

      if (checkbox.checked) {
        this.buildingLayer.setVisibility(true);
        this.vworldBuildingLayer.setVisibility(false);
      }

      ionBtn.classList.add('active');
      vworldBtn.classList.remove('active');
      
      // Update legend to show Ion categories
      if (window.legendInstance) {
        window.legendInstance.setBuildingMode('ion');
      }
      
      this.scene.requestRender();
    });

    vworldBtn.addEventListener('click', () => {
      if (this._activeBuildingSource === 'vworld') return;
      this._activeBuildingSource = 'vworld';

      if (checkbox.checked) {
        this.buildingLayer.setVisibility(false);
        this.vworldBuildingLayer.setVisibility(true);
      }

      vworldBtn.classList.add('active');
      ionBtn.classList.remove('active');
      
      // Update legend to show simplified V-World
      if (window.legendInstance) {
        window.legendInstance.setBuildingMode('vworld');
      }
      
      this.scene.requestRender();
    });

    btnRow.appendChild(ionBtn);
    btnRow.appendChild(vworldBtn);
    this.container.appendChild(btnRow);
  }

  _setActiveBuildingVisible(visible) {
    if (this._activeBuildingSource === 'ion') {
      this.buildingLayer.setVisibility(visible);
    } else {
      this.vworldBuildingLayer.setVisibility(visible);
    }
  }

  _isTerrainEnabled() {
    return !(this.viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider);
  }

  _toggleTerrain(enabled) {
    if (enabled) {
      const { TERRAIN } = CESIUM_CONFIG;
      if (TERRAIN.useIonTerrain && TERRAIN.ionAssetId) {
        Cesium.CesiumTerrainProvider.fromIonAssetId(TERRAIN.ionAssetId, {
          requestVertexNormals: true,
          requestWaterMask: false
        }).then(tp => {
          this.viewer.scene.setTerrain(new Cesium.Terrain(tp));
          this.scene.requestRender();
        });
      }
    } else {
      this.viewer.scene.setTerrain(new Cesium.Terrain(new Cesium.EllipsoidTerrainProvider()));
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

    const label    = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = checked;

    checkbox.addEventListener('change', () => {
      setStateFn(checkbox.checked);
      this.scene.requestRender();

      if (layerName === 'dem')              this._updateLegend('dem', checkbox.checked);
      else if (layerName === 'colorRelief') this._updateLegend('colorRelief', checkbox.checked);
      else if (layerName === 'contours')    this._updateLegend('contours', checkbox.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(name));
    row.appendChild(label);

    if (showOpacity && layerName) {
      const slider = document.createElement('input');
      slider.type      = 'range';
      slider.className = 'opacity-slider';
      slider.min = 0;
      slider.max = 100;

      let initialOpacity = 80;
      try {
        const layer = layerName === 'contours'
          ? this.contourLayer.getLayer()
          : this.imageryLayers.getLayer(layerName);
        if (layer) initialOpacity = Math.round(layer.alpha * 100);
      } catch (e) { /* ignore */ }

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
    if (window.legendInstance) {
      window.legendInstance.showSection(layerName, visible);
    }
  }
}