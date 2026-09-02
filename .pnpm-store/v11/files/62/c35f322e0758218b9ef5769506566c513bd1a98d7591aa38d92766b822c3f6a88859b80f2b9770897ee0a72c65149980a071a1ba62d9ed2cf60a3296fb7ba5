import { getDate } from "@vuepress/helper/client";
import { useBlogType } from "@vuepress/plugin-blog/client";
import { computed, inject, provide } from "vue";
import { useLang } from "vuepress/client";
export const timelineSymbol = Symbol(__VUEPRESS_DEV__ ? "timeline" : "");
/**
 * Inject timeline
 *
 * @returns Timeline global computed
 */
export const useTimeline = () => {
    const timeline = inject(timelineSymbol);
    if (!timeline)
        throw new Error("useTimeline() is called without provider.");
    return timeline;
};
/** Provide timelines */
export const setupTimeline = () => {
    const timeline = useBlogType("timeline");
    const pageLang = useLang();
    const timelineItems = computed(() => {
        const results = [];
        // Filter before sort
        timeline.value.items.forEach(({ info, path }) => {
            const result = getDate(info.date);
            if (result) {
                const year = result.getFullYear();
                if (results[0]?.year !== year)
                    results.unshift({ year, items: [] });
                results[0].items.push({
                    date: result.toLocaleDateString(pageLang.value, {
                        month: "numeric",
                        day: "numeric",
                    }),
                    info,
                    path,
                });
            }
        });
        return {
            ...timeline.value,
            config: results.reverse(),
        };
    });
    provide(timelineSymbol, timelineItems);
};
//# sourceMappingURL=useTimeline.js.map