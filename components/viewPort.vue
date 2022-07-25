<template>
  <section ref="canvas-section" class="canvas-section">
    <canvas id="viewportCanvas" ref="canvas" class="artwork" :width="width" :height="height" />
  </section>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "@vue/runtime-core";
import SceneHandler from "assets/sceneHandler";
import {useUserDataStore} from "~/store/userData";

export default defineComponent({
  setup(){
    const userData = ref(useUserDataStore())
    const width = 500
    const height = 500
    let handler: SceneHandler|null = null

    onMounted(() => {
      const canvas:HTMLCanvasElement|HTMLElement = document.getElementById('viewportCanvas')
      if(canvas instanceof HTMLCanvasElement){
        this.handler = new SceneHandler(canvas)
      }
    })

    const importGeometry = () => {
      if(this.handler==null){
        console.log('The Scene is not initialized yet.')
        return
      }
      this.handler.importGeometry()
    }

    return {
      width, height, importGeometry
    }
    }
})

</script>

<style scoped>
.artwork{

}

</style>