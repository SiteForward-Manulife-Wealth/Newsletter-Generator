/**
 * Popup Component
 * Modal/popup dialog component
 */

Vue.component("popup", {
  template:
    '<div class="popup"><i class="fas fa-cog tool-icon" title="Open Post Settings"></i><div class="popup-outerWrapper"><div class="card popup-wrapper"><h3 class="card-title">{{title}}</h3><span title="Close Popup" class="card-title-icon popup-close"><i class="far fa-window-close tool-icon"></i></span><div class="popup-content"><slot></slot></div></div></div></div>',
  props: ["title"],
  data: function () {
    return {
      isOpen: false,
      openHandler: null,
      closeHandlers: [],
    };
  },
  mounted() {
    const el = this.$el;
    
    this.openHandler = () => {
      el.classList.add("open");
    };
    
    const openIcon = el.querySelector("i");
    openIcon.addEventListener("click", this.openHandler);
    
    el.querySelectorAll(".popup-outerWrapper, .popup-close i").forEach(
      (item) => {
        const closeHandler = (event) => {
          if (event.target === item) el.classList.remove("open");
        };
        this.closeHandlers.push({ element: item, handler: closeHandler });
        item.addEventListener("click", closeHandler);
      }
    );
  },
  beforeDestroy() {
    // Clean up open handler
    if (this.openHandler) {
      const openIcon = this.$el.querySelector("i");
      if (openIcon) {
        openIcon.removeEventListener("click", this.openHandler);
      }
    }
    
    // Clean up close handlers
    this.closeHandlers.forEach(({ element, handler }) => {
      element.removeEventListener("click", handler);
    });
    this.closeHandlers = [];
  },
});
