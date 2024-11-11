import { Meteor } from 'meteor/meteor'
import { createApp } from 'vue'
import { VueMeteor } from 'vue-meteor-tracker'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import { router } from './router'

Meteor.startup(() => {
  const app = createApp(App)
  app.use(router)
  app.use(ElementPlus)
  app.use(VueMeteor)
  app.mount('#app')
})


