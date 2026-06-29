import { hasGlobalComponent } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@26.0.1_jit_2f750163010f7c76b2060a841a161da9/node_modules/@vuepress/helper/dist/client/index.js";
import Badge from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-plugin-components@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@_2e5598918c3f7c7974d93a1b1c5f6d09/node_modules/vuepress-plugin-components/dist/client/components/Badge.js";

import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@26.0.1_jit_2f750163010f7c76b2060a841a161da9/node_modules/@vuepress/helper/dist/client/styles/sr-only.css";

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    
  },
  setup: () => {

  },
  rootComponents: [

  ],
};
