import Vue from 'vue'
// let { Vue } = window;
Vue.config.productionTip = false

import module from "@/tencent_module/index"
if (module) {
    let registerID
    if (module.registerID) {
        registerID = module.registerID
    } else if (module.component.name) {
        registerID = module.component.name
    } else {
        registerID = 'DefaultComponent'
    }
    Vue.component(registerID, module.component)
    if (process.env.VUE_APP_BUILD_TARGET_ELEMENT_ID) {
        new Vue({
            render: h => h(module.component.name),
        }).$mount('#' + process.env.VUE_APP_BUILD_TARGET_ELEMENT_ID);
    } else if (process.env.VUE_APP_BUILD_TYPE !== 'custom' && module.elementID) {
        new Vue({
            render: h => h(module.component.name),
        }).$mount('#' + module.elementID);
    }
}