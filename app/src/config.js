export const CESIUM_CONFIG = {
  ION_TOKEN_VWORLD: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjY2ZjNTAyMi1iZWY0LTQ0MjEtOTZkNC03YzlhYmQ4NmUwYjYiLCJpZCI6NDA1OTA3LCJpYXQiOjE3NzM4ODY0MTJ9.-uQEXaxTOUCj19ednFa88VbJF89Oy4srPJGL1M-ORrw',
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
    //tiles3DUrl: './3dtiles_terrain4/tileset.json'
    ionAssetId: 4649301,
  },

  VWORLD_BUILDINGS: {
    seoulAssetId:   4662883,   
    gyeonggiAssetId1: 4662959,   
    gyeonggiAssetId2: 4663012,
    gyeonggiAssetId3: 4663034,
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
    minorSpacing: 50,    // Minor contour every 50m  
    majorSpacing: 200,   // Major contour every 200m
    minorColor: '#c8a882',
    majorColor: '#8B4513',
    minorWidth: 0.8,
    majorWidth: 2.5,
  }
};

// Keep your existing GEOSERVER_BASE
export const GEOSERVER_BASE = '/geoserver';