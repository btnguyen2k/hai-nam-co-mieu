import {initRouter} from '@/_shared/router'

const router = initRouter({
    '_editor': () => import('@/_shared/components/Editor.vue'),
    // '_search': () => import('@/tpl-upconstruction/components/Search.vue'),
    // '_tagsearch': () => import('@/tpl-upconstruction/components/TagSearch.vue'),
    'home': () => import('@/tpl-upconstruction/components/Home.vue'),
    // 'topic': () => import('@/tpl-upconstruction/components/Topic.vue'),
    // 'document': () => import('@/tpl-upconstruction/components/Document.vue'),
})

export default router
