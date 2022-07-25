import { defineStore } from "pinia";
import {promises} from "dns";
// ユーザーデータ状態管理

export const useUserDataStore = defineStore('userData', {
    state: () => {
        return{
        name: 'untitled',
        dataURL: ''
    }},

    getters: {
        fileExt: (state) => state.name.slice(-3),
    },

    actions: {
        async load(file: File): Promise<void> {
            return new Promise((resolve, reject) => {
                this.name = file.name
                const blob: Blob = file
                let reader = new FileReader()
                reader.onload = () => {
                    this.data = reader.result as string
                    console.log(this.name + ' is loaded successfully [' + Date.now() + ']')
                    // console.log(this.data)
                    resolve()
                }
                reader.onerror = () => {
                    console.log('file loading is failed')
                    reject()
                }
                // reader.readAsArrayBuffer(blob)
                reader.readAsDataURL(blob)
            })
        }

    }

})
