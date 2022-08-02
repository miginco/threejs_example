<template>
  <section ref="canvas-section" class="canvas-section">
    <canvas id="viewportCanvas" ref="canvas" class="artwork" :width="width" :height="height" />
  </section>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "@vue/runtime-core"
import SceneHandler from "assets/sceneHandler"
import {useUserDataStore} from "~/store/userData"
import { ref } from "vue"
import {window} from "rxjs"

export default defineComponent({
  setup(props, context){
    const userData = ref(useUserDataStore())
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)
    const handler = ref<InstanceType<typeof SceneHandler>>()

    onMounted(() => {
      console.log('Scene is being initialized...')

      const canvas:HTMLCanvasElement|HTMLElement = document.getElementById('viewportCanvas')
      if(canvas instanceof HTMLCanvasElement){
        handler.value = new SceneHandler(canvas)
      }
      // width.value = window.innerWidth
      // height.value = window.innerHeight
    })

    const importGeometry = () => {
      console.log('on viewport.importGeometry')
      if(handler==null){
        console.log('The Scene is not initialized yet.')
        return
      }
      handler.value.importGeometry()
    }

    return {
      width, height, importGeometry
    }
    }
})

</script>

<style scoped>
.artwork{
  background: #323232;
  width: 100%;
  height: calc(100vh - 30px - 48px);
  z-index: 2;

}

</style>