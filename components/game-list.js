/* global AFRAME */

import { Utils } from '../utils.js'
import { VGLIST_URL, GAME_BOX } from '../constants.js';

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Game list component
 */
AFRAME.registerComponent('game-list', {
  schema: { 
    username: { type: 'string', default: '' }
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: async function() {
    let gamePurchases = await this.getGamePurchases(this.data.username);

    let sceneEl = document.querySelector('a-scene');
    let assetsEl = document.createElement('a-assets');

    let libraryTextEl = document.createElement('a-entity');
    libraryTextEl.setAttribute('text', `color: black; width: 5; wrap-count: 15; align: center; side: double; value: ${this.data.username}'s Library`);
    libraryTextEl.setAttribute('position', { x: 0.5, y: GAME_BOX.height + 2, z: GAME_BOX.z_position });
    this.el.appendChild(libraryTextEl);

    this.createBackButton();

    if (gamePurchases['nodes'].length === 0) {
      let noGamesTextEl = document.createElement('a-entity');
      noGamesTextEl.setAttribute('text', `color: black; width: 10; wrap-count: 30; align: center; side: double; value: This user has no games.`);
      noGamesTextEl.setAttribute('position', { x: 0.5, y: GAME_BOX.height - 1, z: GAME_BOX.z_position });
      this.el.appendChild(noGamesTextEl);
      return;
    }

    let xPosition = -10;

    // Create no-cover asset so it can be reused.
    let noCoverImg = document.createElement('img');
    noCoverImg.setAttribute('src', `./images/no-cover.png`);
    noCoverImg.setAttribute('id', 'noCover');
    assetsEl.appendChild(noCoverImg);

    gamePurchases['nodes'].forEach((gamePurchase, i) => {
      let img = document.createElement('img');
      let assetName = '';
      if (gamePurchase['game']['coverUrl'] === null) {
        assetName = 'noCover';
      } else {
        img.setAttribute('src', gamePurchase['game']['coverUrl']);
        img.setAttribute('crossorigin', 'anonymous');
        assetName = `img-${this.data.username}-${i}`;
        img.setAttribute('id', assetName);
        assetsEl.appendChild(img);
      }

      let gameBox = document.createElement('a-entity');
      gameBox.setAttribute('game-box', `gameName: ${gamePurchase['game']['name']}; gameCoverId: ${assetName}; xPosition: ${xPosition}`);
      this.el.appendChild(gameBox);

      xPosition += GAME_BOX.width + GAME_BOX.margin;
    });

    sceneEl.appendChild(assetsEl);
  },

  /**
   * Creates a back button in the game list view.
   */
  createBackButton() {
    let backButton = document.createElement('a-entity');
    backButton.setAttribute('back-button', '');
    this.el.appendChild(backButton);
  },

  /**
   * @param {string} username The username of the suer to get game purchases for.
   * @param {string} cursor The start of the page.
   */
  async getGamePurchases(username, cursor = "") {
    const query = /* GraphQL */ `
      query($cursor: String!) {
        user(username: "${username}") {
          gamePurchases(after: $cursor, first: 10) {
            nodes {
              game {
                name
                coverUrl(size: LARGE)
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
              pageSize
            }
          }
        }
      }
    `;

    let result = await Utils.graphqlQuery(query, { "cursor": cursor });
    return result['data']['user']['gamePurchases'];
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
  events: { },
});
