/* globals THREE Howler Howl */

/** 
 * If agent is an apple device, use Howler.js for sounds, instead of default <Audio>
 * Exposes isAppleDevice and isMac to allow code to handle what to do
 * (e.g. in all-sounds.js)
 */

const isAppleDevice = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
const isMac = /Mac/i.test(navigator.platform);

(() => {
  
  if (!isAppleDevice) {
    return
  }
  
  if (!Howler.ctx) {
    new Howl({
      // dummy howl object to file Howler initialize a Audiocontext
      src: ['https://cdn.glitch.com/a3988a7e-ed4c-4c25-b933-e6a6bec166d0%2Fvoice-with-bgm-sound.mp3?v=1604444268537'],
      html5: true,
    });
  }

  if (Howler.usingWebAudio) {
    THREE.AudioContext.setContext(Howler.ctx);
    // Have three.js use Howler's audio context so that when Howler unlocks its audio context, Three will
    // have that too.
  }
})();
