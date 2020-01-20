/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

const VGLIST_URL = "https://vglist.co";

const AVATAR_BOX = {
  height: 1.5,
  width: 1.5,
  depth: 0.1,
  margin: 0.2,
  z_position: 4
};

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
      let avatarXPosition = -10;

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
        sceneEl.appendChild(userBox);

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
  
    result = await graphqlQuery(query);
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
  events: {
    click: function (event) {
      console.log(event);
      console.log(event.target.dataset.username);
    }
  },
});

async function getUsers() {
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

  result = await graphqlQuery(query);
  return result['data']['users'];
}

async function graphqlQuery(query) {
  let email = VGLIST_USER_EMAIL;
  let token = VGLIST_API_TOKEN;
  let endpoint = `${VGLIST_URL}/graphql`;

  return await fetch(endpoint, {
    method: 'POST',
    headers: {
      "User-Agent": "Stupid vglist VR Viewer",
      "X-User-Email": email,
      "X-User-Token": token,
      'Content-Type': 'application/json',
      "Accept": "*/*"
    },
    body: JSON.stringify({ query: query })
  }).then(response => response.json())
    .then(data => {
      return data;
    });
}

class Utils {
  /**
   * Breaks an array up into chunks of a specific size.
   *
   * @param {array} array The array to chunk.
   * @param {number} size The length of each chunk.
   * @return {array[]} An array of arrays, each up to size in length.
   */
  static chunk(array, size) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }
    return chunked_arr;
  }
}
