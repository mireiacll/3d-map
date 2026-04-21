export const CESIUM_CONFIG = {
  //ION_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjY2ZjNTAyMi1iZWY0LTQ0MjEtOTZkNC03YzlhYmQ4NmUwYjYiLCJpZCI6NDA1OTA3LCJpYXQiOjE3NzM4ODY0MTJ9.-uQEXaxTOUCj19ednFa88VbJF89Oy4srPJGL1M-ORrw',
  ION_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ODFhYzU2Yy1jOTcwLTQ0YzUtOWUzZi0xNzk3OGZmNTE5NzUiLCJpZCI6NDIxMDk1LCJpYXQiOjE3NzY3NTA5MDN9.lcDgcMhNCUUeaTYsrQSRafTqVgF4YhqEe8eo-5yxi5A',

  DEFAULT_VIEW: {
    longitude: 127.5,
    latitude: 36.5,
    height: 1000000,
    heading: 0,
    pitch: -45,
    roll: 0
  },
  
  TERRAIN: {
    useIonTerrain: true, 
    // ionAssetId: 4634446,  // mireia1
    ionAssetId: 4649275,  // mireia2
  },
  
  BUILDINGS: {
    use3DTiles: true,
    tiles3DUrl: './3dtiles_terrain4/tileset.json'
  },
  
  IMAGERY: {
    demWmsUrl: '/geoserver/korea_map/wms',
    demLayer: 'korea_map:dem_4326_opt',
    hillshadeWmsUrl: '/geoserver/korea_map/wms',
    hillshadeLayer: 'korea_map:hillshade_4326_opt',
    colorReliefWmsUrl: '/geoserver/korea_map/wms',
    colorReliefLayer: 'korea_map:color-relief_4326_opt',
  },
  
  CONTOURS: {
    useWmts: true,
    wmtsUrl: '/geoserver/gwc/service/wmts',
    layer: 'korea_map:contour',
    matrixSet: 'EPSG:900913',
    style: 'korea_map:contour_style'
  }
};

// Keep your existing GEOSERVER_BASE
export const GEOSERVER_BASE = '/geoserver';