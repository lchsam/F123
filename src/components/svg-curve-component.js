/* globals AFRAME THREE */

/**
 * svg-path component
 * 
 * A component that loads an svg path (if there are multiple paths, it'll get the first one)
 * and store that path as an instance variable.
 * It's meant to be used with the meshline component by having that component select it.
 * To check if it has loaded the svg, check if its `loaded` variable is true, if not,
 * listen for a 'curve-updated' event
 * Listed below are the instance variables you can access along with their types
 * - curve: THREE.CurvePath
 * - loaded: boolean
 */
AFRAME.registerComponent("svg-curve", {
  schema: {
    src: { type: 'string', default: '' },
    offset: { type: 'vec3', default: {x: 0, y: 0, z: 0}}, // offsets all points of the curve
    resize: { type: 'vec3', default: {x: 1, y: 1, z: 1}} // resizes the curve
  },
  
  // given url, returns a promise of the svg data
  loadPromisedSVGData: (url) => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.SVGLoader();
      loader.load(url, (data) => resolve(data), undefined, (err) => reject(err));
    });
  },
  
  update: async function(oldData) {
    
    const { src, offset, resize } = this.data;
    // not the most efficient with updates but will do for now
    // i.e. if offset/resize changes, svg is refetched and everything is redone which isn't too efficient
    
    if (src.length === 0) {
      throw new Error('No src given to svg-curve component or a-svg-curve');
    }
    
    this.loaded = false;
    try {
      const svgData = await this.loadPromisedSVGData(src);
      const path = svgData.paths[0];
      const curve = path.currentPath; // get CurvePath
      let points = curve.getSpacedPoints(curve.getPoints().length); // get array of points
      
      let geometry = new THREE.Geometry();
      
      for (let i = 0; i < points.length; i++) { // basically puts points in the geometry
        const {x, y} = points[i];
        geometry.vertices.push(new THREE.Vector3(x, y, 0));
      }
      geometry = geometry.center(); // center anchor point of svg
      geometry = geometry.rotateX(Math.PI); // loaded svg is upside, flip it back up
      geometry = geometry.scale(resize.x, resize.y, resize.z);
      geometry = geometry.translate(offset.x, offset.y, offset.z);
      
      points = geometry.vertices;
      
      this.curve = new THREE.CatmullRomCurve3(points); // create one single curve from the points
      
      this.loaded = true;
      this.el.emit('curve-updated', null, false); // to be as similar to the curve-component as possible
    } catch (error) {
      error.message = 'SVG cannot be loaded in svg-curve-component - ' + error.message;
      throw error;
    }
  },
});


// declares a primitives, basically you can do <a-svg-path src="some.url.com"></a-svg-path>
AFRAME.registerPrimitive('a-svg-curve', {
  defaultComponents: {
    'svg-path': {}
  },
  mappings: {
    src: 'svg-curve.src',
    offset: 'svg-curve.offset',
    resize: 'svg-curve.resize'
  }
});