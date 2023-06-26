<template>
  <div v-if="errorMsg!=''" class="alert alert-danger m-4" role="alert">
    {{ errorMsg }}
    <hr/>
    <p class="btn btn-outline-primary mb-0" @click="$reload()"><i class="bi bi-arrow-clockwise"></i> {{ $t('reload') }}</p>
  </div>
  <div v-else-if="status<=0" class="alert alert-info m-4" role="alert"><i class="bi bi-hourglass"></i> {{ $t('wait') }}</div>
  <div v-else-if="status==200 && $specialDocuments['about']">
    <lego-page-header active="home"/>

    <main id="main">
      <div class="breadcrumbs d-flex align-items-center" :style="'background-image: url('+($calcDocumentEntryImgUrl($specialDocuments['about'], $specialDocuments['about'].topic.id, '', 'h'))+')'">
        <div class="container position-relative d-flex flex-column align-items-center" data-aos="fade">
          <h2>{{ $t('home') }}</h2>
          <ol><li>&nbsp;</li></ol>
        </div>
      </div>

      <div class="docms-content img-fit img-center" v-html="documentContentRendered"></div>
    </main>

    <lego-page-footer />
  </div>
</template>

<script>
import {markdownRender} from '@/_shared/utils/docms_utils'
import LegoPageHeader from "./_pageHeader.vue"
import LegoPageFooter from "./_pageFooter.vue"
const largeTopicThreshold = 0

export default {
  name: 'Home',
  inject: ['$siteMeta', '$siteTopics', '$latestDocuments', '$specialDocuments'],
  components: {LegoPageHeader, LegoPageFooter},
  mounted() {
    this._fetchSiteMeta(this)
  },
  computed: {
    documentContentRendered() {
      const text = this.$localedText(this.page.content)
      if (typeof text == "string") {
        return markdownRender(text, {
          sanitize: true,
          tags: this.$siteMeta.tags,
        })
      }
      return ''
    },
  },
  methods: {
    _fetchSiteMeta(vue) {
      vue.$fetchSiteMeta(
          () => vue.status = 0,
          apiResp => {
            vue.status = apiResp.status
            if (vue.status == 200) {
              vue.$updatePageTitle()
              vue._fetchTopics(vue)
              vue._fetchPage(vue.$specialDocuments['about'])
            } else {
              vue.errorMsg = vue.status + ": " + apiResp.message
            }
          },
          err => {
            vue.errorMsg = err
          },
      )
    },
    _fetchTopics(vue) {
      vue.$fetchSiteTopics(
          () => vue.status = 0,
          apiResp => {
            vue.status = apiResp.status
            if (vue.status == 200) {
              let smallTopics = ''
              for (const topic of vue.$siteTopics) {
                if (topic.num_docs >= largeTopicThreshold) {
                  vue._fetchLatestDocumentsForTopic(vue, topic)
                } else {
                  smallTopics += topic.id+","
                }
              }
              vue._fetchLatestDocumentsForSmallTopics(vue, smallTopics)
            } else {
              vue.errorMsg = vue.status + ": " + apiResp.message
            }
          },
          err => {
            vue.errorMsg = err
          },
      )
    },
    _fetchLatestDocumentsForSmallTopics(vue, topicId) {
      vue.$fetchLatestDocuments(topicId, 10,
          () => {
          },
          (apiResp) => {
            if (apiResp.status == 200) {
              vue.latestDocsSmallTopics = apiResp.data
            }
          },
          () => {
          },
      )
    },
    _fetchLatestDocumentsForTopic(vue, topic) {
      vue.$fetchLatestDocuments(topic.id, 10,
          () => {
          },
          (apiResp) => {
            if (apiResp.status == 200) {
              vue.latestDocsPerTopic[topic.id] = apiResp.data
            }
          },
          () => {
          },
      )
    },
    _fetchPage(pageMeta) {
      const vue = this
      vue.$fetchDocument(
          pageMeta.topic.id,
          pageMeta.id,
          () => vue.status = 0,
          apiResp => {
            vue.status = apiResp.status
            if (vue.status == 200) {
              vue.page = apiResp.data
            } else {
              vue.errorMsg = vue.status + ": " + apiResp.message
            }
          },
          err => {
            vue.errorMsg = err
          },
      )
    },
  },
  data() {
    return {
      status: -1,
      errorMsg: '',
      latestDocsPerTopic: {},
      latestDocsSmallTopics: [],
      page: {},
    }
  },
}
</script>
