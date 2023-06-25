<template>
  <div v-if="errorMsg!=''" class="alert alert-danger m-4" role="alert">
    {{ errorMsg }}
    <hr/>
    <p class="btn btn-outline-primary mb-0" @click="$reload()"><i class="bi bi-arrow-clockwise"></i> {{ $t('reload') }}</p>
  </div>
  <div v-else-if="status<=0" class="alert alert-info m-4" role="alert"><i class="bi bi-hourglass"></i> {{ $t('wait') }}</div>
  <div v-else>
    <header id="header" class="header d-flex align-items-center">
      <div class="container-fluid container-xl d-flex align-items-center justify-content-between">
        <a href="index.html" class="logo d-flex align-items-center">
          <h1>Hải Nam <span>Cổ Miếu</span></h1>
        </a>

        <i class="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
        <i class="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>
        <nav id="navbar" class="navbar">
          <ul>
            <li><router-link :to="{name: 'Home'}" class="active">{{ $t('home') }}</router-link></li>
  <!--          <li><a href="index.html" class="active">{{ $t('home') }}</a></li>-->
  <!--          <li><a href="index.html">Home</a></li>-->
  <!--          <li><a href="about.html" class="active">About</a></li>-->
  <!--          <li><a href="services.html">Services</a></li>-->
  <!--          <li><a href="projects.html">Projects</a></li>-->
  <!--          <li><a href="blog.html">Blog</a></li>-->
  <!--          <li class="dropdown"><a href="#"><span>Dropdown</span> <i-->
  <!--              class="bi bi-chevron-down dropdown-indicator"></i></a>-->
  <!--            <ul>-->
  <!--              <li><a href="#">Dropdown 1</a></li>-->
  <!--              <li class="dropdown"><a href="#"><span>Deep Dropdown</span> <i-->
  <!--                  class="bi bi-chevron-down dropdown-indicator"></i></a>-->
  <!--                <ul>-->
  <!--                  <li><a href="#">Deep Dropdown 1</a></li>-->
  <!--                  <li><a href="#">Deep Dropdown 2</a></li>-->
  <!--                  <li><a href="#">Deep Dropdown 3</a></li>-->
  <!--                  <li><a href="#">Deep Dropdown 4</a></li>-->
  <!--                  <li><a href="#">Deep Dropdown 5</a></li>-->
  <!--                </ul>-->
  <!--              </li>-->
  <!--              <li><a href="#">Dropdown 2</a></li>-->
  <!--              <li><a href="#">Dropdown 3</a></li>-->
  <!--              <li><a href="#">Dropdown 4</a></li>-->
  <!--            </ul>-->
  <!--          </li>-->
  <!--          <li><a href="contact.html">Contact</a></li>-->
          </ul>
        </nav>
      </div>
    </header>

    <main id="main">
      <div class="breadcrumbs d-flex align-items-center" :style="'background-image: url('+($calcDocumentEntryImgUrl($specialDocuments['about'], $specialDocuments['about'].topic.id, '', 'h'))+')'">
        <div class="container position-relative d-flex flex-column align-items-center" data-aos="fade">
          <h2>{{ $t('home') }}</h2>
          <ol><li>&nbsp;</li></ol>
        </div>
      </div>

      <div class="docms-content img-fit img-center" v-html="documentContentRendered"></div>
    </main>

    <footer id="footer" class="footer"
            :style="'background-image: url('+($calcDocumentEntryImgUrl($specialDocuments['footer'], $specialDocuments['footer'].topic.id, '', 'h'))+')'">
      <div class="footer-content position-relative">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 col-md-6">
              <div class="footer-info">
                <h3>{{ $siteMeta.name }}</h3>
                <p>
                  Địa chỉ liên lạc（聯絡地址）:
                  <br/>
                  Hiệu buôn Bình Nguyên, số 15 đường Lý Văn Lâm, K4, P1, Cà Mau.
                  平原商店，金甌第一坊李文林街15號
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-legal text-center position-relative">
        <!-- All the links in the footer should remain intact. -->
        <!-- You can delete the links only if you purchased the pro version. -->
        <!-- Licensing information: https://bootstrapmade.com/license/ -->
        <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/ -->
        <div class="container">
          <div class="copyright">
            &copy; Copyright <strong><span>{{ $siteMeta.name }}</span></strong>. Designed by <a target="_blank" href="https://bootstrapmade.com/">BootstrapMade</a>.
          </div>
          <div class="credits"></div>
        </div>
      </div>
    </footer>

    <a href="#" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
  </div>
</template>

<script>
import {markdownRender} from '@/_shared/utils/docms_utils'
const largeTopicThreshold = 0

export default {
  name: 'Home',
  inject: ['$global', '$siteMeta', '$siteTopics', '$latestDocuments', '$specialDocuments'],
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
