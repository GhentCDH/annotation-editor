import { ModalDefinition, ModalTypeConfig } from './AnnotationModal.definition';
import { useToast } from './toast/useToast.composable';
import ToastComponent from './toast/Toast.vue';
import AnnotationInfoCardComponent from './info/AnnotationInfoCard.vue';
import {
  AnnotationInfoCardProp,
  AnnotationInfoCardEvent,
  AnnotationInfoCardShow,
} from './info/AnnotationInfoCard.properties';
import { useAnnotationInfo } from './info/useAnnotationInfo';
import AnnotationEditModal from './edit-annotation/AnnotationEditModal.vue';
import { useAnnotationEdit } from './edit-annotation/useAnnotationEditModal';
import {
  AnnotationEditModal as AnnotationEditModalType,
  AnnotationEditModalEvent,
  AnnotationEditModalShow,
} from './edit-annotation/AnnotationEditModal.properties';
import { useLinkAnnotation } from './link-annotation/useLinkAnnotation.composable';
import { ConfirmCloseEvent, ConfirmProps } from './confirm/confirm.properties';
import { EditToast } from './toast/toast.properties';

import ConfirmModal from './confirm/ConfirmModal.vue';
import { useConfirm } from './confirm/useConfirm.composable';
import LinkAnnotationModal from './link-annotation/LinkAnnotationModal.vue';
import {
  LinkAnnotaitonCloseEvent,
  LinkAnnotationProps,
  LinkAnnotationShow,
} from './link-annotation/link-annotation.properties';

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
    LinkAnnotaitonCloseEvent
  >;
  confirm: ModalTypeConfig<ConfirmProps, ConfirmProps, ConfirmCloseEvent>;
};

export type AnnotationModalAction = keyof AnnotationModalActionMap;

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

export type AnnotationModalDefaults = AnnotationModalActionMap;
