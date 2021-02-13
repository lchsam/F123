/* globals AFRAME THREE */

// assembled info from: https://stackoverflow.com/questions/56299870/aframe-how-to-use-flat-shading-on-a-mesh
AFRAME.registerComponent("model-unlit", {
  init: function () {
    this.el.addEventListener('model-loaded', this.update.bind(this), { once: true });
  },
  update: function() {
    let mesh = this.el.getObject3D('mesh'); // gets the gltf scene
    if (!mesh) { return; }
    mesh.traverse(function(node) {
      if (node.material) {
        node.material = new THREE.MeshBasicMaterial({ map: node.material.map, color: node.material.color });
      }
    })
  }
  // Note (Sam): i assume there is no remove function to remove the eventlistener
  // because rarely do we remove a model-unlit component.
});
