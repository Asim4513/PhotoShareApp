/**
 * Fetch a model from the web server.
 *
 * @param {string} url The URL to issue the GET request.
 * @returns {Promise} A Promise that resolves with the fetched data or rejects with an error object.
 */
async function fetchModel(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const error = new Error('HTTP status ' + response.status);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error; 
    }
    const json = await response.json();
    return { data: json }; 
  } catch (error) {
    console.error('Fetching model failed:', error);
    throw error;
  }
}

export default fetchModel;
