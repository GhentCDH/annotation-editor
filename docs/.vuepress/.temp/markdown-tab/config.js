import { CodeTabs } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+no_2c4b0de9040acb79f7fe498bc2443fb9/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/CodeTabs.js";
import { Tabs } from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.130_@vuepress+bundler-vite@2.0.0-rc.26_@types+no_2c4b0de9040acb79f7fe498bc2443fb9/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/Tabs.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
