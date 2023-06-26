<template>
  <div v-if="errorMsg!=''" class="alert alert-danger m-4" role="alert">
    {{ errorMsg }}
    <hr/>
    <p class="btn btn-outline-primary mb-0" @click="$reload()"><i class="bi bi-arrow-clockwise"></i> {{ $t('reload') }}</p>
  </div>
  <div v-else-if="status<=0" class="alert alert-info m-4" role="alert"><i class="bi bi-hourglass"></i> {{ $t('wait') }}</div>
  <div v-else-if="!topic.id" class="alert alert-danger m-4" role="alert">
    {{ $t('error_topic_not_found', {topic: $route.params.tid}) }}
    <hr/>
    <span v-html="$t('transfer_to_home', {url: $router.resolve({name: 'Home'}).href})"></span>
  </div>
  <div v-else-if="status==200 && $specialDocuments['about']">
    <lego-page-header active="topic" :topic="topic" />

    <main id="main">
      <div class="breadcrumbs d-flex align-items-center" :style="'background-image: url('+($calcDocumentEntryImgUrl($specialDocuments['about'], $specialDocuments['about'].topic.id, '', 'h'))+')'">
        <div class="container position-relative d-flex flex-column align-items-center" data-aos="fade">
          <h2>{{ $localedText(topic.title) }}</h2>
          <ol><li>&nbsp;</li></ol>
        </div>
      </div>

      <section id="blog" class="blog">
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row gy-4 posts-list">
            <div class="col-xl-4 col-md-6" v-for="doc in documentList" v-bind:key="doc.id">
              <div class="post-item position-relative h-100">
                <div class="post-img position-relative overflow-hidden">
                  <img :src="$calcDocumentEntryImgUrl(doc, topic.id, '', 's')" class="img-fluid" alt="">
                  <span class="post-date">{{ $unixTimestampToReadable(doc.tc) }}</span>
                </div>
                <div class="post-content d-flex flex-column">
                  <h3 class="post-title">{{ $localedText(doc.title) }}</h3>
                  <div class="meta d-flex align-items-center">
<!--                    <div class="d-flex align-items-center">-->
<!--                      <i class="bi bi-person"></i> <span class="ps-2">John Doe</span>-->
<!--                    </div>-->
<!--                    <span class="px-3 text-black-50">/</span>-->
<!--                    <div class="d-flex align-items-center">-->
<!--                      <i class="bi bi-folder2"></i> <span class="ps-2">Politics</span>-->
<!--                    </div>-->
                  </div>
                  <p>{{ $trimText($localedText(doc.summary), 160) }}</p>
                  <hr>
                  <router-link :to="{name:'Document', params:{tid: topic.id, did: doc.id}}" class="readmore stretched-link">
                    <span>{{ $t('read') }}</span><i class="bi bi-arrow-right"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <lego-page-footer />
  </div>
</template>

<script>
import {useRoute} from 'vue-router'
import {watch} from 'vue'
import legoPageHeader from './_pageHeader.vue'
import legoPageFooter from './_pageFooter.vue'

export default {
  name: 'Topic',
  inject: ['$siteTopics', '$specialDocuments'],
  components: {legoPageHeader, legoPageFooter},
  mounted() {
    const vue = this
    const route = useRoute()
    watch(
        () => route.params.tid,
        async newTid => {
          if (newTid) {
            vue._fetchTopics(vue, newTid)
          }
        }
    )
    this._fetchSiteMeta(this)
  },
  computed: {
  },
  methods: {
    _fetchSiteMeta(vue) {
      vue.$fetchSiteMeta(
          () => vue.status = 0,
          apiResp => {
            vue.status = apiResp.status
            if (vue.status == 200) {
              vue._fetchTopics(vue, vue.$route.params.tid)
            } else {
              vue.errorMsg = vue.status+": "+apiResp.message
            }
          },
          err => {
            vue.errorMsg = err
          },
      )
    },
    _fetchTopics(vue, topicId) {
      vue.$fetchSiteTopics(
          () => vue.status = 0,
          apiResp => {
            vue.status = apiResp.status
            if (vue.status == 200) {
              vue.$siteTopics.forEach(t => {
                if (t.id == topicId) {
                  vue.$updatePageTitle({topic: t})
                  vue.topic = t
                  vue._fetchDocuments(vue, topicId)
                }
              })
            } else {
              // vue.errorMsg = vue.status+": "+apiResp.message
            }
            if (!vue.topic.id) {
              vue.$transferToHome(3)
            }
          },
          err => {
            vue.errorMsg = err
          },
      )
    },
    _fetchDocuments(vue, topicId) {
      vue.$fetchDocumentsForTopic(topicId,
          () => vue.status=0,
          apiResp => {
            vue.status = apiResp.status
            if (vue.status == 200) {
              vue.documentList = apiResp.data
            } else {
              vue.errorMsg = vue.status+": "+apiResp.message
            }
          },
          err => vue.errorMsg = err
      )
    },
  },
  data() {
    return {
      topic: {},
      documentList: [],
      status: -1,
      errorMsg: '',
    }
  },
}
</script>
