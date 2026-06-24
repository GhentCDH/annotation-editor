import comp from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"heroText\":\"Annotation Editor\",\"tagline\":\"W3C-compliant annotation editing and preview components for Vue 3\",\"actions\":[{\"text\":\"Quick Start\",\"link\":\"/guide/quick-start\",\"type\":\"primary\"},{\"text\":\"GitHub\",\"link\":\"https://github.com/GhentCDH/annotation-editor\",\"type\":\"secondary\"}],\"features\":[{\"title\":\"W3C Annotations\",\"details\":\"Built on the W3C Web Annotation Data Model — interoperable, standard-compliant annotation storage.\"},{\"title\":\"Dual-mode components\",\"details\":\"AnnotationEditor for create/edit workflows, AnnotationPreview for read-only display with modal detail view.\"},{\"title\":\"Flexible layout\",\"details\":\"Simple column grid or fully custom CSS grid-area layouts for multi-source text panes.\"},{\"title\":\"Headless API\",\"details\":\"No built-in persistence — wire in your own adapters or handle events directly in Vue.\"}]},\"readingTime\":{\"minutes\":0.36,\"words\":107},\"filePathRelative\":\"README.md\"}")
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
