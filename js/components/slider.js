/**
 * Slider Component
 * Range slider with numeric input
 */

Vue.component("slider", {
  template:
    '<div class="slider-wrapper"><label :for="id"><slot></slot>:<input :id="id" type="number" :max="max" :min="min" class="compact hideSpin hideBorder" :value="val" @input="adjust"></label><div><input aria-label="id" :value="val" :max="max" :min="min" type="range" @input="adjust" required></div></div>',
  props: ["max", "min", "value", "id"],
  data: function () {
    return {
      val: 0,
    };
  },
  mounted() {
    if (this.value) this.adjust(null, this.value);
  },
  methods: {
    adjust(e, value) {
      //Update the value label based on the input slider
      this.val = value != null ? value : e.target.value ? e.target.value : 0;
      this.$el.children[1].children[0].value = this.val;

      //Emit input event to trigger v-model
      this.$emit("input", this.val);
    },
  },
  beforeDestroy() {
    // Clear any cached DOM references
    this.val = 0;
  },
});
