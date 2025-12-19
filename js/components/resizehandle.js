/**
 * Resize Handle Component
 * Draggable resize handle for panels
 */

const updateResizeHandle = new Event("updateresizehandle");

Vue.component("resizehandle", {
  template: '<div class="resize-handle" @mousedown="down"></div>',
  props: ["othercontainer", "mincontainer", "minother"],

  methods: {
    down(e) {
      document.addEventListener("mousemove", this.move);
      document.addEventListener("mouseup", this.up);
      document.querySelector("body").style = "user-select: none;";
    },
    up(e) {
      document.removeEventListener("mousemove", this.move);
      document.removeEventListener("mouseup", this.up);
      document.querySelector("body").style = "";
    },
    move(e) {
      const parent = this.$el.parentNode;
      const otherContainer = document.querySelector(this.othercontainer);
      let width = parent.offsetWidth - (e.clientX - parent.offsetLeft);

      width = Math.min(window.innerWidth - this.minother, width);
      width = Math.max(this.mincontainer, width);

      this.updateWidths(width);
    },
    updateWidths(width) {
      const parent = this.$el.parentNode;
      const otherContainer = document.querySelector(this.othercontainer);

      if (
        !parent.classList.contains("closed") &&
        !parent.classList.contains("large")
      ) {
        if (!Number.isInteger(width)) width = parent.offsetWidth;

        parent.style = `width: ${width}px; transition: none`;
        const sidebarWidth = app.app.sidebarStuck ? "260" : "80";
        otherContainer.style = `width: calc(calc(100% - ${sidebarWidth}px) - ${width}px); transition: none;`;

        setTimeout(() => {
          parent.style = `width: ${width}px`;
          otherContainer.style = `width: calc(calc(100% - ${sidebarWidth}px) - ${width}px);`;
        }, 1);
      }
      setTimeout(() => {
        if (
          parent.classList.contains("closed") ||
          parent.classList.contains("large")
        ) {
          parent.style = "";
          otherContainer.style = "";
        }
      }, 5);
    },
  },
  mounted() {
    document.addEventListener("updateresizehandle", this.updateWidths);
  },
  beforeDestroy() {
    // Clean up event listener
    document.removeEventListener("updateresizehandle", this.updateWidths);
    
    // Clean up any active mousemove/mouseup listeners
    document.removeEventListener("mousemove", this.move);
    document.removeEventListener("mouseup", this.up);
  },
});
