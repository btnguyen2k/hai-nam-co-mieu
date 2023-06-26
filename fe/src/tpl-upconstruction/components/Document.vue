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
  <div v-else-if="!document.id" class="alert alert-danger m-4" role="alert">
    {{ $t('error_document_not_found', {topic: $route.params.tid, document: $route.params.did}) }}
    <hr/>
    <span v-html="$t('transfer_to_topic', {url: $router.resolve({name: 'Topic', params: {tid: topic.id}}).href})"></span>
  </div>
  <div v-else-if="status==200 && $specialDocuments['about']">
    <lego-page-header active="topic" :topic="topic" />

    <main id="main">
      <div class="breadcrumbs d-flex align-items-center" :style="'background-image: url('+($calcDocumentEntryImgUrl($specialDocuments['about'], $specialDocuments['about'].topic.id, '', 'h'))+')'">
        <div class="container position-relative d-flex flex-column align-items-center" data-aos="fade">
          <h2>{{ $localedText(document.title) }}</h2>
          <ol><li>&nbsp;</li></ol>
        </div>
      </div>

      <section id="blog" class="blog">
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row g-5">
            <div class="col-lg-8">
              <article class="blog-details">
                <div class="post-img">
                  <img :src="$calcDocumentEntryImgUrl(document, topic.id, '', 's')" alt="" class="img-fluid">
                </div>
                <h2 class="title">{{ $localedText(document.title) }}</h2>
                <div class="meta-top">
                  <ul>
<!--                    <li class="d-flex align-items-center"><i class="bi bi-person"></i> <a href="blog-details.html">John Doe</a></li>-->
                    <li class="d-flex align-items-center"><i class="bi bi-clock"></i> <time>{{ $unixTimestampToReadable(document.tc) }}</time></li>
<!--                    <li class="d-flex align-items-center"><i class="bi bi-chat-dots"></i> <a href="blog-details.html">12 Comments</a></li>-->
                  </ul>
                </div>

                <div class="content docms-content img-fit img-center" v-html="documentContentRendered"></div>
              </article>
            </div>

            <div class="col-lg-4">
              <div class="sidebar">
<!--                <div class="sidebar-item search-form">-->
<!--                  <h3 class="sidebar-title">Search</h3>-->
<!--                  <form action="" class="mt-3">-->
<!--                    <input type="text">-->
<!--                    <button type="submit"><i class="bi bi-search"></i></button>-->
<!--                  </form>-->
<!--                </div>-->

<!--                <div class="sidebar-item categories">-->
<!--                  <h3 class="sidebar-title">Categories</h3>-->
<!--                  <ul class="mt-3">-->
<!--                    <li><a href="#">General <span>(25)</span></a></li>-->
<!--                    <li><a href="#">Lifestyle <span>(12)</span></a></li>-->
<!--                    <li><a href="#">Travel <span>(5)</span></a></li>-->
<!--                    <li><a href="#">Design <span>(22)</span></a></li>-->
<!--                    <li><a href="#">Creative <span>(8)</span></a></li>-->
<!--                    <li><a href="#">Educaion <span>(14)</span></a></li>-->
<!--                  </ul>-->
<!--                </div>-->

                <div class="sidebar-item recent-posts">
                  <h3 class="sidebar-title">{{ $t('recent_posts') }}</h3>
                  <div class="mt-3">
                    <div class="post-item mt-3" v-for="doc in latestDocuments" v-bind:key="doc.id">
                      <img :src="$calcDocumentEntryImgUrl(doc, topic.id, '', 's')" alt="">
                      <div>
                        <h4><a href="blog-details.html">{{ $localedText(doc.title) }}</a></h4>
                        <time>{{ $unixTimestampToReadable(doc.tc) }}</time>
                      </div>
                    </div>
                  </div>
                </div>

<!--                <div class="sidebar-item tags">-->
<!--                  <h3 class="sidebar-title">Tags</h3>-->
<!--                  <ul class="mt-3">-->
<!--                    <li><a href="#">App</a></li>-->
<!--                    <li><a href="#">IT</a></li>-->
<!--                    <li><a href="#">Business</a></li>-->
<!--                    <li><a href="#">Mac</a></li>-->
<!--                    <li><a href="#">Design</a></li>-->
<!--                    <li><a href="#">Office</a></li>-->
<!--                    <li><a href="#">Creative</a></li>-->
<!--                    <li><a href="#">Studio</a></li>-->
<!--                    <li><a href="#">Smart</a></li>-->
<!--                    <li><a href="#">Tips</a></li>-->
<!--                    <li><a href="#">Marketing</a></li>-->
<!--                  </ul>-->
<!--                </div>-->
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
import '@/_shared/assets/markdown-gfm.css'
import legoPageHeader from './_pageHeader.vue'
import legoPageFooter from './_pageFooter.vue'
import {markdownRender} from "@/_shared/utils/docms_utils";

export default {
  name: 'Document',
  inject: ['$siteMeta', '$specialDocuments', '$siteTopics', '$latestDocuments'],
  components: {legoPageHeader, legoPageFooter},
  mounted() {
    const vue = this
    const route = useRoute()
    watch(
        () => route.params.tid,
        async newTid => {
          vue._fetchTopics(vue, newTid)
        }
    )
    watch(
        () => route.params.did,
        async () => {
          vue._fetchTopics(vue, route.params.tid)
        }
    )
    this._fetchSiteMeta(this)
  },
  computed: {
    documentContentRendered() {
      const text = this.$localedText(this.document.content)
      if (typeof text == "string") {
        return markdownRender(text, {
          sanitize: true,
          tags: this.$siteMeta.tags,
        })
      }
      return ''
    },
    latestDocuments() {
      const result = []
      for (let i = 0; i < this.$latestDocuments.length; i++) {
        // if (this.$latestDocuments[i].id != this.document.id) {
          result.push(this.$latestDocuments[i])
        // }
      }
      return result
    },
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
                  vue.topic = t
                  vue._fetchDocuments(vue, topicId, vue.$route.params.did)
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
    _fetchDocuments(vue, topicId, docId) {
      vue.$fetchDocumentsForTopic(topicId,
          () => vue.status=0,
          apiResp => {
            vue.status = apiResp.status
            if (vue.status == 200) {
              vue.documentList = apiResp.data
              vue.documentList.forEach(d => {
                if (d.id == docId) {
                  vue.$updatePageTitle({document: d})
                  vue.document = d
                  vue._fetchDocument(vue, docId)
                }
              })
            } else {
              // vue.errorMsg = vue.status+": "+apiResp.message
            }
            if (!vue.document.id) {
              vue.$transferToTopic(vue.topic.id, 3)
            }
          },
          err => vue.errorMsg = err
      )
    },
    _fetchDocument(vue, docId) {
      vue.$fetchDocument(vue.topic.id, docId,
          () => vue.status=0,
          apiResp => {
            vue.status = apiResp.status
            if (vue.status == 200) {
              vue.document = apiResp.data
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
      document: {},
      status: -1,
      errorMsg: '',
    }
  },
}
</script>