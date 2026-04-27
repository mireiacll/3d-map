// export class Legend {
//   constructor(targetId) {
//     this.container = document.getElementById(targetId);
//     this.sections = {};
//     this._render();
//   }
  
//   _render() {
//     this.container.innerHTML = '';
    
//     const title = document.createElement('div');
//     title.className = 'panel-title';
//     title.textContent = 'Legend';
//     this.container.appendChild(title);
    
//     this.sections.buildings = this._addBuildingLegend();
//     this.sections.dem = this._addDEMLegend();
//     this.sections.colorRelief = this._addColorReliefLegend();
//     this.sections.contours = this._addContourLegend();
    
//     // Set initial visibility
//     this.showSection('buildings', true);
//     this.showSection('dem', false);
//     this.showSection('colorRelief', false);
//     this.showSection('contours', false);
//   }
  
//   showSection(name, visible) {
//     if (this.sections[name]) {
//       this.sections[name].style.display = visible ? 'block' : 'none';
//     }
//   }
  
//   _addBuildingLegend() {
//     const wrapper = document.createElement('div');
//     const label = document.createElement('div');
//     label.className = 'section-label';
//     label.textContent = 'Buildings';
//     wrapper.appendChild(label);
    
//     const types = [
//       { color: '#FF6B6B', label: 'High-Rise (Apts/Condo)' },
//       { color: '#4ECDC4', label: 'Medium-Rise (Comm/Office)' },
//       { color: '#98D8C8', label: 'Low-Rise (Houses)' },
//       { color: '#A29BFE', label: 'Industrial (Factory/Wh)' },
//       { color: '#FFE66D', label: 'Public (School/Gov)' },
//       { color: '#DFE6E9', label: 'Small (Sheds/Garages)' },
//       { color: '#ADD8E6', label: 'Other' }
//     ];
    
//     types.forEach(({ color, label: text }) => {
//       const item = document.createElement('div');
//       item.className = 'legend-item';
      
//       const colorBox = document.createElement('div');
//       colorBox.className = 'legend-color';
//       colorBox.style.backgroundColor = color;
      
//       const textEl = document.createElement('span');
//       textEl.textContent = text;
      
//       item.appendChild(colorBox);
//       item.appendChild(textEl);
//       wrapper.appendChild(item);
//     });
    
//     this.container.appendChild(wrapper);
//     return wrapper;
//   }
  
//   _addDEMLegend() {
//     const wrapper = document.createElement('div');
//     const label = document.createElement('div');
//     label.className = 'section-label';
//     label.textContent = 'DEM Elevation';
//     wrapper.appendChild(label);
    
//     const gradient = document.createElement('div');
//     gradient.className = 'legend-gradient';
//     gradient.style.height = '16px';
//     gradient.style.background = 'linear-gradient(to right, #1a9850, #91cf60, #d9ef8b, #fee08b, #fc8d59, #d73027, #ffffff)';
//     wrapper.appendChild(gradient);
    
//     const labels = document.createElement('div');
//     labels.className = 'legend-labels';
//     labels.innerHTML = '<span>0m</span><span>1000m</span><span>1950m</span>';
//     wrapper.appendChild(labels);
    
//     this.container.appendChild(wrapper);
//     return wrapper;
//   }
  
//   _addColorReliefLegend() {
//     const wrapper = document.createElement('div');
//     const label = document.createElement('div');
//     label.className = 'section-label';
//     label.textContent = 'Color Relief';
//     wrapper.appendChild(label);
    
//     const gradient = document.createElement('div');
//     gradient.className = 'legend-gradient';
//     gradient.style.height = '16px';
//     gradient.style.background = 'linear-gradient(to right, #00008b, #0000ff, #00bfff, #00ff00, #ffff00, #8b4513)';
//     wrapper.appendChild(gradient);
    
//     const labels = document.createElement('div');
//     labels.className = 'legend-labels';
//     labels.innerHTML = '<span>0m</span><span>1000m</span><span>1950m</span>';
//     wrapper.appendChild(labels);
    
//     this.container.appendChild(wrapper);
//     return wrapper;
//   }
  
//   _addContourLegend() {
//     const wrapper = document.createElement('div');
//     const label = document.createElement('div');
//     label.className = 'section-label';
//     label.textContent = 'Contours';
//     wrapper.appendChild(label);
    
//     const items = [
//       { color: '#8B5E3C', label: 'Major (200m)', height: '4px' },
//       { color: '#c8a882', label: 'Minor (50m)', height: '2px' }
//     ];
    
//     items.forEach(({ color, label: text, height }) => {
//       const item = document.createElement('div');
//       item.className = 'legend-item';
//       item.style.display = 'flex';
//       item.style.alignItems = 'center';
//       item.style.gap = '10px';
      
//       const line = document.createElement('div');
//       line.style.backgroundColor = color;
//       line.style.height = height;
//       line.style.width = '30px';
      
//       item.appendChild(line);
//       item.appendChild(document.createTextNode(text));
//       wrapper.appendChild(item);
//     });
    
//     this.container.appendChild(wrapper);
//     return wrapper;
//   }
// }

export class Legend {
  constructor(targetId) {
    this.container = document.getElementById(targetId);
    this.sections = {};
    this.buildingMode = 'ion'; // 'ion' or 'vworld'
    this._render();
  }
  
  _render() {
    this.container.innerHTML = '';
    
    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = 'Legend';
    this.container.appendChild(title);
    
    this.sections.buildings = this._addBuildingLegend();
    this.sections.dem = this._addDEMLegend();
    this.sections.colorRelief = this._addColorReliefLegend();
    this.sections.contours = this._addContourLegend();
    
    // Set initial visibility
    this.showSection('buildings', true);
    this.showSection('dem', false);
    this.showSection('colorRelief', false);
    this.showSection('contours', false);
  }
  
  showSection(name, visible) {
    if (this.sections[name]) {
      this.sections[name].style.display = visible ? 'block' : 'none';
    }
  }

  // NEW: Switch between Ion and V-World building legends
  setBuildingMode(mode) {
    if (this.buildingMode === mode) return;
    this.buildingMode = mode;
    
    // Remove old building section
    if (this.sections.buildings) {
      this.sections.buildings.remove();
    }
    
    // Add new building section
    this.sections.buildings = this._addBuildingLegend();
    
    // Insert it at the top (after title)
    const title = this.container.querySelector('.panel-title');
    if (title && title.nextSibling) {
      this.container.insertBefore(this.sections.buildings, title.nextSibling);
    }
  }
  
  _addBuildingLegend() {
    const wrapper = document.createElement('div');
    const label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = 'Buildings';
    wrapper.appendChild(label);
    
    if (this.buildingMode === 'ion') {
      // Detailed Ion legend
      const types = [
        { color: '#FF6B6B', label: 'High-Rise (Apts/Condo)' },
        { color: '#4ECDC4', label: 'Medium-Rise (Comm/Office)' },
        { color: '#98D8C8', label: 'Low-Rise (Houses)' },
        { color: '#A29BFE', label: 'Industrial (Factory/Wh)' },
        { color: '#FFE66D', label: 'Public (School/Gov)' },
        { color: '#DFE6E9', label: 'Small (Sheds/Garages)' },
        { color: '#ADD8E6', label: 'Other' }
      ];
      
      types.forEach(({ color, label: text }) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = color;
        
        const textEl = document.createElement('span');
        textEl.textContent = text;
        
        item.appendChild(colorBox);
        item.appendChild(textEl);
        wrapper.appendChild(item);
      });
    } else {
      // Simplified V-World legend - just one entry
      const item = document.createElement('div');
      item.className = 'legend-item';
      
      const colorBox = document.createElement('div');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = '#ADD8E6';
      
      const textEl = document.createElement('span');
      textEl.textContent = 'Buildings (V-World)';
      
      item.appendChild(colorBox);
      item.appendChild(textEl);
      wrapper.appendChild(item);
      
      // Optional: Add a note
      const note = document.createElement('div');
      note.style.fontSize = '11px';
      note.style.color = '#888';
      note.style.fontStyle = 'italic';
      note.style.marginTop = '4px';
      note.textContent = 'Category data not available';
      wrapper.appendChild(note);
    }
    
    this.container.appendChild(wrapper);
    return wrapper;
  }
  
  _addDEMLegend() {
    const wrapper = document.createElement('div');
    const label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = 'DEM Elevation';
    wrapper.appendChild(label);
    
    const gradient = document.createElement('div');
    gradient.className = 'legend-gradient';
    gradient.style.background = 'linear-gradient(to right, #1a9850, #91cf60, #d9ef8b, #fee08b, #fc8d59, #d73027, #ffffff)';
    wrapper.appendChild(gradient);
    
    const labels = document.createElement('div');
    labels.className = 'legend-labels';
    labels.innerHTML = '<span>0m</span><span>1000m</span><span>1950m</span>';
    wrapper.appendChild(labels);
    
    this.container.appendChild(wrapper);
    return wrapper;
  }
  
  _addColorReliefLegend() {
    const wrapper = document.createElement('div');
    const label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = 'Color Relief';
    wrapper.appendChild(label);
    
    const gradient = document.createElement('div');
    gradient.className = 'legend-gradient';
    gradient.style.background = 'linear-gradient(to right, #00008b, #0000ff, #00bfff, #00ff00, #ffff00, #8b4513)';
    wrapper.appendChild(gradient);
    
    const labels = document.createElement('div');
    labels.className = 'legend-labels';
    labels.innerHTML = '<span>0m</span><span>1000m</span><span>1950m</span>';
    wrapper.appendChild(labels);
    
    this.container.appendChild(wrapper);
    return wrapper;
  }
  
  _addContourLegend() {
    const wrapper = document.createElement('div');
    const label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = 'Contours';
    wrapper.appendChild(label);
    
    const items = [
      { color: '#8B4513', label: 'Major (200m)', height: '4px' },
      { color: '#c8a882', label: 'Minor (50m)', height: '2px' }
    ];
    
    items.forEach(({ color, label: text, height }) => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '10px';
      
      const line = document.createElement('div');
      line.style.backgroundColor = color;
      line.style.height = height;
      line.style.width = '30px';
      
      item.appendChild(line);
      item.appendChild(document.createTextNode(text));
      wrapper.appendChild(item);
    });
    
    this.container.appendChild(wrapper);
    return wrapper;
  }
}