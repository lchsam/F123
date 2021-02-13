/* globals AFRAME THREE */

/* @author Sam Lee <https://github.com/lchsam>
 * instance-gltf component, assumes one mesh, baked textures, one material
 * Very important that it is one mesh, one material with one baked texture because 
 * it does not recursively look for additional meshes
 * learned the hard way, gltf needs positive scale, negative scale may render but not with instances
 * Even after applying transform to object in blender, recalculating normals is necessary so the UV's don't get
 * jumbled up in render/baked textures
 * There are no properties for this component
 * e.g. <a-entity gltf-model="#something" instsance-gltf>..<>
 */

AFRAME.registerComponent('instance-gltf', {
  dependencies: [ 'gltf-model', 'model-unlit', 'model-opacity' ], // wait for gltf component to load
  events: {
    'model-loaded': function() {
      // wait for the model to load
      this.update();
    }
  },
  stringToVector: (str) => {
    const nums = str.split(' ').map(parseFloat);
    return { x: nums[0], y: nums[1], z: nums[2] }
  },
  init: function() {
    this.mesh = null // will be used for the instancedmesh
    this.placeholderObject3D = new THREE.Object3D(); // used for calculating matrix transforms for each instance
    this.placeholderMatrix = new THREE.Matrix4();
  },
  update: function(oldData) {
    // I won't be declaring a primitive, the instances are declared from the beginning
    // for animation, they can done through this component
    // so using setAttribute is not ideal
    if (this.el.object3D.children.length === 0) { // if no model loaded
      return;
    }
    
    const instanceInfos = this.el.querySelectorAll('a-gltf-instance');
    const count = instanceInfos.length;
    
    if (count === 0) { throw new Error('No instance info provided. e.g. <a-gltf-instance position="1 1 1">')}
    
    const gltfMesh = this.el.getObject3D('mesh').children[0];
    
    const gltfGeometry = gltfMesh.geometry;
    const gltfMaterial = gltfMesh.material;
    
    this.el.removeObject3D('mesh');
    gltfMesh.geometry = null;
    gltfMesh.material = null; 
    
    this.el.object3D.children = [];
    let entityObject3D = this.el.object3D.clone(true);
    this.el.object3D.position.set(0, 0, 0);
    this.el.object3D.rotation.set(0, 0, 0);
    this.el.object3D.scale.set(1, 1, 1);
    let gltfInstance = new THREE.InstancedMesh(gltfGeometry, gltfMaterial, count);
    gltfInstance.frustumCulled = false;
    gltfMesh.updateMatrix();
    for (let i = 0; i < count; i++) {
      
      let {x, y, z} = this.stringToVector(instanceInfos[i].getAttribute('rotation') || '0 0 0'); // if no rotation default to zero vector string
      this.placeholderObject3D.rotation.set(x * THREE.Math.DEG2RAD + entityObject3D.rotation.x, 
                                            y * THREE.Math.DEG2RAD + entityObject3D.rotation.y, 
                                            z * THREE.Math.DEG2RAD + entityObject3D.rotation.z);
      this.placeholderObject3D.scale.copy(entityObject3D.scale);
      ({ x, y, z } = this.stringToVector(instanceInfos[i].getAttribute('position')));
      this.placeholderObject3D.position.set(x + entityObject3D.position.x, y + entityObject3D.position.y, z + entityObject3D.position.z);
      this.placeholderObject3D.updateMatrix();
      gltfInstance.setMatrixAt(i, this.placeholderObject3D.matrix);
    }
    gltfInstance.instanceMatrix.needsUpdate = true;
    
    this.el.setObject3D('mesh', gltfInstance);
  },
  remove: function() {
    if (this.el.getObject3D('mesh')) {
      this.el.removeObject3D('mesh');
    }
  },
});

// Three.js tip, either you manipulate the transform matrix for faster operations
// or manipulate only the position, rotation...etc to get a matrix from it, don't really try to use both unless
// you know what you are doing


