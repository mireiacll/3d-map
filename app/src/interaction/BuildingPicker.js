import * as Cesium from 'cesium';

export class BuildingPicker {
  constructor(viewer, buildingLayer, infoPanel) {
    this.viewer = viewer;
    this.buildingLayer = buildingLayer;
    this.infoPanel = infoPanel;
    this.lastPickResult = false;
    
    this._setupClickHandler();
  }
  
  _setupClickHandler() {
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    
    handler.setInputAction(async (movement) => {
      const picked = await this._handleClick(movement);
      this.lastPickResult = picked;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
    this.handler = handler;
  }
  
  async _handleClick(movement) {
    const pickedObject = this.viewer.scene.pick(movement.position);
    
    if (Cesium.defined(pickedObject)) {
      // 1. Check if it's a 3D Tiles feature
      if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
        await this._show3DTilesInfo(pickedObject, movement);
        return true;
      }
      
      // 2. Check if it's an entity
      if (pickedObject.id && pickedObject.id.properties) {
        await this._showEntityInfo(pickedObject.id, movement);
        return true;
      }
    }

    // 3. FALLBACK: Just show elevation
    const elevationInfo = await this._getElevationAtPosition(movement);
    if (elevationInfo) {
      this.infoPanel.showElevationInfo(elevationInfo);
    } else {
      this.infoPanel.showPlaceholder();
    }
    
    return false;
  }
  
  async _show3DTilesInfo(feature, movement) {
    // Logic: Roof Altitude - Base Elevation = Actual Wall Height
    const roof = parseFloat(feature.getProperty('estimated_height')) || 0;
    const base = parseFloat(feature.getProperty('base_elevation')) || 0;
    
    // If base_elevation isn't in the tileset, we use the terrain elevation instead
    let terrainHeight = 0;
    const elevationInfo = await this._getElevationAtPosition(movement);
    if (elevationInfo) {
      terrainHeight = parseFloat(elevationInfo.data.elevation);
    }

    // Use base_elevation if available, otherwise use terrainHeight
    const referenceBase = base > 0 ? base : terrainHeight;
    const trueHeight = (roof > 0 && referenceBase > 0) ? (roof - referenceBase).toFixed(1) : 'N/A';

    const buildingInfo = {
      type: 'building',
      data: {
        osm_id: feature.getProperty('osm_id') || feature.getProperty( 'A0')|| 'N/A',
        name: feature.getProperty('name') || 'Unknown',
        building: feature.getProperty('building_type') || feature.getProperty('building') || 'N/A',
        height: `${trueHeight}m`
      }
    };
    
    if (elevationInfo) {
      this.infoPanel.showBuildingAndElevation(buildingInfo, elevationInfo);
    } else {
      this.infoPanel.showBuildingInfo(buildingInfo);
    }
  }
  
  async _showEntityInfo(entity, movement) {
    const props = entity.properties;
    const roof = parseFloat(this._getProperty(props, 'estimated_height')) || 0;
    
    const elevationInfo = await this._getElevationAtPosition(movement);
    const terrainHeight = elevationInfo ? parseFloat(elevationInfo.data.elevation) : 0;
    
    const trueHeight = (roof > 0 && terrainHeight > 0) ? (roof - terrainHeight).toFixed(1) : 'N/A';

    const buildingInfo = {
      type: 'building',
      data: {
        osm_id: this._getProperty(props, 'osm_id') || 'N/A',
        name: this._getProperty(props, 'name') || 'Unknown',
        building: this._getProperty(props, 'building') || 'N/A',
        height: `${trueHeight}m`
      }
    };
    
    if (elevationInfo) {
      this.infoPanel.showBuildingAndElevation(buildingInfo, elevationInfo);
    } else {
      this.infoPanel.showBuildingInfo(buildingInfo);
    }
  }
  
  async _getElevationAtPosition(movement) {
    const ray = this.viewer.camera.getPickRay(movement.position);
    const cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    
    if (Cesium.defined(cartesian)) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const terrainProvider = this.viewer.terrainProvider;
      
      try {
        const updatedPositions = await Cesium.sampleTerrainMostDetailed(
          terrainProvider, 
          [cartographic]
        );
        
        const position = updatedPositions[0];
        
        return {
          type: 'elevation',
          data: {
            longitude: Cesium.Math.toDegrees(position.longitude).toFixed(6),
            latitude: Cesium.Math.toDegrees(position.latitude).toFixed(6),
            elevation: position.height.toFixed(2)
          }
        };
      } catch (error) {
        console.error('Error getting elevation:', error);
        return null;
      }
    }
    return null;
  }
  
  _getProperty(props, name) {
    try {
      const value = props[name];
      return value?.getValue ? value.getValue() : value;
    } catch (e) {
      return null;
    }
  }

  wasBuildingPicked() {
    return this.lastPickResult || false;
  }
}