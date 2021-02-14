# F123
A Web VR experience that talks about a tragic plane accident in Japan. 

Visit https://flight123.glitch.me/

<img src="https://i.imgur.com/M4e9lRu.png" alt="Screenshot of the start screen" width="500"/>

## Table of Contents
  - [Citations and Attributions](#citations-and-attributions)
  - [Directory overview](#directory-overview)
  - [Things I intentionally did not include](#things-i-intentionally-did-not-include)
  - [Modifications to A-Frame + Third party libraries](#modifications-to-a-frame--third-party-libraries)
  - [My thoughts](#my-thoughts)

## Citations and Attributions

- Background music, “Atmospheric Cinematic Ambient” by AShamaluevMusic <https://www.ashamaluevmusic.com>, available under its Terms of Use <https://www.ashamaluevmusic.com/terms>

- “button hover effect” <https://freesound.org/people/deadsillyrabbit/sounds/251389/> by deadsillyrabbit, available under the Creative Commons 0 License <https://creativecommons.org/publicdomain/zero/1.0/>

- Lieberman, Scott. “Space Shuttle Columbia Falling Photo.” Columbia Falling Banner, <https://wagner-wpengine.netdna-ssl.com/wagnermagazine/files/2016/09/Lieberman-Columbia-Falling-banner-background.jpg>. Accessed 16 October 2020.

- NASA. “Complex Rigging.” Kennedy Launch Site, 2012, <https://asd.gsfc.nasa.gov/archive/sm3b/launch-info/kennedy-part1.html>. Accessed 2 November 2020.

- “Map of Japan - Outline” <https://freevectormaps.com/japan/JP-EPS-01-0003?ref=atr> by Striped Candy LLC, available under the Attribution License <https://freevectormaps.com/license?ref=footer>.

- JAL photographed in Itami, Osaka Airport <https://commons.wikimedia.org/wiki/File:MyPhotoJal-02.jpg>, photographed by S. Fujioka, available under the CC BY-SA 3.0 license <https://creativecommons.org/licenses/by-sa/3.0/deed.en>.

- “plane flyover takeoff” sound effect <https://freesound.org/people/tim.kahn/sounds/199263/> by tim.kahn, available under CC BY-NC 3.0 license <https://creativecommons.org/licenses/by-nc/3.0/>.

- “Map of Japan with Prefectures - Outline” <https://freevectormaps.com/japan/JP-EPS-01-0004?ref=atr> by Striped Candy LLC, available under the Attribution License <https://freevectormaps.com/license?ref=footer>.
  “Japan Airlines 123 fig01 Estimated flight path of JA8119” <https://commons.wikimedia.org/wiki/File:Japan_Airlines_123_fig01_Estimated_flight_path_of_JA8119_ja.png>, by 運輸安全委員会 (Japan Transport Safety Board), available under the CC BY 4.0 license <https://creativecommons.org/licenses/by/4.0>, via Wikimedia Commons.

- “Japan Airlines 123 - sitting plan-ja” <https://commons.wikimedia.org/wiki/File:Japan_Airlines_123_-_sitting_plan-ja.svg>, by Ch1902, Eluveitie (original), available under the CC BY-SA 3.0 license <https://creativecommons.org/licenses/by-sa/3.0>, via Wikimedia Commons.

- “AIRCRAFT ACCIDENT INVESTIGATION REPORT Japan Air Lines Co., Ltd. Boeing 747 SR-100, JA8119 Gunma Prefecture, Japan August 12, 1985” (PDF) <https://www.mlit.go.jp/jtsb/eng-air_report/JA8119.pdf>. Aircraft Accident Investigation Commission. June 19, 1987. Accessed 1/2/2021.

## Directory overview
```bash
libraries/    # A-Frame + third party libraries
src/          # my own code + media files
  assets/     # media (img..etc) + json resources
  components/ # my specific A-Frame components
  style/      # CSS styles specific to Safari
  templates/  # HTML templates
  utils/      # general standalone utilities
index.html    # the app
```
## Some helpful A-Frame components
While making this project, I had to write a bunch of components (located in `src/components`). Below is a list of components which I thought was neat. Feel free to take them from this repository (be sure to leave my name in the code though!)
- `follow-curve-component.js` - makes the entity follow a given curve. You would specify an `i` value to move it around. (e.g. i = 0.5 would be mid-point of the curve). I used the animation component to animate the i value.
- `instance-gltf-component.js` - makes a gltf entity an instanced mesh, you can declaritively create new instances in html
- `subtitle-component.js` - creates subtitle text, the text follows you around with a delay, you specify the subtitle text + duration in a separate json file.

## Things I intentionally did not include
Below are somethings I decided not to include:
- For the seating chart, I did not include the second floor (I tried including it but A-Frame did not like animating the fading in and out of a transparent image on top of another transparent image. Extra work is necessary and I personally think coding it directly in Three.js may be better)
- Altitudes of the flight path (I brainstormed a bit on how this can be done and decided that the setup of the project did not do well with it)
- Firefox support for spatial audio (Here's an [stale A-Frame issue](https://github.com/aframevr/aframe/issues/3868) on it)

## Modifications to A-Frame + Third party libraries
- Modified the A-Frame's animation component
  - Have `animationcomplete` events to bubble up instead of it not bubbling up (It made clean-up a little easier if I have it bubble up).
  - Fixed A-Frame animation's `animationbegin` events not firing when inside a `animation-timeline` component (Superframe [Issue #216](https://github.com/supermedium/superframe/issues/216))
- Modified the [animation-timeline](https://github.com/supermedium/superframe/tree/master/components/animation-timeline/) component's `offset` property so that the first animation can also be offset. (The original semantics was that `offset` would offset the animation if there was an animation before it. This means that if I have an animation that I want to offset right at the beginning, I am not able to do that. To do it, I need to use `setTimeout` to offset it which is not ideal). No one wants to look at setTimeout + offset to see when an animation starts. Keeping offsets in one place makes more sense. 
- Modified the third party [Meshline component](https://github.com/andreasplesch/aframe-meshline-component) 
  - Modified the meshline component to also take an `a-curve` element from the [aframe curve component](https://github.com/protyze/aframe-curve-component). This modified meshline component now has a `curve` property, which you can specify an `a-curve` element for it. It centers the 'anchor point' of mesh geometry.
  - Now takes my custom `a-svg-curve` component (have a look at the components to see what it does).
  - To have a `drawRangeStart`, `drawRangeCount` to show how much of the path to draw (useful for animation)
- Modified A-Frame's text component to have yoffset actually working (I basically copied the changes from this pull request that has yet to be merged: [A-Frame PR#3886](https://github.com/aframevr/aframe/pull/3886)) (11/4/2020)

## My thoughts
A-Frame seems to have a lot on its hands and it's steadily being refined but there are quite a few things that should be addressed. Below are two PRs I found that kind of stuck out to me. (11/28/2020)
  - https://github.com/aframevr/a-painter/pull/254
  - https://github.com/aframevr/aframe/issues/2420
