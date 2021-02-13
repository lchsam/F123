/* globals AFRAME */

// Taken from https://stackoverflow.com/questions/43914818/alpha-animation-in-aframe-for-a-object-model
//  E.g. <a-entity model-opacity="1">
AFRAME.registerComponent('model-opacity', {
  dependencies: ['model-unlit'],
  // this is definitely debatable, changing opacity shouldn't require making the model unlit
  // But A-Frame tends to recommend having all models unlit and have a texture of some sort to have good performance
  // So I'll go with that route.
  schema: { type: 'number', default: 1.0},
  init: function () {
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function () {
    let mesh = this.el.getObject3D('mesh');
    let data = this.data;
    if (!mesh) { return; }
    mesh.traverse(function (node) {
      if (node.isMesh) {
        node.material.opacity = data;
        node.material.transparent = data < 1.0;
        node.material.needsUpdate = true;
      }
    });
  },
  // Note (Sam): i assume there is no remove function to remove the eventlistener
  // because very would there we remove a model-opacity component.
});