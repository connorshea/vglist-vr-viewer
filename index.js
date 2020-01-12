/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

const VGLIST_URL = "https://vglist.co";
// const VGLIST_URL = "http://localhost:3000";

BOX_HEIGHT = 2.5;
BOX_WIDTH = 1.5;
BOX_DEPTH = 0.1;
BOX_MARGIN = 0.3;
BOX_HEIGHT_OFF_GROUND = 0.75;
BOX_Z_POSITION = -4;

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
    libraryTextEl.setAttribute('position', { x: 0.5, y: BOX_HEIGHT + 2, z: BOX_Z_POSITION });
    sceneEl.appendChild(libraryTextEl);

    let xPosition = -10;
    gamePurchases['nodes'].forEach((gamePurchase, i) => {
      if (gamePurchase['game']['coverUrl'] === null) {
        return;
      }
      // TODO: Remove this limitation.
      if (i > 10) {
        return;
      }

      let img = document.createElement('img');
      img.setAttribute('src', `${VGLIST_URL}${gamePurchase['game']['coverUrl']}`);
      img.setAttribute('id', `img${i}`);
      img.setAttribute('crossorigin', 'anonymous');
      assetsEl.appendChild(img);

      let entityEl = document.createElement('a-box');
      // Do `.setAttribute()`s to initialize the entity.
      entityEl.setAttribute('src', `#img${i}`);
      entityEl.setAttribute('geometry', {
        primitive: 'box',
        height: BOX_HEIGHT,
        width: BOX_WIDTH,
        depth: BOX_DEPTH
      });
      entityEl.setAttribute('position', { x: xPosition, y: BOX_HEIGHT / 2 + 0.25, z: BOX_Z_POSITION });
      sceneEl.appendChild(entityEl);

      // Create a fake shadow below each box, much simpler than messing with lighting stuff.
      let fakeShadow = document.createElement('a-plane');
      fakeShadow.setAttribute('position', { x: xPosition, y: 0.01, z: BOX_Z_POSITION });
      fakeShadow.setAttribute('rotation', '-90 0 0');
      fakeShadow.setAttribute('width', BOX_WIDTH);
      fakeShadow.setAttribute('height', BOX_DEPTH);
      fakeShadow.setAttribute('color', '#000');
      fakeShadow.setAttribute('opacity', 0.25);
      sceneEl.appendChild(fakeShadow);

      let textEl = document.createElement('a-entity');
      textEl.setAttribute('text', `color: black; width: ${BOX_WIDTH}; wrap-count: 15; baseline: bottom; align: center; side: double; value: ${gamePurchase['game']['name']}`);
      textEl.setAttribute('position', { x: xPosition, y: BOX_HEIGHT + 0.5, z: BOX_Z_POSITION });
      sceneEl.appendChild(textEl);

      xPosition += BOX_WIDTH + BOX_MARGIN;
    });

    sceneEl.appendChild(assetsEl);
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

  let email = VGLIST_USER_EMAIL;
  let token = VGLIST_API_TOKEN;
  let endpoint = `${VGLIST_URL}/graphql`;

  let gamePurchases = [];

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
      gamePurchases = data['data']['user']['gamePurchases'];
      return gamePurchases;
    });
}
