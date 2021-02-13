/* globals AFRAME THREE */

/* @author Sam Lee <https://github.com/lchsam> 
 * Somewhat inspired from the aframe-alongpath-component,
 * follow-curve components has the entity follow a given curve defined by the aframe curve component
 * or my custom svg curve component. The following will be animated by you with the animation component.
 * Note: alongpath-component suffers from three downfalls:
 *  - All animation are linear so easing is impossible
 *  - The logic uses object3D.lookAt which can be troublesome to debug when dealing with animating objects along a curve
 *  - Object3D.lookAt will fail when object is under a parent with additional transformations/rotations
 * This component fixes all of that.
 * Below are the properties and instance variables:
 * Properties: (? means optional property)
 *  - curve: HTMLElement - the curve element, could be the aframe curve component or the svg-curve component
 *  - followRotation?: boolean - determines if the entity will turn when it follows the curve
 *  - i?: number - determines how far to go along the curve from 0 to 1, 0 being the start, 1 being the end of the curve
 *  - smoothness?: number - determines how smooth it turns along sharp edges in a curve, range from (0, 1]
 *                          Lower value means smoother but not accurate to the curve while higher value means not smooth
 * Instance variables:
 *  - animationI - conceptually the same as 'i' in properties but more efficient, modify this for animation
 *                 e.g. for animation component, animation="property: components.follow-curve.animationI; from: 0;..."
 *                      Refer to bottom for how this works
 */

AFRAME.registerComponent("follow-curve", {
  schema: {
    curve: {type: 'selector', default: ''},
    followRotation: { type: 'boolean', default: true },
    i: { type: 'number', default: 0.0001 },
    smoothness: { type: 'number', default: 0.1 }
  },
  
  // Given @position, sets position of @object3D
  setPosition: (position, object3D) => {
    const {x, y, z} = position;
    object3D.position.x = x;
    object3D.position.y = y;
    object3D.position.z = z;
  },
  
  init: function() {
    this.axis = new THREE.Vector3(); // used for calculating rotation, a placeholder vector
    this.placeholderQuaternion = new THREE.Quaternion(); // used for rotating the object smoother
    if (this.data.curve !== null) {
      this.boundedUpdateFn = this.update.bind(this);
      this.data.curve.addEventListener('curve-updated', this.boundedUpdateFn);
    }
    
    // defines a setter, setters do not work when declared in a component object, hence I am using defineProperty
    Object.defineProperty(this, 'animationI', {
      set: function(animationI) {
        const currentPosition = this.curve.getPoint(animationI);
        this.setPosition(currentPosition, this.el.object3D);
        if (this.data.followRotation) {
          const tangent = this.curve.getTangent(animationI).normalize(); 
          // get "tangent" of curve (not really tangent, it's the vector perpendicular to the tangent of the curve)
          this.axis.crossVectors(this.el.object3D.up, tangent).normalize(); // get rotation axis formed by up and tangent
          const radians = Math.acos(this.el.object3D.up.dot(tangent)); // ge the angle formed between up and tangent
          this.placeholderQuaternion
              .copy(this.el.object3D.quaternion) // copies the object3D's quaternion
              .setFromAxisAngle(this.axis, radians); // rotates it from given axis
          this.el.object3D.quaternion.slerp(this.placeholderQuaternion, this.data.smoothness); 
          // use rotated quaternion but interpolated to make it spin smoother
        }
      }
    });
  },
  
  update: function(oldData) {
    
    // going to ignore setAttribute updates for now.
    const { curve, i } = this.data;
    if (curve === null) {
      throw new Error('No curve given for follow-curve component\n E.g. <a-entity follow-curve="curve: #idName">')
    }
    const isAFrameCurve = curve.components['curve'] !== undefined 
    const isSvgCurve = curve.components['svg-curve'] !== undefined
    if (!isAFrameCurve && !isSvgCurve) {
      throw new Error('Given curve is not a a-curve or a a-svg-curve\n E.g. <a-curve> or <a-svg-curve>')
    }
    
    if (oldData.curve && oldData.curve !== curve) { // if the curve is changed/updated
      oldData.curve.removeEventListener('curve-updated', this.boundedUpdateFn);
      curve.addEventListener('curve-updated', this.boundedUpdateFn);
    }
    
    if (isAFrameCurve) { // if it's aframe's curve
      this.curve = curve.components.curve.curve; // curve component has a curve instance variable
    } else if (isSvgCurve && curve.components['svg-curve'].loaded) {
      this.curve = curve.components['svg-curve'].curve;
    } else if (isSvgCurve && !curve.components['svg-curve'].loaded) {
      this.curve = undefined;
      return; // if the svg curve is not loaded, don't do anything and wait until it's loaded from event listener
    }
    
    this.animationI = i;
    
  },
  remove: function() {
    this.data.curve.removeEventListener('curve-updated', this.boundedUpdateFn);
  },
});


// The main idea is you would use this component like this:
// <a-entity gltf-model="#someModel" follow-curve="curve: #somecurve"></a-entity>
// Then you would animate the model going along the curve by modifying its animationI variable 
// like so using animation component:
// animation="property: components.follow-curve.animationI; from: 0; to: 1; dur: 1000; easing: easeInOutSine;"
// Note that the follow-curve syntax there is not valid javascript (uses dash), it works because A-Frame parses the
// animation property by splitting by each period so it just so happens to work.
// The animation component would modify animationI to animate the model. animationI is a setter that does
// all the grunt work of changing the model's position and rotation. The reason why it's a setter is because
// the animation component modifies object properties and do not call functions, so the next best thing are
// setters which call functions when variables are set to a value.