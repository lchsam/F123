/* globals AFRAME coreUtils */
// Imports below are intended for me to know where files
// are, I am not using Node.
// import coreUtils from '../core-utils.js'

AFRAME.registerComponent("start-button", {
  dependencies: ['button'],
  events: {
    click: function(evt) {
      coreUtils.startGame();
    }
  }
});