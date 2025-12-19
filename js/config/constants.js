/**
 * Application Constants
 * Centralized configuration values
 */

const APP_CONSTANTS = {
  // Timeout values (in milliseconds)
  FETCH_TIMEOUT: 5000,
  DEBOUNCE_DELAY: 500,
  EDIT_POST_DELAY: 250,
  TINYMCE_INIT_DELAY: 100,
  FOOTER_IMPORT_DELAY: 500,
  
  // CORS Proxy Services
  CORS_PROXIES: [
    {
      name: 'AllOrigins',
      urlBuilder: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      isJson: true,
      getContent: (response) => response.contents
    },
    {
      name: 'CorsProxy.io',
      urlBuilder: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
      isJson: false,
      getContent: (response) => response
    }
  ],
  
  // Newsletter version
  NEWSLETTER_VERSION: 1,
  
  // Sidebar dimensions
  SIDEBAR_WIDTH_COLLAPSED: 80,
  SIDEBAR_WIDTH_EXPANDED: 260,
  
  // Preview dimensions
  PREVIEW_WIDTH: 850,
  
  // Local storage keys
  STORAGE_KEYS: {
    NEWSLETTER: 'newsletter',
    POSTS: 'posts'
  },
  
  // Template paths
  TEMPLATES: {
    DEFAULT: 'templates/Newsletter - Template 1.json'
  },
  
  // Default styles backup
  DEFAULT_STYLES: {
    backgroundColor: "#ffffff",
    header: {
      backgroundColor: "#333333",
      textColor: "#ffffff"
    },
    post: {
      backgroundColor: "#f3f3f3",
      textColor: "#000000",
      borderRadius: 0,
      spacing: 5,
      shadow: false,
      buttonBackgroundColor: "#06874E",
      buttonTextColor: "#ffffff",
      buttonAlign: "left",
      buttonWidth: 30,
    },
    footer: {
      backgroundColor: "#333333",
      linkColor: "#06874E",
      textColor: "#ffffff",
    },
  }
};
