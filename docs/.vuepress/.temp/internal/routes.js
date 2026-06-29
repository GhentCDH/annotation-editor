export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Annotation Editor"} }],
  ["/demo/editor.html", { loader: () => import(/* webpackChunkName: "demo_editor.html" */"/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/demo/editor.html.js"), meta: {"title":""} }],
  ["/demo/preview.html", { loader: () => import(/* webpackChunkName: "demo_preview.html" */"/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/demo/preview.html.js"), meta: {"title":"Preview"} }],
  ["/guide/annotation-editor.html", { loader: () => import(/* webpackChunkName: "guide_annotation-editor.html" */"/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/guide/annotation-editor.html.js"), meta: {"title":"AnnotationEditor"} }],
  ["/guide/annotation-preview.html", { loader: () => import(/* webpackChunkName: "guide_annotation-preview.html" */"/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/guide/annotation-preview.html.js"), meta: {"title":"AnnotationPreview"} }],
  ["/guide/quick-start.html", { loader: () => import(/* webpackChunkName: "guide_quick-start.html" */"/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/guide/quick-start.html.js"), meta: {"title":"Quick Start"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
  ["/demo/", { loader: () => import(/* webpackChunkName: "demo_index.html" */"/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/demo/index.html.js"), meta: {"title":"Demo"} }],
  ["/guide/", { loader: () => import(/* webpackChunkName: "guide_index.html" */"/Users/bovandersteene/project/ugent/annotations/annotation-editor/docs/.vuepress/.temp/pages/guide/index.html.js"), meta: {"title":"Guide"} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
