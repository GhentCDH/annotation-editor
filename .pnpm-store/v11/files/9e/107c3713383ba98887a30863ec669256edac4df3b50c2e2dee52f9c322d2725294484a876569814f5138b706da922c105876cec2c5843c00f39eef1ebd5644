import { n as viewPDF, t as DEFAULT_RATIO } from "../../utils-hzS-z8ER.js";
import { t as getLink } from "../../getLink-CAHz8FNe.js";
import { t as useSize } from "../../useSize-jWUR3Ztl.js";
import { useLocaleConfig } from "@vuepress/helper/client";
import { defineComponent, h, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import { useScrollLock } from "@vueuse/core";
import { CancelFullScreenIcon, EnterFullScreenIcon } from "vuepress-shared/client";
import "../styles/pdf.scss";

//#region src/client/components/PDF.ts
var PDF_default = defineComponent({
	name: "PDF",
	props: {
		/**
		* PDF link, should be absolute url
		*
		* PDF 文件链接，应为完整链接
		*/
		url: {
			type: String,
			required: true
		},
		/**
		* PDF title
		*
		* PDF 标题
		*/
		title: String,
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
		* PDF initial page number
		*
		* PDF 初始页码
		*
		* Chrome only
		*/
		page: {
			type: [String, Number],
			default: 1
		},
		/**
		* Whether show toolbar
		*
		* 是否显示工具栏
		*
		* Chrome only
		*/
		noToolbar: Boolean,
		/**
		* Whether disable fullscreen button
		*
		* 是否禁用全屏按钮
		*/
		noFullscreen: Boolean,
		/**
		* Initial zoom level (in percent)
		*
		* 初始缩放比率 (百分比)
		*/
		zoom: [String, Number],
		/**
		* Whether use pdfjs viewer by force
		*
		* 是否强制使用 pdfjs 阅读器
		*/
		viewer: Boolean
	},
	setup(props) {
		const { el, width, height, resize } = useSize(props);
		const locales = useLocaleConfig(PDF_LOCALES);
		const body = shallowRef();
		const viewer = shallowRef();
		const isLocked = useScrollLock(body);
		const isFullscreen = ref(false);
		watch(isFullscreen, (value) => {
			isLocked.value = value;
		});
		onMounted(() => {
			body.value = document.body;
			viewPDF(viewer.value, {
				url: getLink(props.url),
				title: props.title,
				hint: locales.value.hint,
				options: {
					page: props.page,
					noToolbar: props.noToolbar,
					...props.zoom && props.zoom.toString() !== "100" ? { zoom: props.zoom } : {}
				},
				pdfjs: props.viewer
			});
			resize();
		});
		onUnmounted(() => {
			isLocked.value = false;
		});
		return () => h("div", {
			class: ["pdf-viewer-wrapper", { fullscreen: isFullscreen.value }],
			ref: el,
			style: isFullscreen.value ? {} : {
				width: width.value,
				height: height.value
			}
		}, [h("div", { ref: viewer }), props.noFullscreen ? null : h("button", {
			class: "pdf-fullscreen-button",
			onClick: () => {
				isFullscreen.value = !isFullscreen.value;
			}
		}, h(isFullscreen.value ? CancelFullScreenIcon : EnterFullScreenIcon, { class: "pdf-fullscreen-icon" }))]);
	}
});

//#endregion
export { PDF_default as default };
//# sourceMappingURL=PDF.js.map