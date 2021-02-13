/* globals AFRAME THREE */

/**
 * This is for offsetting and rotating the children mesh so that the actual gltf position/rotation is not changed
 * Sometimes, you want to move the model without changing its anchor point or rotate its geometry without modifying
 * the up vector, so this is just a simple component to do just that.
 * E.g. <a-entity model-offset="offset: 1 1 1; rotationOffset: 0 0 0">
 */
AFRAME.registerComponent('model-offset', {
  schema: {
    offset: { type: 'vec3', default: {x: 0, y: 0, z: 0} },
    rotationOffset: { type: 'vec3', default: { x: 0, y: 0, z: 0} }
  },
  init: function () {
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function () {
    let mesh = this.el.getObject3D('mesh'); // gets the gltf scene
    let { offset, rotationOffset } = this.data;
    if (!mesh) { return; };
    for (let i = 0; i < mesh.children.length; i++) { // iterates over the actual objects in the gltf
      let child = mesh.children[i];
      child.position.x += offset.x;
      child.position.y += offset.y;
      child.position.z += offset.z;
      
      child.rotation.x += (rotationOffset.x * THREE.Math.DEG2RAD);
      child.rotation.y += (rotationOffset.y * THREE.Math.DEG2RAD);
      child.rotation.z += (rotationOffset.z * THREE.Math.DEG2RAD);
    }
  },
  // Note (Sam): i assume there is no remove function to remove the eventlistener
  // because very would there we remove a model-offset component.
});