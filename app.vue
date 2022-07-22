<template>
  <v-app>
    <div id="app">
      <v-navigation-drawer  app clipped class="pa-2">
        <fileselector />
      </v-navigation-drawer>

      <v-app-bar  app dense flat clipped-left color="#323232">
        <v-toolbar-title class="subtitle-1">
          <span style="color: #ED8077; font-family: 'Noto Sans JP', sans-serif;">
            テストテストaa
          </span>
        </v-toolbar-title>
      </v-app-bar>

      <v-main>

      </v-main>

      <v-footer :height="40">
        {{ new Date().getFullYear() }}
      </v-footer>
    </div>
  </v-app>
</template>

<script lang="ts">
import Fileselector from "~/components/fileselector.vue";

export default {
  components: {Fileselector}
}
</script>
