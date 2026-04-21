import TileLayer from 'ol/layer/Tile.js';
import WMTS from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import { get as getProjection } from 'ol/proj.js';
import { getTopLeft, getWidth } from 'ol/extent.js';
import { GEOSERVER_BASE } from '../config.js';

export class ContourLayer {
  constructor() {
    const projection = getProjection('EPSG:900913');
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = [];
    const matrixIds = [];

    for (let z = 0; z < 19; z++) {
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = 'EPSG:900913:' + z;
    }

    const tileGrid = new WMTSTileGrid({
      origin: getTopLeft(projectionExtent),
      resolutions: resolutions,
      matrixIds: matrixIds,
    });

    this.layer = new TileLayer({
      source: new WMTS({
        url: `${GEOSERVER_BASE}/gwc/service/wmts`,
        layer: 'korea_map:contour',
        matrixSet: 'EPSG:900913',
        format: 'image/png',
        projection: projection,
        tileGrid: tileGrid,
        style: 'korea_map:contour_style',
        wrapX: true,
      }),
      visible: true,
      opacity: 0.8,
      minZoom: 11,
      properties: { name: 'contours' },
    });
  }

  getLayer() {
    return this.layer;
  }
}

// import * as Cesium from 'cesium';

// export class ContourLayer {
//   constructor(viewer) {
//     this.viewer = viewer;
//     this.dataSource = null;
//     this.isVisible = false;
//     this.alpha = 0.8; // Store opacity here
//   }

//   async load() {
//     try {
//       // Use the Asset ID from your Cesium Ion account
//       const resource = await Cesium.IonResource.fromAssetId(4648954);
//       this.dataSource = await Cesium.GeoJsonDataSource.load(resource, {
//         clampToGround: true // Drapes contours over the 3D terrain
//       });

//       this._styleContours();
//       this.viewer.dataSources.add(this.dataSource);
//       this.dataSource.show = this.isVisible;
//     } catch (error) {
//       console.error('❌ Contour Load Error:', error);
//     }
//   }

//   _styleContours() {
//     const entities = this.dataSource.entities.values;
//     // Optimization: Only draw lines when the camera is closer than 15km
//     const condition = new Cesium.DistanceDisplayCondition(0, 15000);

//     entities.forEach(entity => {
//       if (entity.polyline) {
//         entity.polyline.width = 2;
//         entity.polyline.distanceDisplayCondition = condition;
//         // Apply the stored alpha to the color
//         const baseColor = Cesium.Color.fromCssColorString('#8B4513');
//         entity.polyline.material = baseColor.withAlpha(this.alpha);
//       }
//     });
//   }

//   // Add the missing methods that LayerPanel is looking for
//   getLayer() {
//     return this.dataSource; 
//   }

//   setVisibility(visible) {
//     this.isVisible = visible;
//     if (this.dataSource) this.dataSource.show = visible;
//   }

//   getVisibility() {
//     return this.isVisible;
//   }

//   setOpacity(value) {
//     this.alpha = value;
//     if (this.dataSource) this._styleContours();
//   }
// }