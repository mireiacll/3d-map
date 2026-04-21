// import TileLayer from 'ol/layer/Tile.js';
// import TileWMS from 'ol/source/TileWMS.js';

// import { GEOSERVER_BASE } from '../config.js';
// const GEOSERVER_URL = `${GEOSERVER_BASE}/korea_map/wms`;
// //const GEOSERVER_URL = '/geoserver/korea_map/wms';

// export class ContourLayer {
//   constructor() {
//     this.layer = new TileLayer({
//       source: new TileWMS({
//         url: GEOSERVER_URL,
//         params: {
//           LAYERS: 'korea_map:contour',
//           STYLES:'korea_map:contour_style',
//           TILED: true,
//         },
//         serverType: 'geoserver',
//       }),
//       visible: true,
//       opacity: 0.8,
//       minZoom:12,
//       properties: { name: 'contours' },
//     });
//   }

//   getLayer() {
//     return this.layer;
//   }
// }

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