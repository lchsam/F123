/* globals AFRAME THREE */

/* @author Sam Lee <https://github.com/lchsam>
 * subtitle component - creates subtitles in the environment, that follows the camera with some delay
 * Below are the properties and instance variables:
 * Properties: (? means optional property)
 *  - subtitleAsset: HTMLElement - the element that refers to some JSON file, go to bottom of file to know schema of JSON
 *  - offset: Vector3 - a vector that specifies the offset, with 0, 0, 0, being the center of the view
 *  - startEvent: string - the name of the event to trigger, you need this to trigger the start of the subtitle.
 * E.g.
 * HTML: <a-entity subtitle="subtitleAsset: #idSelectorOfJSONElement, startEvent: startSubs">...
 * JS: subtitleElement.emit('startSubs')
 */

AFRAME.registerComponent('subtitle', {
  schema: {
    subtitleAsset: { type: 'selector', default: '' },
    offset: { type: 'vec3', default: '0 -0.5 0'}, // [-1, 1] for x and y
    startEvent: { type: 'string', default: ''}
  },
  init: function() {
    this.lastCameraQuaternion = new THREE.Quaternion(); // stores the last camera quaternion, updates when you move your view
    this.placeholderVector = new THREE.Vector3(); // vector for calculating ideal position of subtitle
    
    this.el.setAttribute('text', { value: '-'.repeat(300), align: 'center' }); 
    // if i use space for the filler text, it causes subseqent subtitles to disappears randomly, frustumCulling issue probably.
    this.el.object3D.visible = false;
    this.epsilon = 0.0000000001; // threshold for how close subs are animated to the exact ideal location on screen.
    
    this.currentMilli = 0; // keep track of elapsed time for subtitles.
    this.currentSubtitleIndex = 0; // keep track of which subtitle to show
    
    this.withinSubtitle = false; // to see if we're within the right time window to show the subtitle
    this.beyondSubtitle = false; // to see if we're beyond the ending time of the current subtitle
    
    this.subtitleAsset = JSON.parse(this.data.subtitleAsset.data);
    
    this.started = false;
    
    this.triggerEventStart = this.triggerEventStart.bind(this);
    if (this.data.startEvent.length > 0) {
      this.el.addEventListener(this.data.startEvent, this.triggerEventStart)
    }
  },
  triggerEventStart: function() {
    this.started = true;
    this.el.object3D.visible = true;
  },
  remove: function() {
    this.el.removeAttribute('text');
    if (this.data.startEvent.length > 0) {
      this.el.removeEventListener(this.data.startEvent, this.triggerEventStart);
    }
  },
  tick: function(time, deltaTime) {
    if (this.started) { // anything in the if statement is for handling text updates
    
      this.currentMilli += deltaTime;
      while (this.beyondSubtitle = this.currentMilli > this.subtitleAsset[this.currentSubtitleIndex].endMilli) {
        if (this.currentSubtitleIndex === this.subtitleAsset.length - 1) {
          break;
        }
        this.currentSubtitleIndex++;
      }
      // while loop basically, makes sure the current subtitle index is correct, since deltaTime (time between each frame)
      // can vary and so we can possibly have cases where you at at subtitle[0] but can jump to subtitle[3] because of 
      // dropped frames

      this.withinSubtitle = this.subtitleAsset[this.currentSubtitleIndex].startMilli <= this.currentMilli && !this.beyondSubtitle;

      if (this.withinSubtitle) {
        this.el.setAttribute('text', { value: this.subtitleAsset[this.currentSubtitleIndex].text });
        this.el.object3D.visible = true
        // it looks like the text component optimises fairly well on setting text of the same value
        // so I don't really need to be conservative in the times I call setAttribute.
      } else {
        this.el.object3D.visible = false;
      }
    }
    // anything below is for handling text positioning
    
    if (!this.lastCameraQuaternion.equals(this.el.sceneEl.camera.parent.quaternion)) { // checks if you rotated your camera
      this.lastCameraQuaternion.copy(this.el.sceneEl.camera.parent.quaternion); // save your latest camera rotaion
      this.placeholderVector.set(this.data.offset.x, this.data.offset.y, -1 + this.data.offset.z)
      // placeholderVector holds the vector of the ideal position of the subtitle text
      // in the context of the camera being at (0, 0, 0)
      this.placeholderVector.applyQuaternion(this.el.sceneEl.camera.parent.quaternion);
    }
    
    
    if (this.placeholderVector.distanceToSquared(this.el.object3D.position) < this.epsilon) {
      return;
    }
    this.el.object3D.position.sub(this.el.sceneEl.camera.parent.position);
    // make our subtitle position in the context of camera being at (0, 0, 0)
    this.el.object3D.position.lerp(this.placeholderVector, 0.04); // lerpppppp
    // now that object position is in the space that assumes the camera is at (0, 0, 0), lerp it to ideal position
    this.el.object3D.position.add(this.el.sceneEl.camera.parent.position); // offset it back
    // offset the subtitle position back to actual space
    this.el.object3D.quaternion.slerp(this.el.sceneEl.camera.parent.quaternion, 0.05); // slerppp
    
  },
});


// Example JSON file
// [
//   {
//     "text": "Developed and narrated by Sam Lee",
//     "startMilli": 0,
//     "endMilli": 5000
//   },
//   {
//     "text": "The cars we drive to work, and the planes we go on for vacations are safer than ever.",
//     "startMilli": 6400,
//     "endMilli": 13799
//   },
// ]
// General rule of thumb is to show the text around 500 ms before the voice begins to play.