import comp from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/guide/quick-start.html.vue"
const data = JSON.parse("{\"path\":\"/guide/quick-start.html\",\"title\":\"Quick Start\",\"lang\":\"en-US\",\"frontmatter\":{},\"readingTime\":{\"minutes\":1.32,\"words\":397},\"filePathRelative\":\"guide/quick-start.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
