// export class InfoPanel {
//   constructor(targetId) {
//     this.container = document.getElementById(targetId);
//     this._render();
//   }
  
//   _render() {
//     const title = document.createElement('div');
//     title.className = 'info-title';
//     title.textContent = 'Information';
//     this.container.appendChild(title);
    
//     this.content = document.createElement('div');
//     this.content.className = 'info-content';
//     this.container.appendChild(this.content);
    
//     this.showPlaceholder();
//   }
  
//   showPlaceholder() {
//     this.content.innerHTML = '';
//     const placeholder = document.createElement('div');
//     placeholder.className = 'info-placeholder';
//     placeholder.textContent = 'Click a building or terrain to get information';
//     this.content.appendChild(placeholder);
//   }
  
//   showBuildingInfo(info) {
//     this.content.innerHTML = '';
    
//     const fields = {
//       'OSM ID': info.data.osm_id,
//       'Name': info.data.name,
//       'Type': info.data.building,
//       'Height': typeof info.data.height === 'number' ? 
//                 `${info.data.height} m` : info.data.height
//     };
    
//     Object.entries(fields).forEach(([key, value]) => {
//       if (!value || value === 'N/A' || value === 'Unknown') return;
      
//       const row = this._createInfoRow(key, value);
//       this.content.appendChild(row);
//     });
//   }
  
//   showElevationInfo(info) {
//     this.content.innerHTML = '';
    
//     const fields = {
//       'Longitude': info.data.longitude + '°',
//       'Latitude': info.data.latitude + '°',
//       'Elevation': info.data.elevation + ' m'
//     };
    
//     Object.entries(fields).forEach(([key, value]) => {
//       const row = this._createInfoRow(key, value);
//       this.content.appendChild(row);
//     });
//   }
  
//   _createInfoRow(key, value) {
//     const row = document.createElement('div');
//     row.className = 'info-row';
    
//     const keyEl = document.createElement('span');
//     keyEl.className = 'info-key';
//     keyEl.textContent = key;
    
//     const valEl = document.createElement('div');
//     valEl.className = 'info-value';
//     valEl.textContent = value;
    
//     row.appendChild(keyEl);
//     row.appendChild(valEl);
    
//     return row;
//   }
// }

export class InfoPanel {
  constructor(targetId) {
    this.container = document.getElementById(targetId);
    this._render();
  }
  
  _render() {
    const title = document.createElement('div');
    title.className = 'info-title';
    title.textContent = 'Information';
    this.container.appendChild(title);
    
    this.content = document.createElement('div');
    this.content.className = 'info-content';
    this.container.appendChild(this.content);
    
    this.showPlaceholder();
  }
  
  showPlaceholder() {
    this.content.innerHTML = '';
    const placeholder = document.createElement('div');
    placeholder.className = 'info-placeholder';
    placeholder.textContent = 'Click a building or terrain to get information';
    this.content.appendChild(placeholder);
  }
  
  showBuildingInfo(info) {
    this.content.innerHTML = '';
    
    // Building section
    const buildingSection = document.createElement('div');
    buildingSection.className = 'info-section';
    
    const buildingHeader = document.createElement('div');
    buildingHeader.className = 'info-section-header';
    buildingHeader.textContent = '🏢 Building';
    buildingSection.appendChild(buildingHeader);
    
    const fields = {
      'OSM ID': info.data.osm_id,
      'Name': info.data.name,
      'Type': info.data.building,
      'Height': typeof info.data.height === 'number' ? 
                `${info.data.height} m` : info.data.height
    };
    
    Object.entries(fields).forEach(([key, value]) => {
      if (!value || value === 'N/A' || value === 'Unknown') return;
      
      const row = this._createInfoRow(key, value);
      buildingSection.appendChild(row);
    });
    
    this.content.appendChild(buildingSection);
  }
  
  showElevationInfo(info) {
    this.content.innerHTML = '';
    
    // Elevation section
    const elevSection = document.createElement('div');
    elevSection.className = 'info-section';
    
    const elevHeader = document.createElement('div');
    elevHeader.className = 'info-section-header';
    elevHeader.textContent = '📍 Location';
    elevSection.appendChild(elevHeader);
    
    const fields = {
      'Longitude': info.data.longitude + '°',
      'Latitude': info.data.latitude + '°',
      'Elevation': info.data.elevation + ' m'
    };
    
    Object.entries(fields).forEach(([key, value]) => {
      const row = this._createInfoRow(key, value);
      elevSection.appendChild(row);
    });
    
    this.content.appendChild(elevSection);
  }
  
  showBuildingAndElevation(buildingInfo, elevationInfo) {
    this.content.innerHTML = '';
    
    // Building section
    const buildingSection = document.createElement('div');
    buildingSection.className = 'info-section';
    
    const buildingHeader = document.createElement('div');
    buildingHeader.className = 'info-section-header';
    buildingHeader.textContent = '🏢 Building';
    buildingSection.appendChild(buildingHeader);
    
    const buildingFields = {
      'OSM ID': buildingInfo.data.osm_id,
      'Name': buildingInfo.data.name,
      'Type': buildingInfo.data.building,
      'Height': typeof buildingInfo.data.height === 'number' ? 
                `${buildingInfo.data.height} m` : buildingInfo.data.height
    };
    
    Object.entries(buildingFields).forEach(([key, value]) => {
      if (!value || value === 'N/A' || value === 'Unknown') return;
      const row = this._createInfoRow(key, value);
      buildingSection.appendChild(row);
    });
    
    this.content.appendChild(buildingSection);
    
    // Elevation section
    const elevSection = document.createElement('div');
    elevSection.className = 'info-section';
    elevSection.style.marginTop = '10px';
    
    const elevHeader = document.createElement('div');
    elevHeader.className = 'info-section-header';
    elevHeader.textContent = '📍 Location';
    elevSection.appendChild(elevHeader);
    
    const elevFields = {
      'Longitude': elevationInfo.data.longitude + '°',
      'Latitude': elevationInfo.data.latitude + '°',
      'Elevation': elevationInfo.data.elevation + ' m'
    };
    
    Object.entries(elevFields).forEach(([key, value]) => {
      const row = this._createInfoRow(key, value);
      elevSection.appendChild(row);
    });
    
    this.content.appendChild(elevSection);
  }
  
  _createInfoRow(key, value) {
    const row = document.createElement('div');
    row.className = 'info-row';
    
    const keyEl = document.createElement('span');
    keyEl.className = 'info-key';
    keyEl.textContent = key;
    
    const valEl = document.createElement('span');
    valEl.className = 'info-value';
    valEl.textContent = value;
    
    row.appendChild(keyEl);
    row.appendChild(valEl);
    
    return row;
  }
}