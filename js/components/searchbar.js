/**
 * Searchbar Component
 * Search and filter component with highlighting
 */

Vue.component("searchbar", {
  template:
    '<div><input :id="id" type="search" @input="search" required title=" "><label :for="id"><slot></slot></label></div>',
  props: ["element"],
  data: function () {
    return {
      id: null,
      defaultHTML: null,
      filter: true,
      highlight: true,
    };
  },
  mounted() {
    this.defaultHTML = this.container.innerHTML;
    this.id = this._uid;
  },
  computed: {
    container: function () {
      return document.querySelector("#" + this.element);
    },
  },
  methods: {
    search(e) {
      let search = e.target.value.trim();
      let regex = new RegExp("(" + search + ")", "ig");
      this.container.innerHTML = this.defaultHTML;

      //Hightlight
      if (this.highlight) {
        if (search && search.length > 2) {
          //Get all final child nodes that match search
          let childNodes = [];
          allDescendants(this.container);

          function allDescendants(node) {
            for (var i = 0; i < node.childNodes.length; i++) {
              var child = node.childNodes[i];
              allDescendants(child);
              if (
                child.childNodes.length == 0 &&
                child.nodeName == "#text" &&
                child.textContent.match(regex)
              )
                childNodes.push(child);
            }
          }
          //Surround child node in hightlight node
          for (let i = 0; i < childNodes.length; i++) {
            let child = childNodes[i];
            let span = document.createElement("span");
            span.innerHTML = child.data.replace(regex, "<mark>$1</mark>");

            child.parentNode.insertBefore(span, child);
            child.parentNode.removeChild(child);
          }
        }
      }

      //Filter
      if (this.filter) {
        if (search && search.length > 2) {
          //Show only the child nodes that match the search
          for (let i = 0; i < this.container.children.length; i++) {
            let child = this.container.children[i];
            if (child.textContent.match(regex)) child.style.display = "block";
            else {
              child.style.display = "none";
            }
          }
        }

        //Display all child nodes if not enough search provided
        else {
          for (let i = 0; i < this.container.children.length; i++) {
            let child = this.container.children[i];
            child.style.display = "block";
          }
        }
      }
    },
  },
  beforeDestroy() {
    // Clear cached references
    this.defaultHTML = null;
  },
});
