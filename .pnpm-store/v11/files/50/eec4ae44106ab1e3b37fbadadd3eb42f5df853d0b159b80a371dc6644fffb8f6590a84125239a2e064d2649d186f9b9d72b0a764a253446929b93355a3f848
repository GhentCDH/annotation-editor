import { n as ReadingTime, r as ReadingTimePluginPageData, t as ReadingTimePluginLocaleData } from "../locales-6008QQbC.js";
import { ComputedRef } from "vue";

//#region src/client/composables/useReadingTimeData.d.ts
/**
 * Get reading time data of current page
 *
 * 获取当前页面的阅读时间数据
 *
 * @example
 *   import { useReadingTimeData } from '@vuepress/plugin-reading-time/client'
 *
 *   const readingTimeData = useReadingTimeData()
 *   // { minutes: 1.1, words: 100 } or null
 *
 * @returns Reading time data or null if plugin is disabled
 */
declare const useReadingTimeData: () => ComputedRef<ReadingTime | null>;
//#endregion
//#region src/client/composables/useReadingTimeLocale.d.ts
/**
 * Get reading time locale config
 *
 * 获取阅读时间多语言配置
 *
 * @returns Reading time locale config or null if plugin is disabled
 */
declare const useReadingTimeLocaleConfig: () => ComputedRef<ReadingTimePluginLocaleData | null>;
/**
 * Reading time locale interface
 *
 * 阅读时间本地化接口
 */
interface ReadingTimeLocale {
  /**
   * Reading time text
   *
   * 阅读时间文字
   */
  time: string;
  /**
   * Words count text
   *
   * 字数统计文字
   */
  words: string;
}
/**
 * Get reading time locale data of current page
 *
 * 获取当前页面的阅读时间本地化数据
 *
 * @example
 *   import { useReadingTimeLocale } from '@vuepress/plugin-reading-time/client'
 *
 *   const readingTimeLocale = useReadingTimeLocale()
 *   // { time: "1 minute", words: "100 words" }
 *
 * @returns Reading time locale data
 */
declare const useReadingTimeLocale: () => ComputedRef<ReadingTimeLocale>;
//#endregion
//#region src/client/utils/locales.d.ts
/**
 * Get reading time locale text
 *
 * 获取阅读时间本地化文字
 *
 * @example
 *   getReadingTimeLocale(
 *     { minutes: 2.5, words: 500 },
 *     {
 *       less1Minute: 'Less than 1 min',
 *       word: '$word words',
 *       time: '$time min',
 *     },
 *   )
 *   // { time: "3 min", words: "500 words" }
 *
 * @param readingTime - Reading time data
 * @param locale - Locale config
 * @returns Localized reading time text
 */
declare const getReadingTimeLocale: (readingTime: ReadingTime, locale: ReadingTimePluginLocaleData) => {
  time: string;
  words: string;
};
//#endregion
export { ReadingTime, ReadingTimeLocale, ReadingTimePluginLocaleData, ReadingTimePluginPageData, getReadingTimeLocale, useReadingTimeData, useReadingTimeLocale, useReadingTimeLocaleConfig };
//# sourceMappingURL=index.d.ts.map