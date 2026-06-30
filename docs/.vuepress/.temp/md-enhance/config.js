import CodeDemo from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@_15ea275b02aaa2875e652e16009437fb/node_modules/vuepress-plugin-md-enhance/dist/client/components/CodeDemo.js";
import MdDemo from "/Users/bovandersteene/project/ugent/annotations/annotation-editor/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-rc.107_@vuepress+bundler-vite@2.0.0-rc.26_@types+node@_15ea275b02aaa2875e652e16009437fb/node_modules/vuepress-plugin-md-enhance/dist/client/components/MdDemo.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
  },
};
