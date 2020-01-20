import { VGLIST_URL } from './constants.js';

class Utils {
  /**
   * Executes a GraphQL query.
   *
   * @param {string} query
   * @param {Object} variables
   */
  static async graphqlQuery(query, variables = {}) {
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
      body: JSON.stringify({ query: query, variables: variables })
    }).then(response => response.json())
      .then(data => {
        return data;
      });
  }

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

export { Utils };
