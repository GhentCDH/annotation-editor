import { Layout, NotFound, injectDarkMode, setupDarkMode, setupSidebarItems, scrollPromise } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-theme-hope@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@26.0.1__cd75f5a92409d6047c8540f99e6c6eec/node_modules/vuepress-theme-hope/dist/bundle/exports/base.js";

import { defineCatalogInfoGetter } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+plugin-catalog@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@26_3a3da4bf989149ff9b2f3a4a13373311/node_modules/@vuepress/plugin-catalog/dist/client/index.js"
import { h } from "vue"
import { resolveComponent } from "vue"

import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@26.0.1_jit_2f750163010f7c76b2060a841a161da9/node_modules/@vuepress/helper/dist/client/styles/colors.css";
import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@26.0.1_jit_2f750163010f7c76b2060a841a161da9/node_modules/@vuepress/helper/dist/client/styles/normalize.css";
import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@26.0.1_jit_2f750163010f7c76b2060a841a161da9/node_modules/@vuepress/helper/dist/client/styles/sr-only.css";
import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-theme-hope@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@26.0.1__cd75f5a92409d6047c8540f99e6c6eec/node_modules/vuepress-theme-hope/dist/client/styles/index.scss";

defineCatalogInfoGetter((meta) => {
  const title = meta.title;
  const shouldIndex = meta.index ?? true;
  const icon = meta.icon;

  return shouldIndex ? {
    title,
    content: icon ? () =>[h(resolveComponent("VPIcon"), { icon, sizing: "both" }), title] : null,
    order: meta.order,
    index: meta.index,
  } : null;
});

export default {
  enhance: ({ app, router }) => {
    const { scrollBehavior } = router.options;

    router.options.scrollBehavior = async (...args) => {
      await scrollPromise.wait();

      return scrollBehavior(...args);
    };

    // inject global properties
    injectDarkMode(app);


  },
  setup: () => {
    setupDarkMode();
    setupSidebarItems();

  },
  layouts: {
    Layout,
    NotFound,

  }
};
