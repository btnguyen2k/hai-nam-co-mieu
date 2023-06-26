//#DO CMS frontend
import {createI18n} from 'vue-i18n'
import {localStorageGet, localStorageSet} from './utils/app_utils'
import {reactive, watchEffect} from 'vue'

const messages = {
    vi: {
        _name: 'Tiếng Việt',
        _flag: 'cif-vn',

        language: 'Ngôn ngữ',
        wait: 'Vui lòng giờ giây lát...',
        reload: 'Tải lại',
        transfer_to_home: 'Bạn sẽ được chuyển về trang nhà trong vài giây nữa, hoặc bạn có thể nhấn <a href="{url}">vào đây</a> để về trang nhà',
        transfer_to_topic: 'Bạn sẽ được chuyển về trang chủ đề trong vài giây nữa, hoặc bạn có thể nhấn <a href="{url}">vào đây</a> để về trang nhà',
        search: 'Tìm kiếm',
        search_result: 'Kết quả tìm kiếm',
        search_no_result: 'Tìm kiếm không trả về kết quả, vui lòng thử với câu truy vấn khác',
        search_prompt: 'Nhập câu truy vấn tìm kiếm',
        tag_cloud: 'Vân tiêu',
        tags: 'Thẻ',
        tag: 'Thẻ',

        home: 'Trang nhà',
        topics: 'Chủ đề',
        topic: 'Chủ đề',
        documents: 'Bài viết',
        document: 'Bài viết',
        document_length: '{words} từ, {time} phút đọc',
        toc: 'Mục lục',
        read: 'Xem',
        view_all: 'Xem tất cả',
        explore: 'Khám phá',
        contact_info: 'Thông tin liên hệ',
        recent_posts: 'Các bài viết mới',
        same_topic: 'Trong cùng chủ đề',

        error: 'Lỗi',
        error_topic_not_found: 'Không tìm thấy chủ đề "{topic}"',
        error_document_not_found: 'Không tìm thấy bài viết "{topic}/{document}"',

        empty_topic: 'Chủ đề này hiện chưa có bài viết nào',
    }
}

let savedLocale = localStorageGet('_l')
savedLocale = savedLocale ? (messages[savedLocale] ? savedLocale : 'vi') : 'vi'
const _i18n = createI18n({
    locale: savedLocale,
    fallbackLocale: 'vi',
    messages: messages,
})

/* i18n.global is readonly, we need to clone a new instance and make it reactive */
const i18n = {..._i18n}
i18n.global = reactive(i18n.global)
let oldLocale = i18n.global.locale
watchEffect(() => {
    if (i18n.global.locale !== oldLocale) {
        localStorageSet('_l', i18n.global.locale)
        oldLocale = i18n.global.locale
    }
})

export default i18n

export function switchLanguage(locale, refreshPage) {
    if (locale == '') {
        locale = localStorageGet('_l')
    }
    if (locale !== oldLocale) {
        i18n.global.locale = messages[locale] ? locale : 'vi'
        if (refreshPage) {
            window.location.reload()
        }
    }
}
