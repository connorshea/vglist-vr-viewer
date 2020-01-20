/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

const VGLIST_URL = "https://vglist.co";
// const VGLIST_URL = "http://localhost:3000";

GAME_BOX = {
  height: 2.5,
  width: 1.5,
  depth: 0.1,
  margin: 0.3,
  height_off_ground: 0.75,
  z_position: -4
};

AVATAR_BOX = {
  height: 1.5,
  width: 1.5,
  depth: 0.1,
  margin: 0.2,
  z_position: 4
};

/**
 * Stupid vglist VR Viewer component for A-Frame.
 */
AFRAME.registerComponent('vglist-vr-viewer', {
  schema: {},

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: async function() {
    let username = 'connor';
    let gamePurchases = await getGamePurchases(username);

    let sceneEl = document.querySelector('a-scene');
    let assetsEl = document.createElement('a-assets');

    let libraryTextEl = document.createElement('a-entity');
    libraryTextEl.setAttribute('text', `color: black; width: 5; wrap-count: 15; align: center; side: double; value: ${username}'s Library`);
    libraryTextEl.setAttribute('position', { x: 0.5, y: GAME_BOX.height + 2, z: GAME_BOX.z_position });
    sceneEl.appendChild(libraryTextEl);

    let xPosition = -10;

    // Create no-cover asset so it can be reused.
    let noCoverImg = document.createElement('img');
    noCoverImg.setAttribute('src', `./no-cover.png`);
    noCoverImg.setAttribute('id', 'noCover');
    assetsEl.appendChild(noCoverImg);

    gamePurchases['nodes'].forEach((gamePurchase, i) => {
      // TODO: Remove this limitation.
      if (i > 10) {
        return;
      }

      let img = document.createElement('img');
      let assetName = '';
      if (gamePurchase['game']['coverUrl'] === null) {
        assetName = 'noCover';
      } else {
        img.setAttribute('src', `${VGLIST_URL}${gamePurchase['game']['coverUrl']}`);
        img.setAttribute('crossorigin', 'anonymous');
        assetName = `img${i}`;
        img.setAttribute('id', assetName);
        assetsEl.appendChild(img);
      }

      let gameBox = document.createElement('a-entity');
      gameBox.setAttribute('game-box', `gameName: ${gamePurchase['game']['name']}; gameCoverId: ${assetName}; xPosition: ${xPosition}`);
      sceneEl.appendChild(gameBox);

      xPosition += GAME_BOX.width + GAME_BOX.margin;
    });
    sceneEl.appendChild(assetsEl);

    let users = await getUsers();
    this.createAvatars(users);
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
    // click: function (evt) { }
  },

  createAvatars(users) {
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
  }
});

async function getGamePurchases(username) {
  const query = /* GraphQL */ `{
    user(username: "${username}") {
      gamePurchases {
        nodes {
          game {
            name
            coverUrl
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }`;

  result = await graphqlQuery(query);
  return result['data']['user']['gamePurchases'];
}

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
