/* globals Howl Howler isAppleDevice */
// import { Howl, Howler } from 'howler'
// import isAppleDevice from 'use-howler-on-apple'
// import statements do nothing, just a way for me to know where stuff came from.

/**
 * All non-positional sounds are hosted here
 * To use: allSounds.buttonPressed.play() or .stop()
 * All positional sounds are defined in HTML as usual.
 */

const allSounds = (function initSounds() {
  // update sounds url if new sounds are needed
  const soundsUrl = {
    buttonPressed: 'src/assets/sound/button-pressed-sound.mp3',
    buttonHovered: 'src/assets/sound/button-hover-sound.mp3',
    introductoryNarration: 'src/assets/sound/voice-with-bgm-sound.mp3'
  };
  
  
  let sounds = {};
  for (const key in soundsUrl) {
    if (soundsUrl.hasOwnProperty(key)) {
      let audioObject = isAppleDevice ? new Howl({ src: [ soundsUrl[key] ] }) : new Audio(soundsUrl[key])
      // Howler's sound playback has random noise artifacts on Chrome, so I am using normal Audio object
      if (!isAppleDevice) {
        audioObject.stop = audioObject.pause
      }
      sounds =  {
        [key]: audioObject,
        ...sounds
      }
    }
  }
  
  return sounds;
  
})();