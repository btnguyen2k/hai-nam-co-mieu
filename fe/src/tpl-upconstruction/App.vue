<template>
  <router-view></router-view>
</template>

<style lang="css">
/* Google fonts */
@import "//fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap";

/* FontAwesome */
@import "@/_shared/assets/fontawesome-free-6.4.0-web/css/all.min.css";

/* Bootstrap 5.x */
@import "bootstrap/dist/css/bootstrap.min.css";
@import "bootstrap";
@import "bootstrap-icons";

@import "@/tpl-upconstruction/assets/vendor/glightbox/css/glightbox.min.css";
@import "@/tpl-upconstruction/assets/vendor/swiper/swiper-bundle.min.css";
@import "@/tpl-upconstruction/assets/css/main.css";
</style>

<script>
import {computed, getCurrentInstance} from 'vue'
import {triggerPopstate, triggerResize} from '@/_shared/utils/docms_utils'
import router from '@/tpl-upconstruction/router'
import {APP_CONFIG} from "@/_shared/utils/app_config";

window.addEventListener('popstate', () => triggerPopstate())
window.addEventListener('resize', () => triggerResize())

export default {
  name: 'App',
  inject: [],
  provide() {
    return {
      $latestDocuments: computed(() => this.latestDocuments),
      $specialDocuments: computed(() => this.specialDocuments),
    }
  },
  mounted() {
    const app = getCurrentInstance()
    app.appContext.config.globalProperties.$unixTimestampToReadable = this.unixTimestampToReadable
    app.appContext.config.globalProperties.$calcDocumentEntryImgUrl = this.calcDocumentEntryImgUrl
    app.appContext.config.globalProperties.$calcAuthorAvatarUrl = this.calcAuthorAvatarUrl

    const vue = this
    vue._fetchLatestDocuments(vue)
    vue._fetchSpecialDocuments(vue)
  },
  methods: {
    _fetchLatestDocuments(vue) {
      vue.$fetchLatestDocuments(undefined, 10, null,
          apiResp => {
            if (apiResp.status == 200) {
              vue.latestDocuments = apiResp.data
            }
          },
          () => {
          },
      )
    },
    _fetchSpecialDocuments(vue) {
      vue.$fetchSpecialDocuments(null,
          apiResp => {
            if (apiResp.status == 200) {
              vue.specialDocuments = apiResp.data
            }
          },
          () => {
          },
      )
    },
    unixTimestampToReadable(timeInSeconds) {
      const d = new Date(timeInSeconds * 1000)
      const yyyy = d.getFullYear()
      const mm = ('0' + (d.getMonth() + 1)).slice(-2)  // Months are zero based. Add leading 0.
      const dd = ('0' + d.getDate()).slice(-2)         // Add leading 0.
      const hh = ('0' + d.getHours()).slice(-2)         // Add leading 0.
      const min = ('0' + d.getMinutes()).slice(-2)     // Add leading 0.
      return yyyy + '-' + mm + '-' + dd + ', ' + hh + ':' + min
    },
    calcDocumentEntryImgUrl(doc, topicId, defaultUrl, selection) {
      let img = doc.img
      if (img && selection) {
        const imgMap = JSON.parse(doc.img)
        img = imgMap && imgMap[selection] ? imgMap[selection] : ''
      }
      if (img != '') {
        const reAbsUrl = /^([a-z]+:)?\//i
        if (reAbsUrl.test(img)) {
          return img
        }
        const base = router.resolve({name: 'Document', params: {tid: topicId, did: doc.id}}).href
        return (APP_CONFIG.api_client.be_api_base_url?APP_CONFIG.api_client.be_api_base_url:'') + base + img
      }
      return defaultUrl
    },
    calcAuthorAvatarUrl(auth, defaultUrl) {
      if (auth && auth.avatar) {
        return auth.avatar
      }
      if (auth && auth.email) {
        return '//www.gravatar.com/avatar/' + auth.email.toLowerCase().md5()
      }
      return defaultUrl
    }
  },
  data() {
    return {
      latestDocuments: [],
      specialDocuments: {},
    }
  },
}
</script>
