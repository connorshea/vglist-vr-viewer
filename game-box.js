/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

const GAME_BOX = {
  height: 2.5,
  width: 1.5,
  depth: 0.1,
  margin: 0.3,
  height_off_ground: 0.75,
  z_position: -4
};

/**
 * Game box component
 */
AFRAME.registerComponent('game-box', {
  schema: {
    gameName: { type: 'string', default: 'Untitled' },
    gameCoverId: { type: 'string', default: '#noCover' },
    xPosition: { type: 'number', default: 0 }
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
    boxEl.setAttribute('src', `#${this.data.gameCoverId}`);
    boxEl.classList.add('clickable');
    boxEl.setAttribute('geometry', {
      primitive: 'box',
      height: GAME_BOX.height,
      width: GAME_BOX.width,
      depth: GAME_BOX.depth
    });
    boxEl.setAttribute('position', { x: this.data.xPosition, y: GAME_BOX.height / 2 + 0.25, z: GAME_BOX.z_position });

    this.el.appendChild(boxEl);

    this.createFakeShadow();
    this.createGameText();
  },

  createFakeShadow() {
    // Create a fake shadow below each box, much simpler than messing with lighting stuff.
    let fakeShadow = document.createElement('a-plane');
    fakeShadow.setAttribute('position', { x: this.data.xPosition, y: 0.01, z: GAME_BOX.z_position });
    fakeShadow.setAttribute('rotation', '-90 0 0');
    fakeShadow.setAttribute('width', GAME_BOX.width);
    fakeShadow.setAttribute('height', GAME_BOX.depth);
    fakeShadow.setAttribute('color', '#000');
    fakeShadow.setAttribute('opacity', 0.25);
    this.el.appendChild(fakeShadow);
  },

  createGameText() {
    let textEl = document.createElement('a-entity');
    textEl.setAttribute('text', `color: black; width: ${GAME_BOX.width}; wrap-count: 15; baseline: bottom; align: center; side: double; value: ${this.data.gameName}`);
    textEl.setAttribute('position', { x: this.data.xPosition, y: GAME_BOX.height + 0.5, z: GAME_BOX.z_position });
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
    click: function (event) {
      console.log(event);
    }
  },
});
