import { defineStore } from "pinia";
import {promises} from "dns";
// ユーザーデータ状態管理

export const useUserDataStore = defineStore('userData', {
    state: () => {
        return{
        name: 'untitled',
        data: ''
    }},

    getters: {
        fileExt: (state) => state.name.slice(-3),
    },

    actions: {
        async load(file: File): Promise<void> {
            return new Promise((resolve, reject) => {
                const blob: Blob = file
                let elapsedTime = Date.now()

                const reader = new FileReader()
                reader.onload = () => {
                    this.data = reader.result as string
                    this.name = file.name
                    elapsedTime =  Date.now()-elapsedTime
                    console.log(this.name + ' is loaded successfully [' + elapsedTime + 'ms ]')
                    // console.log(this.data)
                    resolve()
                }

                reader.onerror = (e) => {
                    elapsedTime =  Date.now()-elapsedTime
                    console.log('file loading is failed [' +elapsedTime+ 'ms ]')
                    reject(e)
                }

                reader.readAsText(blob)
            })
        }

    }

})
