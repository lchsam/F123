/* globals AFRAME THREE */

/* @author Sam Lee <https://github.com/lchsam> 
 * Event transformer component maps an event to another event, e.g. animationbegin -> another
 * Depending on the 'type', it can translate multiple events to one single event.
 * Current only triggers once, once the given event is emitted.
 *
 * Below are the properties and instance variables:
 * Properties: (? means optional property)
 *  - eventName: string - name of the event to listen for
 *  - newEventName: string - new event to transform into
 *  - type?: string - type of transformation
 * Instance variables:
 *  - 
 */

AFRAME.registerComponent("event-transformer", {
  schema: {
    eventName: { type: 'string', default: '' },
    newEventName: { type: 'string', default: ''},
    type: { type: 'string', default: 'once' }
    // debounce and throttle for this would be nice
  },
  init: function() {},
  update: function(oldData) {
    const { eventName, newEventName, type } = this.data;
    if (eventName.length === 0 || newEventName.length === 0) {
      throw new Error('event-transformer: eventName and newEventName must be specified. \nE.g. <a-entity event-transformer="eventName: kebab; newEventName: newKebab;">');
    }
    
    this.handler = () => this.el.emit(newEventName);
    
    this.el.addEventListener(eventName, this.handler, { once: true });
  },
  remove: function() {
    this.el.removeEventListener(this.data.eventName, this.handler); // remove even works after listener is gone.
  },
});