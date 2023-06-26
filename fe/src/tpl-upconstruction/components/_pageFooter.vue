<template>
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
</template>

<script>
export default {
  name: 'lego-page-footer',
  inject: ['$siteMeta', '$specialDocuments'],
  computed: {
  },
  mounted() {
    // Scroll top button
    const scrollTop = document.querySelector('.scroll-top')
    if (scrollTop) {
      const togglescrollTop = () => {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active')
      }
      window.addEventListener('load', togglescrollTop)
      document.addEventListener('scroll', togglescrollTop)
      scrollTop.addEventListener('click', window.scrollTo({
        top: 0,
        behavior: 'smooth'
      }))
    }
  },
  methods: {
  },
}
</script>
