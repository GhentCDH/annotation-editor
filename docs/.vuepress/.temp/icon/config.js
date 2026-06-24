import { hasGlobalComponent } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6.0_jit_d4157ca7438bef626b270e0d8ae4258a/node_modules/@vuepress/helper/dist/client/index.js";
import { useScriptTag } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vueuse+core@14.3.0_vue@3.5.38_typescript@6.0.3_/node_modules/@vueuse/core/dist/index.js";
import { h } from "vue";
import { VPIcon } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+plugin-icon@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6._f5a63c73fbd877f7c620a44dd9dca016/node_modules/@vuepress/plugin-icon/dist/client/index.js"

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("VPIcon")) {
      app.component(
        "VPIcon",
        (props) =>
          h(VPIcon, {
            type: "iconify",
            prefix: "",
            ...props,
          })
      )
    }
  },
  setup: () => {
    useScriptTag(`https://cdn.jsdelivr.net/npm/iconify-icon@2`);
  },
}
