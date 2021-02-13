/* globals AFRAME THREE coreUtils isAppleDevice isMac Howl*/

/* "main" component, like a main funcion that gets run 
 */
AFRAME.registerComponent('main', {
  events: {
    done: function(evt) {
      evt.target.parentNode.removeChild(evt.target);
      // any component that emits a 'done' event will be noticed
      // by this event listener and delete the component that emitted it.
      // refer to button-component's emitting done event for example
    },
    
    animationcomplete: function(evt) {
      if (!evt.detail) {
        return;
      }
      
      if (evt.detail.name.endsWith('_disappear')) { // if animation name ends with _disappear
        evt.target.parentNode.removeChild(evt.target); // remove the element that is associated with the animation
        // any animation's name ends with '_disappear' will have its attached
        // element removed at the end of the animation
      }
      
    }
  },
  
  /**
   * If user is using an Apple device, Apple has audio restrictions
   * This basically has the user click/touch the screen so audio can be unlocked (for Howler.js to play the audio)
   */
  triggerAppleAudioDialog: function() {
    if (isAppleDevice) {
      const dialogContainer = document.getElementById('appleAudioButtonContainer');
      dialogContainer.style.removeProperty('display'); // this makes the element visible
      const eventName = isMac ? 'click' : 'touchstart';
      document.addEventListener(eventName, () => {
        dialogContainer.style.display = 'none';
      }, { once: true });
    }
    
  },
  init: async function() {
    this.triggerAppleAudioDialog();
    
    const timelines = document.getElementById('timelines');
    const titleScreen = document.getElementById('titleScreen');
    const environment = document.getElementById('environment');
    
    if (!titleScreen || !environment) { // not sure to keep this or not
      return;
    }
    
    // wait for templates to load
    
    
    titleScreen.setAttribute('template', { src: 'src/templates/title-screen-template.html' });
    
    await coreUtils.createEventPromise(titleScreen, 'templaterendered');
    await coreUtils.createEventPromise(titleScreen, 'loaded');
    
    environment.setAttribute('template', { src: 'src/templates/introduction-narration-template.html' });
    await coreUtils.createEventPromise(environment, 'templaterendered')
    await coreUtils.createEventPromise(environment, 'loaded');
    
    // set the timeline
    titleScreen.setAttribute('animation-timeline', { 
      timeline: '#titleScreenFadeOutTimeline',
      startEvents: 'startTitleScreenFadeOutAnimation'
    });
    
    environment.setAttribute('animation-timeline', {
      timeline: '#introductoryNarrationTimeline',
      startEvents: 'startIntroductoryNarrationAnimation'
    });
    
    const lowPolyDetailedPlaneEntity = document.getElementById('lowPolyDetailedPlaneEntity');
    lowPolyDetailedPlaneEntity.setAttribute('animation-timeline', {
      timeline: '#introductoryNarrationPlaneFlyoverTimeline',
      startEvents: 'startIntroductoryNarrationAnimation'
    });
    
    const sceneGroups = environment.querySelectorAll('.grouping');
    //scene groups are how I definite a scene in the narration, one pair of pictures in a narration is a scene group
    
    
    for (let i = 0; i < sceneGroups.length; i++) {
      sceneGroups[i].setAttribute('visible', true);
    }
    
    setTimeout(() => {
      for (let i = 0; i < sceneGroups.length; i++) {
        sceneGroups[i].setAttribute('visible', false);
      }
    }, 10); // hacky way to load in some textures and geometries in to memory beforehand
    
//     let imiICharacter = scene.querySelector("#imi-i");
//     const animParam = {
//       targets: imiICharacter.object3D.position,
//       z: [-6, -4],
//       easing: "easeOutQuart",
//       duration: 2200
//     };

//     AFRAME.ANIME(animParam);
    
    // scene.addEventListener('enter-vr', (evt) => {
    //   AFRAME.log(evt); // still need to test if this works the events obj
    // });
    
    
  }
});
