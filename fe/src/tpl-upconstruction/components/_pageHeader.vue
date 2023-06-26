<template>
  <header id="header" class="header d-flex align-items-center">
    <div class="container-fluid container-xl d-flex align-items-center justify-content-between">
      <a href="index.html" class="logo d-flex align-items-center">
        <h1>Hải Nam <span>Cổ Miếu</span></h1>
      </a>

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
  mounted() {
  },
  methods: {
  },
}
</script>