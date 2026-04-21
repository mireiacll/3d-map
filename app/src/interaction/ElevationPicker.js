import * as Cesium from 'cesium';

export class ElevationPicker {
  constructor(viewer, infoPanel, buildingPicker) {
    this.viewer = viewer;
    this.infoPanel = infoPanel;
    this.buildingPicker = buildingPicker; // Reference to BuildingPicker
    
    //this._setupClickHandler();
  }
  
  _setupClickHandler() {
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    
    handler.setInputAction((movement) => {
      this._handleClick(movement);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  
  _handleClick(movement) {
    // Get terrain position
    const ray = this.viewer.camera.getPickRay(movement.position);
    const cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    
    if (Cesium.defined(cartesian)) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      
      // Sample terrain height
      const terrainProvider = this.viewer.terrainProvider;
      
      Cesium.sampleTerrainMostDetailed(terrainProvider, [cartographic])
        .then((updatedPositions) => {
          const position = updatedPositions[0];
          
          const info = {
            type: 'elevation',
            data: {
              longitude: Cesium.Math.toDegrees(position.longitude).toFixed(6),
              latitude: Cesium.Math.toDegrees(position.latitude).toFixed(6),
              elevation: position.height.toFixed(2)
            }
          };
          
          this.infoPanel.showElevationInfo(info);
        });
    }
  }
}