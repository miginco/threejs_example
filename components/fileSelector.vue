<template>
  <div id="app">
    <v-list flat dense>
      <v-list-item>
        <v-row justify="center" class="py-1">
          読み込むファイルの選択
        </v-row>
      </v-list-item>
      <v-divider />
      <v-list-item>
          <v-file-input
              dense
              outlined
              label="クリックして開く"
              accept="stl"
              class="text-caption"
              @change="getFile"
          />
      </v-list-item>
      <v-list-item dense>
          <v-btn v-if="true" elevation="0" :disabled="false" @click="">
            読み込む
          </v-btn>
      </v-list-item>
    </v-list>
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
      await userData.value.load(e.target.files[0])
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