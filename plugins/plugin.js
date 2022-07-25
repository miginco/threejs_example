import {defineNuxtPlugin} from "nuxt/app";
import {createVuetify} from "vuetify";
import {
    VApp,
    VAppBar,
    VBtn,
    VNavigationDrawer,
    VWindow,
    VWindowItem,
    VMain,
    VFooter,
    VToolbarTitle,
    VListItem,
    VFileInput

} from "vuetify/components";


export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components: {
            VApp,
            VAppBar,
            VBtn,
            VNavigationDrawer,
            VWindow,
            VWindowItem,
            VMain,
            VFooter,
            VToolbarTitle,
            VListItem,
            VFileInput
        }
    })

    nuxtApp.vueApp.use(vuetify)
})

