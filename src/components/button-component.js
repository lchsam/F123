/* globals AFRAME allSounds */

/**
 * button component
 * 
 * Responsible for all UI elements of the button
 * For logic of a button, create a new component with this button set
 * as its dependency and have that component listen for click events
 * Refer to start-button for example and its HTML counterpart.
 */
AFRAME.registerComponent("button", {
  schema: {
    text: {type: 'string', default: 'No text'}, // button text
    backgroundColor: {type: 'color', default: '#fff'}, // button background color
    textColor: {type: 'color', default: '#595959'}, // self explanatory
  },
  events: {
    // Event bubbling allows the backgroundPlane (a child entity) which can be detected by the cursor
    // to trigger the event listeners declared below
    // https://javascript.info/bubbling-and-capturing
    // Another note, best practice is to have low number of
    // event listeners for an entity, refer to the bottom for an explanation (A)
    mouseenter: function(evt) {
      if (this.clicked) {
        return;
      }
      allSounds.buttonHovered.play();
      this.handleMouseEnterAnimation();
    },
    mouseleave: function(evt) {
      if (this.clicked) {
        return;
      }
      this.handleMouseLeaveAnimation();
    },
    click: function(evt) {
      if (this.clicked) { // ignore events triggered by myself
        return;
      }
      
      // play button pressed sound
      allSounds.buttonHovered.stop();
      allSounds.buttonPressed.play();
      this.clicked = true;
      this.handleClickAnimation();
      
    }
  },
  init: function() {
    // collider for the cursor/controls for clicking/hovering...etc
    const colliderPlane = document.createElement('a-plane');
    colliderPlane.classList.add('collidable');
    // cursors will now emit mouse events to colliderplane
    colliderPlane.setAttribute('position', '0 0 0');
    colliderPlane.setAttribute('scale', '1.28 0.6 0.6');
    colliderPlane.setAttribute('visible', false);
    this.el.appendChild(colliderPlane);

    // background color plane
    const backgroundPlane = document.createElement('a-plane');
    backgroundPlane.setAttribute('position', '0 0 0');
    backgroundPlane.setAttribute('scale', '1.25 0.5 0.5');
    backgroundPlane.setAttribute('material', {
      shader: 'flat',
      transparent: true,
      opacity: 1,
    });
    this.el.appendChild(backgroundPlane);
    
    // There was a problem I encountered, refer to explanation at the bottom (D)
    const buttonText = document.createElement('a-text');
    buttonText.setAttribute('font', 'dejavu');
    buttonText.setAttribute('align', 'center');
    buttonText.setAttribute('scale', '1 1 1');
    buttonText.setAttribute('letter-spacing', -2.5);
    buttonText.setAttribute('position', '0 0.03 0.01');
    this.el.appendChild(buttonText);
    
    // a spinning triangle when hovering for aesthetics
    // Looks like thick lines in aframe is a windows problem, refer to explanation at the bottom (B)
    // Using Meshline component instead
    const backgroundTriangle = document.createElement('a-entity');
    backgroundTriangle.setAttribute('meshline', {
      lineWidth: 0.05,
      lineWidthStyler: '1',
      path: '0 0.5 0.05, 0.433 -0.25 0.05, -0.433 -0.25 0.05, 0 0.5 0.05',
      sizeAttenuation: 1,
    });
    backgroundTriangle.setAttribute('scale', '0 0 0')
    backgroundTriangle.setAttribute('visible', false);
    // Refer to explanation at the bottom for a problem I encountered (D)
    // Refer to explanation at the bottom (C) for why I used event listeners but then didn't.
    
    this.el.appendChild(backgroundTriangle);
    
    // drop shadow plane
    const shadowPlane = document.createElement('a-plane');
    shadowPlane.setAttribute('position', '0 0 0.001');
    shadowPlane.setAttribute('scale', '1.27 0.5 0.5');
    shadowPlane.setAttribute('color', '#303030');
    shadowPlane.setAttribute('rotation', '0 0 2');
    shadowPlane.setAttribute('material', {
      shader: 'flat',
      transparent: true,
      opacity: 0
    })
    this.el.appendChild(shadowPlane);
    
    this.backgroundPlane = backgroundPlane;
    this.backgroundTriangle = backgroundTriangle;
    this.buttonText = buttonText;
    this.shadowPlane = shadowPlane
    this.clicked = false;
    
  },
  
  update: function() {
    const { backgroundColor, textColor, text } = this.data;
    this.backgroundPlane.setAttribute('color', backgroundColor);
    this.backgroundTriangle.setAttribute('meshline', { color:  backgroundColor });
    this.buttonText.setAttribute('color', textColor);
    this.buttonText.setAttribute('value', text);
    
  },
  
  handleMouseEnterAnimation: function() {
    const animation = {
      property: 'object3D.position.z',
      easing: 'easeOutQuint',
      dur: 550,
      delay: 0,
    };
    
    this.backgroundPlane.setAttribute('animation__z', {
      ...animation,
      from: 0,
      to: 0.25
    });
    
    this.backgroundPlane.setAttribute('animation__rotation', {
      ...animation,
      property: 'rotation',
      from: '0 0 0',
      to: '-0.29 0.75 -3.78'
    });
    
    this.buttonText.setAttribute('animation__z', {
      ...animation,
      from: 0.01,
      to: 0.50
    });
    
    this.buttonText.setAttribute('animation__opacity', {
      ...animation,
      property: 'components.text.material.uniforms.opacity.value',
      from: 1,
      to: 2.2
    });
    
    this.shadowPlane.setAttribute('animation__opacity', {
      ...animation,
      property: 'components.material.material.opacity',
      delay: 100,
      from: 0,
      to: 0.75
    });
    
    this.backgroundTriangle.setAttribute('animation__scale', {
      ...animation,
      property: 'scale',
      from: '0 0 0',
      to: '1 1 1',
      delay: 10,
    });
    
    this.backgroundTriangle.removeAttribute('animation__visible');
    this.backgroundTriangle.object3D.visible = true;
    
    const randomAngle = Math.round(Math.random() * 360);
    this.backgroundTriangle.setAttribute('animation__rotationz', {
      property: 'object3D.rotation.z',
      from: randomAngle,
      to: randomAngle + 360,
      loop: true,
      dur: 3200,
      easing: 'linear'
    });
    
    
    
  },
  
  handleMouseLeaveAnimation: function() {
    const animation = {
      property: 'object3D.position.z',
      easing: 'easeOutQuint',
      dur: 550,
      delay: 0
    };
    this.backgroundPlane.setAttribute('animation__z', {
      ...animation,
      from: 0.25,
      to: 0
    });
    
    this.backgroundPlane.setAttribute('animation__rotation', {
      ...animation,
      property: 'rotation',
      from: '-0.29 0.75 -3.78',
      to: '0 0 0',
    });
    
    this.buttonText.setAttribute('animation__z', {
      ...animation,
      from: 0.55,
      to: 0.01
    });
    
    this.buttonText.setAttribute('animation__opacity', {
      ...animation,
      property: 'components.text.material.uniforms.opacity.value',
      from: 2.2,
      to: 1
    });
    
    this.shadowPlane.setAttribute('animation__opacity', {
      ...animation,
      dur: 250,
      property: 'components.material.material.opacity',
      from: 0.75,
      to: 0
    });
    
    this.backgroundTriangle.setAttribute('animation__scale', {
      ...animation,
      property: 'scale',
      from: '1 1 1',
      to: '0 0 0',
    });
    
    // if you look at this code, it doesn't make much sense
    // let me explain at the bottom of this (explanation (E))
    this.backgroundTriangle.setAttribute('animation__visible', {
      dur: 1,
      property: 'object3D.visible',
    });
    
    setTimeout(() => {
      if (this.backgroundTriangle.hasAttribute('animation__visible')) {
        this.backgroundTriangle.setAttribute('animation__visible', { to: false });
        this.backgroundTriangle.removeAttribute('animation__rotationz');
      }
    }, animation.dur * 4/5);
    
  },
  
  handleClickAnimation: function() {
    const animation = {
      property: 'object3D.position.z',
      easing: 'easeOutQuint',
      dur: 450,
      delay: 0,
    };
    
    this.backgroundPlane.setAttribute('animation__z', {
      ...animation,
      from: 0.25,
      to: -0.15
    });
    
    this.backgroundPlane.setAttribute('animation__opacity', {
      ...animation,
      property: 'components.material.material.opacity',
      from: 1,
      to: 0,
    });
    
    this.shadowPlane.setAttribute('animation__opacity', {
      ...animation,
      dur: animation.dur / 2,
      property: 'components.material.material.opacity',
      from: 0.75,
      to: 0
    });
    
    
    this.backgroundTriangle.setAttribute('animation__linewidth', {
      ...animation,
      property: 'meshline.lineWidth',
      from: 0.05,
      to: 0,
      dur: animation.dur * 9 / 10
    });
    // The optimal way of animating the line width directly
    // does not work on Mobile and Oculus quest, so I had to use the above method instead
    
    this.buttonText.setAttribute('animation__opacity', {
      ...animation,
      property: 'components.text.material.uniforms.opacity.value',
      from: 2.2,
      to: 0,
    });
    
    setTimeout(() => {
      this.el.emit('done');
    }, animation.dur);
    // I made it so that when a done event is emitted,
    // an ancestor entity's component will see it and remove said element
    // Basically, telling its ancestor that this entity can now be removed.
    
  }
});

// (A)
// The set up of the code is the plane will be detected by a cursor 
// and receive a mouse-related event, and that event gets bubbled up
// to this entity, caught by this button component.
// There are two ways to achieve the above animation.
// 1. Have each child entity (plane and text..etc) listen for events
//    with the animation component, button component will take mouse
//    events and emit animation events to trigger animation for the
//    plane and text..etc.
//    Pros: All animation is baked into the component from the get-go
//    during initalization
//    Cons: Many listeners
// 2. The only listener will be in this component and for incoming mouse-
//    events, it will modify the animation attribute to start
//    animations for the plane, text...etc
//    Pros: Only one listener is used
//    Cons: Modifying animation attributes for every element that needs
//    to be animated.
   
// Verdict: Event delegation is the idea that we have one single event
// listener for one type of event (e.g. click) to handle events for the
// entire page. That apparently is more performant than having listeners
// for every little bit of the page that needs to listen for events.
// This means that having one single listener modifying
// the animation component attribute seems to be the better choice.

// (B)
// It looks like ANGLE, the WebGL to DirectX wrapper that windows uses just does
// not have this fixed so we can't have lines with varying widths.
// Since it's broken in Three.js, it's also broken too in Aframe.
// Hence, I am using Threejs meshline
// https://stackoverflow.com/questions/11638883/thickness-of-lines-using-three-linebasicmaterial

// (C)
// Originally, I wanted some triangles to fade in and out on hover so I looked into changing opacity
// for the aframe-meshline-component but it actually does not have opacity support.
// To change the opacity, I have to go to the underlying Three.js mesh material.
// To do that, we have to make sure that the mesh is initialized but the init lifecycle
// hook is way too early to make any changes to the mesh as the meshline component hasn't
// added the mesh to the Three.js scene yet. So I had to use a event listener to know when
// the meshline component has finished loading its children and the actual Three JS meshline object.
// backgroundTriangle.addEventListener('loaded', () => {
//   this.backgroundTriangle.getObject3D('mesh').material.transparent = true;
//   this.backgroundTriangle.getObject3D('mesh').material.opacity = 0
// });
// When I finally got it working, meshline with transparent set to true does not work on mobile
// nor my Oculus Quest, so I have to scrap everything and use scale for hovering in and out.

// (D)
// There was problem where the completely transparent triangle was occluding the text.
// I looked into blending modes, render order and text transparency.
// Setting the text transparent to false works but created these white outlines on the text that
// I can't get rid of. Then I came across Aframe's transparent issues section.
// https://aframe.io/docs/1.0.0/components/material.html#transparency-issues
// What fixed the problem was adding the text element before the triangle in the scene.

// (E)
// A-Frame explained in the docs that for animating boolean values, they become their final
// value at the end of the duration. I quote "[The animation component] can “animate” boolean values where the to 
// value will be applied at the end of the animation. Like property: visible; from: false; to: true; dur: 1."
// But it doesn't work. The animation component just sets property visible to true immediately.
// Why exactly do I need this? I have a rotating triangle that I want to make invisible after it has scaled down to 0 0 0.
// (The triangle is still there in scale 0 0 0). I thought I could make the visibility false after a set time with
// the animation component but it does not work. Another workaround is to just use a settimeout to make the triangle
// invisible after a set time, we would need a bit more code to clean up/remove settimeout in case we don't need to
// make the triangle disappear e.g. when the mouse enters the button when the timer is ticking to make the triangle
// invisible. I don't want to write that "clean up/remove code" so I relied on the animation__visible attribute as a
// marker for when a settimeout is actually ticking. If it's removed, nothing will be done.
// I use the marker also for stopping rotation of the triangle.

// (F)
// Chrome doesn't let uses play sound unless they have interacted with the site.
// If the site does do it, it'll throw an error saying I have to handle the promise play() returns.
// I don't really mind if the sound doesn't play when hovering, I just need to get rid of the error.