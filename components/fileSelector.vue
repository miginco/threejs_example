<template>
  <div id="app">
      読み込むファイルの選択
      <v-file-input
          dense
          outlined
          label="クリックして開く"
          accept="stl"
          class="text-caption"
          @change="getFile"
      />
  </div>

</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {useUserDataStore} from "~/store/userData";
import {computed, ref} from "vue"

export default defineComponent ({
  setup(props, context){
    const userData = ref(useUserDataStore())
    const name = computed(() => userData.value.name)

    const getFile = async (e: Event) => {
      console.log("name: "+userData.value.name)

      await userData.value.load(e.target.files[0])
      // console.log("name: "+userData.value.name)
      // console.log("data: "+userData.value.data)
      context.emit('fileLoaded')
    }

    return {
      getFile,
      name,
    }
  }

})
</script>

<style scoped>

</style>