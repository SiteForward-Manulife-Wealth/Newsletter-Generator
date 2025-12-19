/**
 * Newsletter Generator - Main Application
 * Vue.js application instance and business logic
 */

// Template constant (if needed)
const siteForwardNewsletterTemplate = '';

// Main Vue Application
const app = new Vue({
  el: "#body-wrapper",
  props: {},
  data: {
    renderKey: 0,
    posts: [],
    newsletterHTML: "",
    loading: {
      posts: false,
      template: false,
      newsletter: false,
      analytics: false,
    },
    app: {
      sidebarHover: false,
      sidebarStuck: false,
      activeView: "setup",
      silentToggle: [],
      forceRerender: false,
    },
    newsletter: {
      previewText: "",
      data: 1,
      editPostTimer: null,
      version: 1,
    },
    styles: {
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
    },
    settings: {
      analytics: {
        code: null,
        name: null,
      },
      header: {
        style: 0,
        html: "",
        image: null,
        titles: {
          title: null,
          subtitle: null,
        },
      },
      footer: {
        style: 0,
        html: "",
        preset: {
          name: null,
          email: null,
          phone: null,
          website: null,
          social: {
            facebook: null,
            linkedin: null,
            twitter: null,
            instagram: null
          },
          location: {
            address: null,
            city: null,
            province: null,
            postal: null,
          },
          disclaimer: {
            insuranceOBA: null,
            dealerOBA: null,
            logo: true,
            banking: true,
            licenses: {
              iiroc: false,
              mfda: false,
              msii: false
            },
          },
        },
      },
    },
    stylesBackup: {},
  },
  computed: {
    //If analytics code and name are valid
    analyticsEnabled: function () {
      return this.settings.analytics.code && this.settings.analytics.name;
    },
  },
  watch: {
    "app.sidebarStuck": function () {
      document.dispatchEvent(updateResizeHandle);
    },

    //On view change
    "app.activeView": function () {
      let activeView = this.app.activeView,
        preview = this.$refs.preview;

      document.dispatchEvent(updateResizeHandle);

      setTimeout(function () {
        //If changed to any of the following close the preview window
        if (
          activeView == "help" ||
          activeView == "settings"
        )
          preview.classList.add("closed");
        else preview.classList.remove("closed");
      }, 1);
    },
  },
  mounted() {
    document.querySelector(".preview-body").classList.add("loaded");
    this.stylesBackup = JSON.parse(JSON.stringify(this.styles));

    const style = document.createElement("style");
    this.$refs.newsletter.prepend(style);
    
    this.$snotify.confirm("For quicker startup please choose one of the options below.", "Newsletter Design Generator", {
      titleMaxLength: 30,
      backdrop: 0.2,
      position: "centerCenter",
      buttons: [
        {
          text: "Start from Scratch",
          action: (toast) => {
            this.$snotify.remove(toast.id);
            document.querySelector(".snotify-backdrop").remove()
          }
        },
        {
          text: "Start from our template",
          action: (toast) => {
            this.$snotify.remove(toast.id);
            document.querySelector(".snotify-backdrop").remove()
            sendInfo("Loading Template...");
            fetch(APP_CONSTANTS.TEMPLATES.DEFAULT)
              .then(res => res.json())
              .then(data => {
                this.loadNewsletter(data);
              })
              .catch(error => sendError("Unable to load template. ", error))
          }
        },
        {
          text: "Load your template",
          action: (toast) => {
            this.app.activeView = 'load';
            this.$snotify.remove(toast.id);
            document.querySelector(".snotify-backdrop").remove()
          }
        }
      ],
    });
    
  },
  methods: {
    //Update settings to ensure no error on load
    updateData() {
      //Update useDisclaimer
      if (typeof this.settings.footer.preset.useDisclaimer !== "undefined")
        this.$set(this.settings.footer.preset, "useDisclaimer", true);

      //Update Post Colours - legacy migration (colors is now styles)
      if (typeof this.styles.post === "undefined")
        this.$set(this.styles, "post", {});
      if (typeof this.styles.post.backgroundColor === "undefined")
        this.$set(this.styles.post, "backgroundColor", "#f3f3f3");
      if (typeof this.styles.post.textColor === "undefined")
        this.$set(this.styles.post, "textColor", "#000000");

      //Update Header
      if (typeof this.settings.header.titles === "undefined")
        this.$set(this.settings.header, "titles", {});
      if (typeof this.settings.header.title !== "undefined") {
        this.$set(this.settings.header.titles, "title", this.settings.header.title);
        delete this.settings.header.title;
      }
      if (typeof this.settings.header.subtitle !== "undefined") {
        this.$set(this.settings.header.titles, "subtitle", this.settings.header.subtitle);
        delete this.settings.header.subtitle;
      }

      //Update Disclaimer
      if (typeof this.settings.footer.preset.useDisclaimer !== "undefined") {
        this.$set(this.settings.footer.preset, "disclaimer", {});
        delete this.settings.footer.preset.useDisclaimer;
      }
      
      if (typeof this.settings.footer.preset.disclaimer === "undefined")
        this.$set(this.settings.footer.preset, "disclaimer", {});
        
      if (typeof this.settings.footer.preset.disclaimer.enable === "undefined")
        this.$set(this.settings.footer.preset.disclaimer, "enable", true);

      if (typeof this.settings.footer.preset.disclaimer.insuranceOBA === "undefined")
        this.$set(this.settings.footer.preset.disclaimer, "insuranceOBA", null);

      if (typeof this.settings.footer.preset.disclaimer.licenses === "undefined")
        this.$set(this.settings.footer.preset.disclaimer, "licenses", {});

      if (typeof this.settings.footer.preset.disclaimer.licenses.mfda === "undefined")
        this.$set(this.settings.footer.preset.disclaimer.licenses, "mfda", false);
      if (typeof this.settings.footer.preset.disclaimer.licenses.iiroc === "undefined")
        this.$set(this.settings.footer.preset.disclaimer.licenses, "iiroc", false);

      if (typeof this.settings.footer.preset.disclaimer.logo === "undefined")
        this.$set(this.settings.footer.preset.disclaimer, "logo", true);

      if (typeof this.styles.backgroundColor === "undefined")
        this.$set(this.styles, "backgroundColor", "#ffffff");

      if (typeof this.styles.header === "undefined")
        this.$set(this.styles, "header", {});
        
      if (typeof this.styles.header.borderColor === "undefined")
        this.$set(this.styles.header, "borderColor", "#111111");

      if (typeof this.styles.header.borderWidth === "undefined")
        this.$set(this.styles.header, "borderWidth", 0);

      if (typeof this.styles.post === "undefined")
        this.$set(this.styles, "post", {});

      if (typeof this.styles.post.borderRadius === "undefined")
        this.$set(this.styles.post, "borderRadius", 0);

      if (typeof this.styles.post.buttonAlign === "undefined")
        this.$set(this.styles.post, "buttonAlign", "left");
      if (typeof this.styles.post.buttonWidth === "undefined")
        this.$set(this.styles.post, "buttonWidth", 30);
    },
    
    get(obj, path) {
      return path.split(".").reduce(function (o, x) {
        return typeof o == "undefined" || o === null ? o : o[x];
      }, obj);
    },

    has(obj, path) {
      return path.split(".").every(function (x) {
        if (typeof obj != "object" || obj === null || !(x in obj)) return false;
        obj = obj[x];
        return true;
      });
    },

    set(obj, path, value) {
      var schema = obj;
      var pathSplit = path.split(".");
      var pathSplitLength = pathSplit.length;

      for (var i = 0; i < pathSplitLength - 1; i++) {
        var elem = pathSplit[i];
        if (!schema[elem]) schema[elem] = {};
        schema = schema[elem];
      }
      schema[pathSplit[pathSplitLength - 1]] = value;
    },

    //Load posts
    loadPosts(posts) {
      const storedPosts = safeLocalStorageGet('posts');
      if ((!posts || posts.target) && storedPosts)
        posts = JSON.parse(storedPosts);

      if (!posts || posts.target) sendError("Unable to load posts");
      else {
        sendSuccess("Posts Loaded");
        this.forceRerender();
        this.posts = posts;
      }

      if (this.posts) {
        this.posts.forEach((post) => {
          if (
            post.title &&
            post.title.indexOf("<") !== 0 &&
            post.title.lastIndexOf(">") !== post.title.length - 1
          )
            post.title = `<h2>${post.title}</h2>`;
          if (
            post.date &&
            post.date.indexOf("<") !== 0 &&
            post.date.lastIndexOf(">") !== post.date.length - 1
          )
            post.date = `<p>${post.date}</p>`;
          if (
            post.desc &&
            post.desc.indexOf("<") !== 0 &&
            post.desc.lastIndexOf(">") !== post.desc.length - 1
          )
            post.desc = `<p>${post.desc}</p>`;
        });
      }
    },

    loadNewsletter(file) {
      const storedNewsletter = safeLocalStorageGet('newsletter');
      if ((!file || file.target) && storedNewsletter)
        file = JSON.parse(storedNewsletter);
      if (!file || file.target) sendError("Unable to load newsletter");
      else {
        if (file.options.loadPosts)
          this.$refs.loadPosts.value = file.options.loadPosts;
        if (file.options.loadPost)
          this.$refs.loadPost.value = file.options.loadPost;

        if (file.options.previewText)
          this.newsletter.previewText = file.options.previewText;

        if (file.options.analytics)
          this.settings.analytics = file.options.analytics;

        this.forceRerender();
        this.posts = file.posts;

        this.settings.header = file.header;
        this.settings.footer = file.footer;
        this.styles = file.styles;
        
        sendSuccess("Newsletter Loaded");
      }
    },

    //Save Posts and Options
    saveNewsletter(overwrite) {
      if (overwrite == null || overwrite == undefined) overwrite = false;
      const storedNewsletter = safeLocalStorageGet("newsletter");
      if (!overwrite && storedNewsletter)
        if (
          !confirm("Do you want to overwrite your currently saved newsletter?")
        ) {
          sendInfo("Didn't Save Newsletter");
          return;
        }
      if (safeLocalStorageSet("newsletter", this.newsletterAsJSON())) {
        sendSuccess("Newsletter Saved");
      }
    },

    downloadPDF() {
      // Use Vue's $nextTick to ensure DOM is fully rendered
      this.$nextTick(() => {
        const element = this.$refs.newsletter;
        const filename = `Newsletter - ${this.newsletter.previewText || 'Export'}.pdf`;
        exportPDF(element, filename);
      });
    },
    
    newsletterAsJSON() {
      return JSON.stringify({
        version: 1,
        posts: this.posts,
        styles: this.styles,
        header: this.settings.header,
        footer: this.settings.footer,
        options: {
          previewText: this.newsletter.previewText,
          loadPosts: this.$refs.loadPosts.value,
          loadPost: this.$refs.loadPost.value,
          analytics: this.settings.analytics,
        },
      });
    },
    
    downloadHTML() {
      exportHTML(
        "Newsletter - " + this.newsletter.previewText + ".html",
        "newsletterwrapper",
        "text/html"
      );
    },
    
    //Export posts as file
    exportNewsletter() {
      exportJSONToFile(
        this.newsletterAsJSON(),
        "Newsletter - " + this.newsletter.previewText + ".json"
      );
    },

    //Import posts from file
    importNewsletter() {
      loadJSONFile((d) => this.loadNewsletter(d));
    },
    
    loadTemplate() {
      if (this.loading.template) {
        sendInfo("Already loading template...");
        return;
      }
      
      this.loading.template = true;
      sendInfo("Loading Template...");
      fetch(APP_CONSTANTS.TEMPLATES.DEFAULT)
        .then(res => res.json())
        .then(data => {
          this.loadNewsletter(data);
        })
        .catch(error => sendError("Unable to load template. ", error))
        .finally(() => {
          this.loading.template = false;
        });
    },

    //Load posts from blog page url
    async loadPostsFromURL() {
      let url = this.$refs.loadPosts.value;
      if (!url || url.length < 0) {
        sendError("Invalid load Page's URL");
        return;
      }
      
      // Validate URL format
      try {
        url = validateFetchURL(url);
      } catch (error) {
        sendError(error.message);
        return;
      }
      
      if (this.loading.posts) {
        sendInfo("Already loading posts...");
        return;
      }
      
      this.loading.posts = true;
      
      // Add skeleton loaders to show loading state
      const skeletonCount = Math.min(this.$refs.loadPostsCount.value, 5);
      for (let i = 0; i < skeletonCount; i++) {
        this.posts.push({ skeleton: true });
      }
      
      try {
        sendInfo("Loading Posts");
        // Remove trailing slash from URL to prevent double slashes
        const cleanUrl = url.replace(/\/$/, '');
        const data = await fetchWithFallback(`${cleanUrl}/feed.xml`);
        const doc = new DOMParser().parseFromString(data, "application/xml");
        
        // Check for XML parsing errors
        const parserError = doc.querySelector("parsererror");
        if (parserError) {
          throw new Error("Invalid XML format in RSS feed");
        }
        
        //Search through the XML for the nodes
        const channels = doc.querySelector("channel");
        if (!channels) {
          throw new Error("No channel found in RSS feed");
        }
        
        const items = channels.querySelectorAll("item");
        if (!items || items.length === 0) {
          throw new Error("No posts found in RSS feed");
        }
        
        const maxCount = this.$refs.loadPostsCount.value;

        //For every blog found get the values and create a blog item
        const newPosts = [];
        items.forEach((item, i) => {
          if (i < maxCount) {
            const post = parseRSSItem(item);
            if (post) {
              newPosts.push(post);
            }
          }
        });
        
        // Remove skeleton loaders
        this.posts = this.posts.filter(post => !post.skeleton);
        // Add actual posts
        this.posts.push(...newPosts);

        //Inform user if posts were found
        if (newPosts.length > 0) {
          sendSuccess(`Loaded ${newPosts.length} post(s)`);
        } else {
          sendError("No posts were found, make sure you're not using the RSS Feed");
        }

        //Send call to Google Analytics
        gtag("event", "Page", {
          event_category: "Loading Posts",
          event_label: url,
          event_value: maxCount,
        });
      } catch (error) {
        // Remove skeleton loaders on error
        this.posts = this.posts.filter(post => !post.skeleton);
        sendError("Unable to load URL", error);
      } finally {
        this.loading.posts = false;
      }
    },

    // Load single blog post
    async loadPostFromURL() {
      let url = this.$refs.loadPost.value;
      if (!url || url.length < 0) {
        sendError("Invalid load Page's URL");
        return;
      }
      
      // Validate URL format
      try {
        url = validateFetchURL(url);
      } catch (error) {
        sendError(error.message);
        return;
      }
      
      if (this.loading.posts) {
        sendInfo("Already loading posts...");
        return;
      }
      
      this.loading.posts = true;
      
      try {
        sendInfo("Loading Posts");
        const data = await fetchWithFallback(url);
        const post = parseHTMLPost(data, url);
        
        this.posts.push(post);
        sendSuccess("Loaded Post");

        //Send google analytics call
        gtag("event", "Post", {
          event_category: "Loading Posts",
          event_label: url,
        });
      } catch (error) {
        sendError("Unable to load URL", error);
      } finally {
        this.loading.posts = false;
      }
    },

    //Search a url for analytics code
    async findAnalyticsCode() {
      if (this.loading.analytics) {
        sendInfo("Already searching...");
        return;
      }
      
      this.loading.analytics = true;
      sendInfo("Searching for Google Analytics Code");
      let websiteURL = this.$refs.analyticsWebURL.value;
      if (websiteURL.indexOf("http") !== 0) websiteURL = `https://${websiteURL}`;
      
      // Validate URL format
      try {
        websiteURL = validateFetchURL(websiteURL);
      } catch (error) {
        sendError(error.message);
        this.loading.analytics = false;
        return;
      }
      
      try {
        const data = await fetchWithFallback(websiteURL);
        
        //Look for analytics code
        const analyticsCode = data.match(/UA-\w*-1/g);
        this.settings.analytics.code = analyticsCode;

        if (analyticsCode !== null)
          sendSuccess(`Found Analytics Code: ${analyticsCode}`);
        else sendError("Unable to find Google Analytics Code");
      } catch (error) {
        sendError("Unable to find Google Analytics Code", error);
      } finally {
        this.loading.analytics = false;
      }
    },

    forceRerender() {
      // Properly remove all TinyMCE editors with cleanup
      const editors = tinymce.get();
      if (editors) {
        if (Array.isArray(editors)) {
          editors.forEach(editor => {
            if (editor) editor.remove();
          });
        } else {
          editors.remove();
        }
      } else {
        // Fallback to remove all
        tinymce.remove();
      }
      this.app.forceRerender = !this.app.forceRerender;
    },

    // Delete post
    deletePost(pos) {
      this.posts.splice(pos, 1);
      sendSuccess("Deleted Post");
      this.forceRerender();
    },

    // Delete post
    duplicatePost(pos) {
      let post = this.posts[pos];
      this.posts.splice(pos, 0, JSON.parse(JSON.stringify(post)));
      sendSuccess("Duplicated Post");
      this.forceRerender();
    },
    
    //Move post
    movePost(dir, pos) {
      moveItem(this.posts, pos, dir);
      sendSuccess("Moved Post");
      this.forceRerender();
    },
    
    getPostStyle(pos, key) {
      if (this.has(this.posts[pos].style, key))
        return this.get(this.posts[pos].style, key);
      else return this.get(this.styles.post, key);
    },

    //Edit post with debouncing
    editPost(pos, key, value) {
      // If currently on cooldown - reset cooldown
      if (this.newsletter.editPostTimer) {
        clearTimeout(this.newsletter.editPostTimer);
      }
      
      this.newsletter.editPostTimer = setTimeout(() => {
        this.set(this.posts[pos], key, value);
        this.forceRerender();
        this.newsletter.editPostTimer = null;
      }, APP_CONSTANTS.EDIT_POST_DELAY);
    },

    //Add a new post
    addPost() {
      this.posts.push({
        title: "<h2>Post Title</h2>",
        desc: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
        date: "",
        style: {},
      });
      sendSuccess("Added New Post");
    },

    //Copy newsletter from preview
    copyNewsletter() {
      selectElementContents(this.$refs.newsletter);
      document.execCommand("copy");
      if (window.getSelection) window.getSelection().removeAllRanges();
      sendSuccess("Copied Newsletter");
    },

    //Copy newsletter code from preview
    copyNewsletterCode() {
      if (copyTextToClipboard(this.$refs.newsletter.outerHTML))
        sendSuccess("Copied HTML Code");
    },

    resetStyles() {
      this.styles = JSON.parse(JSON.stringify(this.stylesBackup));

      this.posts.forEach((i) => {
        delete i.styles;
      });

      sendSuccess("Styling has been reset");
    },

    //Check if color is a light colour
    isLight(color) {
      let res = isLightColor(color);
      return res;
    },

    //Scroll to top of view
    scrollToTop() {
      this.$refs.main.scrollTop = 0;
    },

    //Add footer template HTML into custom footer
    importFooterTemplateIntoCustom() {
      // First, switch to custom footer style and wait for render
      this.settings.footer.style = 2;
      
      this.$nextTick(() => {
        // Ensure TinyMCE is initialized for the footer-html element
        const footerEditor = document.getElementById('footer-html');
        if (footerEditor) {
          // Trigger mouseover to initialize TinyMCE if not already initialized
          const mouseoverEvent = new Event('mouseover');
          footerEditor.dispatchEvent(mouseoverEvent);
        }
        
        // Wait for TinyMCE to initialize (increased delay for reliability)
        setTimeout(() => {
          // Temporarily switch to template style to get the HTML
          this.settings.footer.style = 1;
          
          this.$nextTick(() => {
            const footerElement = this.$refs.newsletter.querySelector(".newsletter-footer");
            if (footerElement) {
              const footerHTML = footerElement.outerHTML;
              
              // Switch back to custom and set the HTML
              this.settings.footer.style = 2;
              this.settings.footer.html = footerHTML;
              
              this.$nextTick(() => {
                // Update TinyMCE content if editor is initialized
                const editor = tinymce.get('footer-html');
                if (editor) {
                  editor.setContent(footerHTML);
                }
                
                sendSuccess("Footer template has been imported into the custom section.");
              });
            } else {
              sendError("Could not find footer template element");
            }
          });
        }, APP_CONSTANTS.FOOTER_IMPORT_DELAY); // Give TinyMCE time to initialize
      });
    }
  },
  updated() {
    this.newsletterHTML = this.$refs.newsletter.outerHTML;
  },
  beforeDestroy() {
    // Clean up any remaining TinyMCE editors
    const editors = tinymce.get();
    if (editors) {
      if (Array.isArray(editors)) {
        editors.forEach(editor => {
          if (editor) editor.remove();
        });
      }
    }
    
    // Clean up snotify backdrop listener
    const backdrop = document.querySelector(".snotify-backdrop");
    if (backdrop && this.backdropHandler) {
      backdrop.removeEventListener("click", this.backdropHandler);
    }
  },
});

// Setup backdrop handler with proper cleanup
setTimeout(() => {
  const backdrop = document.querySelector(".snotify-backdrop");
  if (backdrop) {
    const backdropHandler = function(e) {
      app.$snotify.clear();
      e.target.remove();
    };
    backdrop.addEventListener("click", backdropHandler);
    // Store handler for cleanup
    if (app) {
      app.backdropHandler = backdropHandler;
    }
  }
}, 1);
