/* global AFRAME */

import { AVATAR_BOX } from '../constants.js';

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Avatar box component
 */
AFRAME.registerComponent('avatar-box', {
  schema: {
    username: { type: 'string', default: '' },
    avatarId: { type: 'string', default: '' },
    xPosition: { type: 'number', default: 0 },
    yRow: { type: 'number', default: 0 }
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function() {
    let boxEl = document.createElement('a-box');
    boxEl.setAttribute('data-username', this.data.username);

    boxEl.setAttribute('src', `#${this.data.avatarId}`);
    boxEl.setAttribute('geometry', {
      primitive: 'box',
      height: AVATAR_BOX.height,
      width: AVATAR_BOX.width,
      depth: AVATAR_BOX.depth
    });
    boxEl.setAttribute('position', {
      x: this.data.xPosition,
      y: (this.data.yRow * (AVATAR_BOX.height + 0.3)) + AVATAR_BOX.height / 2 + 0.25,
      z: AVATAR_BOX.z_position
    });
    boxEl.classList.add('clickable');
    this.el.appendChild(boxEl);

    this.createUsernameText();
  },

  createUsernameText() {
    let textEl = document.createElement('a-entity');
    textEl.setAttribute('text', `color: black; width: ${AVATAR_BOX.width}; wrap-count: 15; baseline: bottom; align: center; side: double; value: ${this.data.username}`);
    textEl.setAttribute('position', {
      x: this.data.xPosition,
      y: (this.data.yRow * (AVATAR_BOX.height + 0.3)) + AVATAR_BOX.height + 0.3,
      z: AVATAR_BOX.z_position
    });
    this.el.appendChild(textEl);
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
    // When clicking a user, it'll load their library and remove the user list selection screen.
    click: function (event) {
      let username = event.target.dataset.username;
      let sceneEl = document.querySelector('a-scene');

      let gameList = document.createElement('a-entity');
      gameList.setAttribute('game-list', `username: ${username};`);

      let userList = document.querySelector('a-entity[user-list]');
      sceneEl.appendChild(gameList);
      userList.remove();
    }
  },
});
