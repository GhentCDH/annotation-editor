import { t as DEFAULT_RATIO, u as videoIframeAllow } from "../../utils-hzS-z8ER.js";
import { t as useSize } from "../../useSize-jWUR3Ztl.js";
import { LoadingIcon } from "@vuepress/helper/client";
import { computed, defineComponent, h, ref } from "vue";
import "../styles/bili-bili.scss";

//#region src/client/components/BiliBili.ts
const VIDEO_LINK = "https://player.bilibili.com/player.html";
var BiliBili_default = defineComponent({
	name: "BiliBili",
	props: {
		/**
		* BiliBili video id
		*
		* B 站视频 ID
		*/
		bvid: String,
		/**
		* BiliBili video aid
		*
		* B 站视频 a ID
		*/
		aid: String,
		/**
		* BiliBili video cid
		*
		* B 站视频 CID
		*/
		cid: String,
		/**
		* BiliBili video title
		*
		* B 站视频标题
		*/
		title: {
			type: String,
			default: "A BiliBili video"
		},
		/**
		* BiliBili video page
		*
		* B 站视频分页
		*/
		page: {
			type: [String, Number],
			default: 1
		},
		/**
		* Component width
		*
		* 组件宽度
		*/
		width: {
			type: [String, Number],
			default: "100%"
		},
		/**
		* Component height
		*
		* 组件高度
		*/
		height: [String, Number],
		/**
		* Component width / height ratio
		*
		* 组件长宽比
		*/
		ratio: {
			type: [String, Number],
			default: DEFAULT_RATIO
		},
		/**
		* Start time in seconds
		*
		* 基于秒数的开始时间
		*/
		time: {
			type: [String, Number],
			default: 0
		},
		/**
		* Whether autoplay
		*
		* 是否自动播放
		*/
		autoplay: Boolean
	},
	setup(props) {
		const { el, width, height, resize } = useSize(props);
		const loaded = ref(false);
		const videoLink = computed(() => {
			const { aid, bvid, cid, autoplay, time, page } = props;
			return aid && cid ? `${VIDEO_LINK}?aid=${aid}&cid=${cid}&t=${time}&autoplay=${autoplay ? 1 : 0}&p=${page}` : bvid ? `${VIDEO_LINK}?bvid=${bvid}&t=${time}&autoplay=${autoplay ? 1 : 0}` : null;
		});
		return () => videoLink.value ? [
			h("div", { class: "bilibili-desc" }, h("a", {
				class: "sr-only",
				href: videoLink.value
			}, props.title)),
			h("iframe", {
				ref: el,
				src: videoLink.value,
				title: props.title,
				class: "bilibili-iframe",
				allow: videoIframeAllow,
				style: {
					width: width.value,
					height: loaded.value ? height.value : 0
				},
				onLoad: () => {
					loaded.value = true;
					resize();
				}
			}),
			loaded.value ? null : h(LoadingIcon)
		] : [];
	}
});

//#endregion
export { BiliBili_default as default };
//# sourceMappingURL=BiliBili.js.map