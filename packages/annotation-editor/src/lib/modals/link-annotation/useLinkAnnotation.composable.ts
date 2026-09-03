import { AnnotationModal } from '@ghentcdh/annotation-ui';
import {
  type LinkAnnotaitonCloseEvent,
  type LinkAnnotationProps,
  type LinkAnnotationShow,
} from './link-annotation.properties';

export class LinkAnnotation extends AnnotationModal<
  LinkAnnotationProps,
  LinkAnnotationShow,
  LinkAnnotaitonCloseEvent
> {
  private _type = '';

  startLink(type: string) {
    this._type = type;
  }

  override show(data: LinkAnnotationShow) {
    return super._show({ ...data, type: this._type });
  }
}

export const useLinkAnnotation = () => new LinkAnnotation();
