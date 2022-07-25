<template>
  <v-app>
    <div id="app">
      <v-navigation-drawer  app clipped class="pa-2">
        <fileselector @fileLoaded="onFileLoaded"/>
      </v-navigation-drawer>

      <v-app-bar  app dense flat clipped-left color="#323232">
        <v-toolbar-title class="subtitle-1">
          <span style="color: #FFFFFF; font-family: 'Noto Sans JP', sans-serif;">
            テスト {{name}}
          </span>
        </v-toolbar-title>
      </v-app-bar>

      <v-main>
        <view-port />
      </v-main>

      <v-footer :height="40">
        {{ new Date().getFullYear() }}
      </v-footer>
    </div>
  </v-app>
</template>

<script lang="ts">
import Fileselector from "~/components/fileselector.vue";
import {useUserDataStore} from "~/store/userData";
import {defineComponent} from "@vue/runtime-core";
import {ref, computed} from 'vue'
import ViewPort from "~/components/viewPort.vue";

export default defineComponent({
  components: {ViewPort},
  setup() {
    const root = ref(null)
    const userData = ref(useUserDataStore())
    const name = computed(() => userData.value.name)
    const onFileLoaded = () => {
      console.log('importing...')
      root.value.ViewPort.importGeometry()
    }

    return {
      name,
      onFileLoaded
    }
  }

})

</script>
