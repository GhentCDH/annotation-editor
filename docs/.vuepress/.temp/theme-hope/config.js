import { Layout, NotFound, injectDarkMode, setupDarkMode, setupSidebarItems, scrollPromise } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-theme-hope@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6.0__dbdb09d4458af9d1179eafad1fc701ba/node_modules/vuepress-theme-hope/dist/bundle/exports/base.js";

import { defineCatalogInfoGetter } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+plugin-catalog@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25_6bb061fc0fd3c12576c0f35b0e9cbca4/node_modules/@vuepress/plugin-catalog/dist/client/index.js"
import { h } from "vue"
import { resolveComponent } from "vue"

import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6.0_jit_d4157ca7438bef626b270e0d8ae4258a/node_modules/@vuepress/helper/dist/client/styles/colors.css";
import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6.0_jit_d4157ca7438bef626b270e0d8ae4258a/node_modules/@vuepress/helper/dist/client/styles/normalize.css";
import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6.0_jit_d4157ca7438bef626b270e0d8ae4258a/node_modules/@vuepress/helper/dist/client/styles/sr-only.css";
import "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-theme-hope@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@25.6.0__dbdb09d4458af9d1179eafad1fc701ba/node_modules/vuepress-theme-hope/dist/client/styles/index.scss";

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
