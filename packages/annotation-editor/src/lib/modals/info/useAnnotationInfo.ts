import {
  AnnotationModal,
  UseAnnotationModal,
} from '../AnnotationModal.definition';
import {
  AnnotationInfoCardProp,
  AnnotationInfoCardEvent,
  AnnotationInfoCardShow,
} from './AnnotationInfoCard.properties';
import { getMousePosition } from '../../utils/mouse-events';

export class AnnotationInfoCard extends AnnotationModal<
  AnnotationInfoCardProp,
  AnnotationInfoCardShow,
  AnnotationInfoCardEvent
> {
  override show(data: AnnotationInfoCardShow) {
    const position = data.position ?? getMousePosition(data.mouseEvent!);
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
