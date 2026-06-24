import { hasGlobalComponent } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6.0_jit_3b68e05cbda16a7100d82bfe935004e2/node_modules/@vuepress/helper/dist/client/index.js";
import Badge from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-plugin-components@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@_2d388d8a3e68f39857ed866ede9697e1/node_modules/vuepress-plugin-components/dist/client/components/Badge.js";

import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6.0_jit_3b68e05cbda16a7100d82bfe935004e2/node_modules/@vuepress/helper/dist/client/styles/sr-only.css";

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    
  },
  setup: () => {

  },
  rootComponents: [

  ],
};
