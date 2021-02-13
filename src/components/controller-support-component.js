/* globals AFRAME */

/* @author Sam Lee <https://github.com/lchsam> 
 * Controller support component
 * Properly support computer + vr headsets
 */
AFRAME.registerComponent("controller-support", {
  init: function() {

    let inputSupport = '';
    const isPC = !AFRAME.utils.device.isMobile() && !AFRAME.utils.device.checkHeadsetConnected();
    if (AFRAME.utils.device.isMobile() || isPC) { // if mobile or PC
      inputSupport =
        `<a-camera ${isPC ? 'look-controls="pointerLockEnabled: true"; wasd-controls="enabled: false;"' : ''}>
           <a-cursor fuseTimeout="1000" raycaster="objects: .collidable"
                     scale="0.3 0.3 0.3"
                     animation__click="property: scale; from: 0.1 0.1 0.1; to: 0.3 0.3 0.3 easing: easeInSine; dur: 250; startEvents: click"
                     animation__fusing="property: scale; from: 0.3 0.3 0.3; to: 0.1 0.1 0.1; easing: linear; dur: 1400; startEvents: fusing"
                     animation__mouseleave="property: scale; to: 0.3 0.3 0.3; easing: easeInSine; dur: 250; startEvents: mouseleave"></a-cursor>
         </a-camera>`;
      // As noted in the docs, fuse is set to true for mobile by default.
     
    } else if (AFRAME.utils.device.checkHeadsetConnected()) {
      // check if it's a VR headset
      // apparently, my phone is detected as a headset, so this if statement would be true, hence the mobile check is first
      inputSupport = `
              <a-entity id="cameraRig">
                <a-entity id="head" camera="active: true" look-controls></a-entity>
                <a-entity laser-controls="hand: left;" 
                          raycaster="objects: .collidable; far: 5" 
                          line="color: blue; opacity: 0.75"></a-entity>
                <a-entity laser-controls="hand: right;" 
                          raycaster="objects: .collidable; far: 5" 
                          line="color: blue; opacity: 0.75"
              </a-entity>
            `.trim();
    } 
    document
      .querySelector('#player')
      .insertAdjacentHTML("beforeend", inputSupport); // insert at the end but inside #player, (no particular )
  }
});

// in-case I need it later
// teleport-controls="button: grip; collisionEntities: #ground; cameraRig: #cameraRig; teleportOrigin: #head;"></a-entity>
// wasd-controls="enabled: false;" 
