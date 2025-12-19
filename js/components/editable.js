/**
 * Editable Component
 * TinyMCE wrapper for inline editing
 */

Vue.component("editable", {
  template: '<div class="editable" @input="updateInput" tabindex="0"></div>',
  props: ["value"],
  data() {
    return {
      mouseenterHandler: null,
      mouseleaveHandler: null,
      editorInitialized: false,
      hoverTimeout: null,
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
    },
    startHoverTimer() {
      // Clear any existing timer
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
      }
      
      // Start new timer - initialize after 125ms of hovering
      this.hoverTimeout = setTimeout(() => {
        this.initializeEditor();
        this.hoverTimeout = null;
      }, 200);
    },
    cancelHoverTimer() {
      // Clear timer if mouse leaves before 200ms
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
    },
  },
  mounted() {
    const el = this.$el;
    el.innerHTML = typeof this.value === "undefined" ? "" : this.value;
    
    // Use mouseenter/mouseleave for lazy loading with 200ms delay
    this.mouseenterHandler = () => {
      this.startHoverTimer();
    };
    
    this.mouseleaveHandler = () => {
      this.cancelHoverTimer();
    };
    
    el.addEventListener("mouseenter", this.mouseenterHandler);
    el.addEventListener("mouseleave", this.mouseleaveHandler);
  },
  beforeDestroy() {
    // Clear any pending hover timer
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    
    // Remove event listeners if they still exist
    if (this.$el) {
      if (this.mouseenterHandler) {
        this.$el.removeEventListener("mouseenter", this.mouseenterHandler);
        this.mouseenterHandler = null;
      }
      if (this.mouseleaveHandler) {
        this.$el.removeEventListener("mouseleave", this.mouseleaveHandler);
        this.mouseleaveHandler = null;
      }
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
