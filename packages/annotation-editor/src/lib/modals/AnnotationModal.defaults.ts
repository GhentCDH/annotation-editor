import {
  type ModalDefinition,
  type ModalTypeConfig,
} from './AnnotationModal.definition';
import ConfirmModal from './confirm/ConfirmModal.vue';
import {
  type ConfirmCloseEvent,
  type ConfirmProps,
} from './confirm/confirm.properties';
import { useConfirm } from './confirm/useConfirm.composable';
import {
  type AnnotationEditModal as AnnotationEditModalType,
  type AnnotationEditModalEvent,
  type AnnotationEditModalShow,
} from './edit-annotation/AnnotationEditModal.properties';
import AnnotationEditModal from './edit-annotation/AnnotationEditModal.vue';
import { useAnnotationEdit } from './edit-annotation/useAnnotationEditModal';
import {
  type AnnotationInfoCardEvent,
  type AnnotationInfoCardProp,
  type AnnotationInfoCardShow,
} from './info/AnnotationInfoCard.properties';
import AnnotationInfoCardComponent from './info/AnnotationInfoCard.vue';
import { useAnnotationInfo } from './info/useAnnotationInfo';
import LinkAnnotationModal from './link-annotation/LinkAnnotationModal.vue';
import {
  type LinkAnnotationCloseEvent,
  type LinkAnnotationProps,
  type LinkAnnotationShow,
} from './link-annotation/link-annotation.properties';
import { useLinkAnnotation } from './link-annotation/useLinkAnnotation.composable';
import ToastComponent from './toast/Toast.vue';
import { type EditToast } from './toast/toast.properties';
import { useToast } from './toast/useToast.composable';

export type AnnotationModalActionMap = {
  toast: ModalTypeConfig<EditToast, EditToast, void>;
  'info-card': ModalTypeConfig<
    AnnotationInfoCardProp,
    AnnotationInfoCardShow,
    AnnotationInfoCardEvent
  >;
  'edit-annotation': ModalTypeConfig<
    AnnotationEditModalType,
    AnnotationEditModalShow,
    AnnotationEditModalEvent
  >;
  'link-annotation': ModalTypeConfig<
    LinkAnnotationProps,
    LinkAnnotationShow,
    LinkAnnotationCloseEvent
  >;
  confirm: ModalTypeConfig<ConfirmProps, ConfirmProps, ConfirmCloseEvent>;
};

type AnnotationModalAction = keyof AnnotationModalActionMap;

export const annotationModalDefaults: Record<
  AnnotationModalAction,
  ModalDefinition
> = {
  'info-card': {
    component: AnnotationInfoCardComponent,
    useFn: useAnnotationInfo,
  },
  confirm: { component: ConfirmModal, useFn: useConfirm },
  'link-annotation': {
    component: LinkAnnotationModal,
    useFn: useLinkAnnotation,
  },
  toast: { component: ToastComponent, useFn: useToast },
  'edit-annotation': {
    component: AnnotationEditModal,
    useFn: useAnnotationEdit,
  },
};
