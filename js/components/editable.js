/**
 * Editable Component
 * TinyMCE wrapper for inline editing
 */

Vue.component("editable", {
  template: '<div class="editable" @input="updateInput" tabindex="0"></div>',
  props: ["value"],
  data() {
    return {
      mouseoverHandler: null,
      editorInitialized: false,
      initTimeout: null,
    };
  },
  methods: {
    updateInput(e) {
      if (tinymce.get(this.$el.id) != null)
        this.$emit("input", tinymce.get(this.$el.id).getContent());
    },
    initializeEditor() {
      // Prevent double initialization
      if (this.editorInitialized || tinymce.get(this.$el.id)) {
        return;
      }
      
      // Debounce initialization to prevent rapid triggers
      if (this.initTimeout) {
        clearTimeout(this.initTimeout);
      }
      
      this.initTimeout = setTimeout(() => {
        const el = this.$el;
        if (tinymce.get(el.id) === null) {
          try {
            const tinyMCE_settings_clone = Object.assign({}, tinyMCE_settings);
            tinyMCE_settings_clone.selector = `#${el.id}`;
            
            // Add initialization callback to track state
            tinyMCE_settings_clone.init_instance_callback = (editor) => {
              this.editorInitialized = true;
            };
            
            tinymce.init(tinyMCE_settings_clone);
          } catch (error) {
            // Silently fail if TinyMCE initialization fails
            this.editorInitialized = false;
          }
        }
        this.initTimeout = null;
      }, 100); // 100ms debounce
    },
  },
  mounted() {
    const el = this.$el;
    el.innerHTML = typeof this.value === "undefined" ? "" : this.value;
    
    // Use mouseover for lazy loading
    this.mouseoverHandler = () => {
      this.initializeEditor();
    };
    
    el.addEventListener("mouseover", this.mouseoverHandler);
  },
  beforeDestroy() {
    // Clear any pending initialization
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
      this.initTimeout = null;
    }
    
    // Remove event listener if it still exists
    if (this.mouseoverHandler && this.$el) {
      this.$el.removeEventListener("mouseover", this.mouseoverHandler);
      this.mouseoverHandler = null;
    }
    
    // Destroy TinyMCE editor instance
    if (this.$el && this.$el.id) {
      try {
        const editor = tinymce.get(this.$el.id);
        if (editor) {
          editor.remove();
        }
      } catch (error) {
        // Silently fail if editor removal fails
      }
    }
    
    this.editorInitialized = false;
  },
});
