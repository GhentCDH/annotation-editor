import {
  type LinkAnnotaitonCloseEvent,
  type LinkAnnotationProps,
  type LinkAnnotationShow,
} from './link-annotation.properties';
import { AnnotationModal } from '../AnnotationModal.definition';

export class LinkAnnotation extends AnnotationModal<
  LinkAnnotationProps,
  LinkAnnotationShow,
  LinkAnnotaitonCloseEvent
> {
  private type: string;

  startLink(type: string) {
    this.type = type;
  }

  override show(data: LinkAnnotationShow) {
    return super._show({ ...data, type: this.type });
  }
}

export const useLinkAnnotation = () => new LinkAnnotation();
