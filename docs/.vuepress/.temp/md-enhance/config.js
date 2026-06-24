import CodeDemo from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@_affa61a806d3904cdac83493943f99f6/node_modules/vuepress-plugin-md-enhance/dist/client/components/CodeDemo.js";
import MdDemo from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@_affa61a806d3904cdac83493943f99f6/node_modules/vuepress-plugin-md-enhance/dist/client/components/MdDemo.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
  },
};
