import { getMousePosition } from '../../utils/mouse-events';
import {
  AnnotationModal,
  type UseAnnotationModal,
} from '../AnnotationModal.definition';
import {
  type AnnotationInfoCardEvent,
  type AnnotationInfoCardProp,
  type AnnotationInfoCardShow,
} from './AnnotationInfoCard.properties';

class AnnotationInfoCard extends AnnotationModal<
  AnnotationInfoCardProp,
  AnnotationInfoCardShow,
  AnnotationInfoCardEvent
> {
  override async show(data: AnnotationInfoCardShow) {
    let position = data.position;

    if (!position) {
      const event = data.mouseEvent;
      if (!event || !data.containerRef) {
        console.warn('No position or mouse event provided');
        return undefined;
      }
      position = getMousePosition(data.containerRef, event);
    }
    return super._show({
      annotation: data.annotation,
      source: data.source,
      position,
    });
  }

  override close(event: AnnotationInfoCardEvent) {
    return super.close(event);
  }
}

export const useAnnotationInfo: UseAnnotationModal<
  AnnotationInfoCardProp,
  AnnotationInfoCardShow,
  AnnotationInfoCardEvent
> = () => {
  return new AnnotationInfoCard();
};
