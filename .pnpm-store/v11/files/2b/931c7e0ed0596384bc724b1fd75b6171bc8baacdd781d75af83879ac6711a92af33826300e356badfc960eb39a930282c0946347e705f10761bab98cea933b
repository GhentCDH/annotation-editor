import { a as TwikooOptions, c as GiscusOptions, d as NoCommentPluginOptions, f as ArtalkOptions, i as TwikooInitOptions, l as GiscusRepo, n as WalineLocaleData, o as GiscusInputPosition, p as CommentPluginFrontmatter, r as WalineOptions, s as GiscusMapping, t as CommentOptions, u as GiscusTheme } from "../index-D8QJUAuS.js";
import { DefaultLocaleInfo } from "@vuepress/helper";
import { LocaleConfig } from "vuepress/shared";
import { PluginFunction } from "vuepress/core";

//#region src/node/options.d.ts
/**
 * Artalk comment plugin options
 *
 * Artalk 评论插件选项
 */
interface ArtalkPluginOptions extends Omit<Partial<ArtalkOptions>, 'avatarURLBuilder' | 'imgUploader'> {
  provider: 'Artalk';
}
/**
 * Giscus comment plugin options
 *
 * Giscus 评论插件选项
 */
interface GiscusPluginOptions extends Partial<GiscusOptions> {
  provider: 'Giscus';
}
/**
 * Twikoo comment plugin options
 *
 * Twikoo 评论插件选项
 */
interface TwikooPluginOptions extends Partial<TwikooOptions> {
  provider: 'Twikoo';
}
/**
 * Waline comment plugin options
 *
 * Waline 评论插件选项
 */
interface WalinePluginOptions extends Omit<Partial<WalineOptions>, 'highlighter' | 'imageUploader' | 'search' | 'texRenderer'> {
  provider: 'Waline';
  /**
   * Whether import meta icons
   *
   * 是否导入 Meta 图标
   *
   * @default true
   */
  metaIcon?: boolean;
  /**
   * Locale config for waline
   *
   * Waline 本地化配置
   */
  locales?: LocaleConfig<WalineLocaleData>;
}
/**
 * Comment plugin options
 *
 * 评论插件选项
 */
type CommentPluginOptions = ArtalkPluginOptions | GiscusPluginOptions | NoCommentPluginOptions | TwikooPluginOptions | WalinePluginOptions;
//#endregion
//#region src/node/commentPlugin.d.ts
/**
 * VuePress comment plugin
 *
 * VuePress 评论插件
 *
 * @example
 *   import { commentPlugin } from '@vuepress/plugin-comment'
 *
 *   export default {
 *     plugins: [
 *       commentPlugin({
 *         provider: 'Waline',
 *         serverURL: 'https://waline.example.com',
 *       }),
 *     ],
 *   }
 */
declare const commentPlugin: (options: CommentPluginOptions) => PluginFunction;
//#endregion
//#region src/node/locales.d.ts
/** Default locale info for Waline */
declare const walineLocalesInfo: DefaultLocaleInfo<WalineLocaleData>;
//#endregion
export { ArtalkOptions, ArtalkPluginOptions, CommentOptions, CommentPluginFrontmatter, CommentPluginOptions, GiscusInputPosition, GiscusMapping, GiscusOptions, GiscusPluginOptions, GiscusRepo, GiscusTheme, NoCommentPluginOptions, TwikooInitOptions, TwikooOptions, TwikooPluginOptions, WalineLocaleData, WalineOptions, WalinePluginOptions, commentPlugin, walineLocalesInfo };
//# sourceMappingURL=index.d.ts.map