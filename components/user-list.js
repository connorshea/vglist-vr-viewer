/* global AFRAME */

import { Utils } from '../utils.js'
import { VGLIST_URL, AVATAR_BOX } from '../constants.js';

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * User list component
 */
AFRAME.registerComponent('user-list', {
  schema: { },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: async function() {
    let users = await this.getUsers();

    let sceneEl = document.querySelector('a-scene');
    let assetsEl = document.createElement('a-assets');

    // Create default-avatar asset so it can be reused.
    let defaultAvatarImg = document.createElement('img');
    defaultAvatarImg.setAttribute('src', `./default-avatar.png`);
    defaultAvatarImg.setAttribute('id', 'defaultAvatar');
    assetsEl.appendChild(defaultAvatarImg);

    let userChunks = Utils.chunk(users['nodes'], 6);

    let avatarYRow = 0;
    userChunks.forEach((userChunk, i) => {
      let avatarXPosition = -5;

      userChunk.forEach((user, j) => {
        let img = document.createElement('img');
        let assetName = '';
        if (user['avatarUrl'] === null) {
          assetName = 'defaultAvatar';
        } else {
          img.setAttribute('src', `${VGLIST_URL}${user['avatarUrl']}`);
          img.setAttribute('crossorigin', 'anonymous');
          assetName = `userImg${i}${j}`;
          img.setAttribute('id', assetName);
          assetsEl.appendChild(img);
        }

        let userBox = document.createElement('a-entity');
        userBox.setAttribute('avatar-box', `username: ${user['username']}; avatarId: ${assetName}; xPosition: ${avatarXPosition}; yRow: ${avatarYRow}`);
        this.el.appendChild(userBox);

        avatarXPosition += AVATAR_BOX.width + AVATAR_BOX.margin;
      });
      avatarYRow += 1;
    });

    sceneEl.appendChild(assetsEl);
  },

  async getUsers() {
    const query = /* GraphQL */ `{
      users {
        nodes {
          username
          avatarUrl
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }`;
  
    let result = await Utils.graphqlQuery(query);
    return result['data']['users'];
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
