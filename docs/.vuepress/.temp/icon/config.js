import { hasGlobalComponent } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6.0_jit_3b68e05cbda16a7100d82bfe935004e2/node_modules/@vuepress/helper/dist/client/index.js";
import { useScriptTag } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vueuse+core@14.3.0_vue@3.5.38_typescript@5.9.3_/node_modules/@vueuse/core/dist/index.js";
import { h } from "vue";
import { VPIcon } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+plugin-icon@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6._e6fe19eb4433cf5ce3097c385c979841/node_modules/@vuepress/plugin-icon/dist/client/index.js"

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
