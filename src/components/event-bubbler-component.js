/* globals AFRAME */

/*
 * event-bubbler components bubbles a specified event that otherwise do not bubble
 * E.g. 'loaded' event for an entity does not bubble, and sometimes we want it to bubble
 * Takes in argument eventName for the event name and argument once (optional)
 * If once is true, the component will remove itself after it received the specified event once.
 * Cleans up after itself if the component is removed or the component updates in some way.
 * 
 * Note (Sam): I use this for bubbling the loaded event so that I know when a template (aframe-template-component) 
 * has been completely rendered (all components initialized + loaded) but one rule of thumb when using this
 * with the template component is to choose the parent entity that has the highest depth
 * Refer to explanation at the bottom
 */

AFRAME.registerComponent("event-bubbler", {
  schema: {
    eventName: { type: 'string', default: '' },
    once: { type: 'boolean', default: false }
  },
  createBubbler: function() {
    return (evt) => {
      if (this.data.eventName !== evt.type || evt.bubbles) {
        // if it's not the event we're looking for
        // or if the event bubbles, we ignore it
        return;
      }
      this.el.emit(this.data.eventName);
      
      if (this.data.once) {
        this.el.removeAttribute('event-bubbler');
      }
    };
  },
  update: function(oldData) {
    if (!this.data.eventName) { // check if it's empty
      throw new Error('eventName property not provided for the event-bubbler component (e.g <entity event-bubbler="eventName: click"></entity>)')
    }
    
    if (oldData.eventName && oldData.eventName === this.data.eventName) {
      return;
    }
    
    if (oldData.eventName && oldData.eventName !== this.data.eventName) {
      this.el.removeEventListener(oldData.eventName, this.bubbler);
    }
    
    this.bubbler = this.createBubbler();
    this.el.addEventListener(this.data.eventName, this.bubbler);
  },
  remove: function() {
    this.el.removeEventListener(this.data.eventName, this.bubbler);
  },
});


// The custom element initialization is pretty weird (document.registerElement/customElements.define)
// HTML/JavaScript allows you to register/define custom tags and A-Frame does it with registerElement (now deprecated though).
// For some reason, either registerElement or the engine itself initalizes elements like this:
// <a>
//   <a1>
//     <a2></a2>
//   </a1>
// </a>
// <b>
//   <b1></b1>
// </b>
// It goes in this order: a2 -> a1 -> b1 -> b -> a
// It goes from deepest level to the shallowest in like a reversed breadth first search.
// So the rule of thumb is to choose a because a has children that go the deepest.