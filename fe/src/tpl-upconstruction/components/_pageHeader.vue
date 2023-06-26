<template>
  <header id="header" class="header d-flex align-items-center">
    <div class="container-fluid container-xl d-flex align-items-center justify-content-between">
      <router-link :to="{name: 'Home'}" class="logo d-flex align-items-center">
        <h1>Hải Nam <span>Cổ Miếu</span></h1>
      </router-link>

      <i class="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
      <i class="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>
      <nav id="navbar" class="navbar">
        <ul>
          <li><router-link :to="{name: 'Home'}" :class="$props['active']=='home'?'active':''">{{ $t('home') }}</router-link></li>
          <li v-for="topic in visibleTopics" v-bind:key="topic.id">
            <router-link :to="{name: 'Topic', params: {tid: topic.id}}"
                :class="$props['active']=='topic'&&$props['topic'].id==topic.id?'active':''">
              {{ $localedText(topic.title) }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'lego-page-header',
  inject: ['$siteTopics'],
  props: ['active', 'topic'],
  mounted() {
    /*--- Javascript setup for template --*/
    // Mobile nav toggle
    const mobileNavShow = document.querySelector('.mobile-nav-show')
    const mobileNavHide = document.querySelector('.mobile-nav-hide')
    function mobileNavToogle() {
      document.querySelector('body').classList.toggle('mobile-nav-active')
      mobileNavShow.classList.toggle('d-none')
      mobileNavHide.classList.toggle('d-none')
    }
    document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
      el.addEventListener('click', function(event) {
        event.preventDefault()
        mobileNavToogle()
      })
    })

    // Hide mobile nav on same-page/hash links
    document.querySelectorAll('#navbar a').forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = document.querySelector(navbarlink.hash)
      if (!section) return
      navbarlink.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle()
        }
      })
    })

    // Toggle mobile nav dropdowns
    const navDropdowns = document.querySelectorAll('.navbar .dropdown > a')
    navDropdowns.forEach(el => {
      el.addEventListener('click', function(event) {
        if (document.querySelector('.mobile-nav-active')) {
          event.preventDefault()
          this.classList.toggle('active')
          this.nextElementSibling.classList.toggle('dropdown-active')
          const dropDownIndicator = this.querySelector('.dropdown-indicator')
          dropDownIndicator.classList.toggle('bi-chevron-up')
          dropDownIndicator.classList.toggle('bi-chevron-down')
        }
      })
    })
  },
  computed: {
    visibleTopics() {
      const result = []
      for (let i = 0; i < this.$siteTopics.length; i++) {
        if (!this.$siteTopics[i].hidden) {
          result.push(this.$siteTopics[i])
        }
      }
      return result
    },
  },
  methods: {
  },
}
</script>