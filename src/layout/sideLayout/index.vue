<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./topBar";
import vSidebar from "./sideBar";
import vTags from "./tags";

export default {
  data() {
    return {
      collapse: false
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  created() {
    this.$root.Bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  },
  methods: {

  }
};
</script>

