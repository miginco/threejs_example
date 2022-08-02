<template>
  <v-app>
    <div id="app">
      <v-navigation-drawer  app clipped class="pa-2">
        <file-selector @fileLoaded="onFileLoaded"/>
      </v-navigation-drawer>

      <v-app-bar  app dense flat clipped-left color="#323232">
        <v-toolbar-title class="subtitle-1">
          <span style="color: #FFFFFF; font-family: 'Noto Sans JP', sans-serif;">
            表示モデル: {{name}}
          </span>
        </v-toolbar-title>
      </v-app-bar>

      <v-main>
        <view-port ref="viewPortRef"/>
      </v-main>

      <v-footer :height="40">
        {{ new Date().getFullYear() }}
      </v-footer>
    </div>
  </v-app>
</template>

<script lang="ts">
import fileSelector from "~/components/fileSelector.vue";
import {useUserDataStore} from "~/store/userData";
import {defineComponent} from "@vue/runtime-core";
import {ref, computed, onMounted} from 'vue'
import viewPort from "~/components/viewPort.vue";
import {SetTraceNotification} from "vscode-jsonrpc";
import type = SetTraceNotification.type;

export default defineComponent({
  components: {viewPort, fileSelector},
  setup() {
    const viewPortRef = ref<InstanceType<typeof viewPort>>()
    const userData = ref(useUserDataStore())
    const name = computed(() => userData.value.name)

    onMounted(()=>{
      console.log('mounted')
    })

    const onFileLoaded = () => {
      // console.log(viewPortRef.value)
      // console.log('*******')
      viewPortRef.value?.importGeometry()
    }

    return {
      name,
      onFileLoaded,
      viewPortRef
    }
  }

})

</script>
