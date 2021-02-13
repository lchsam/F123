/* globals allSounds */
/* Manage what should be done when user presses start */

const coreUtils = {
  startGame: async () => {
    
    
    const titleScreen = document.getElementById('titleScreen');
    // fade out the title
    titleScreen.emit('startTitleScreenFadeOutAnimation', null, false);
    
    // start the game
    const titleAnimationFinished = coreUtils.createEventPromise(titleScreen, 'animationtimelinecomplete');
    await titleAnimationFinished;
    
    const environment = document.getElementById('environment');
    const lowPolyDetailedPlaneEntity = document.getElementById('lowPolyDetailedPlaneEntity');
    const subtitles = document.getElementById('subtitleEntity');
    
    allSounds.introductoryNarration.play();
    environment.emit('startIntroductoryNarrationAnimation', null, false);
    lowPolyDetailedPlaneEntity.emit('startIntroductoryNarrationAnimation', null, false);
    subtitles.emit('startSubtitle', null, false);
    
  },
  /*
   * Creates a promise that resolves when an event is emitted for that element
   * It takes in an optional criteria boolean function, promise resolves when criteria returns true
   * @param {HTMLElement} element - the element to listen for event
   * @param {string} eventName - the name of the event
   * @param {(evt: Event) => boolean} [criteria] - optional function that can check the event obj.
   * @return {Promise} 
   */
  createEventPromise: (element, eventName, criteria) => {
    return new Promise(resolve => {
      const eventHandler = (evt) => {
        if (!criteria || (criteria && criteria(evt))) {
          resolve(evt);
        }
      };
      element.addEventListener(eventName, eventHandler, { once: true });
    });
  }
};
