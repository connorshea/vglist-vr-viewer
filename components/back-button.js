/* global AFRAME */

import { GAME_BOX } from '../constants.js';

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Back button component
 */
AFRAME.registerComponent('back-button', {
  schema: { },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function() {
    let backButtonEl = document.createElement('a-entity');

    backButtonEl.setAttribute('geometry', 'primitive: plane; width: auto; height: auto');
    backButtonEl.setAttribute('material', 'color: black');
    backButtonEl.setAttribute('text', `color: white; width: 3; height: 0.25; wrap-count: 5; align: center; value: BACK`);
    backButtonEl.setAttribute('position', {
      x: -10,
      y: GAME_BOX.height + 2,
      z: GAME_BOX.z_position
    });
    backButtonEl.classList.add('clickable');
    this.el.appendChild(backButtonEl);
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) { },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { },

  /**
   * Event handlers that automatically get attached or detached based on scene state.
   */
  events: {
    // When clicking the back button it'll go back to the users view.
    click: function (event) {
      let sceneEl = document.querySelector('a-scene');

      let userList = document.createElement('a-entity');
      userList.setAttribute('user-list', '');

      let gameList = document.querySelector('a-entity[game-list]');
      sceneEl.appendChild(userList);
      gameList.remove();
    }
  },
});
