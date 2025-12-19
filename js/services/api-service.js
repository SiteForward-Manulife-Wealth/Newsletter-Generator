/**
 * API Service
 * Handles all network requests and CORS handling
 */

/**
 * Fetches URL with timeout
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Fetch promise with timeout
 */
function fetchWithTimeout(url, options = {}, timeout = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

/**
 * Fetches URL with automatic CORS bypass fallback if needed
 * @param {string} url - URL to fetch
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<string>} Response text
 */
async function fetchWithFallback(url, timeout = 5000) {
  // Try to convert HTTP to HTTPS first
  let urlToFetch = url;
  const isHttp = url.startsWith('http://');
  
  if (isHttp) {
    urlToFetch = url.replace('http://', 'https://');
  }
  
  // Try direct fetch first (no CORS proxy)
  try {
    const response = await fetchWithTimeout(urlToFetch, {}, timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    // List of CORS proxy services to try as fallbacks
    const proxies = [
      // AllOrigins
      (url) => ({ url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, isJson: true }),
      // Corsproxy.io
      (url) => ({ url: `https://corsproxy.io/?${encodeURIComponent(url)}`, isJson: false }),
    ];
    
    // Try each proxy service
    for (let i = 0; i < proxies.length; i++) {
      try {
        const { url: proxyUrl, isJson } = proxies[i](urlToFetch);
        const response = await fetchWithTimeout(proxyUrl, {}, timeout);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Handle different response formats
        if (isJson) {
          const jsonData = await response.json();
          return jsonData.contents;
        } else {
          return await response.text();
        }
      } catch (proxyError) {
        // If this is the last proxy and we converted from HTTP, try original HTTP URL
        if (i === proxies.length - 1 && isHttp) {
          // Try direct HTTP fetch first
          try {
            const response = await fetchWithTimeout(url, {}, timeout);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.text();
          } catch (httpDirectError) {
            // Try proxies with HTTP
            for (let j = 0; j < proxies.length; j++) {
              try {
                const { url: proxyUrl, isJson } = proxies[j](url);
                const response = await fetchWithTimeout(proxyUrl, {}, timeout);
                
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                if (isJson) {
                  const jsonData = await response.json();
                  return jsonData.contents;
                } else {
                  return await response.text();
                }
              } catch (httpProxyError) {
                if (j === proxies.length - 1) {
                  throw httpProxyError;
                }
              }
            }
          }
        }
        
        // If not the last proxy, continue to next one
        if (i < proxies.length - 1) continue;
        
        // If all proxies failed, throw the last error
        throw proxyError;
      }
    }
  }
}
