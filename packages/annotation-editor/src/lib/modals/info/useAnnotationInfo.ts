import {
  type AnnotationInfoCardProp,
  type AnnotationInfoCardEvent,
  type AnnotationInfoCardShow,
} from './AnnotationInfoCard.properties';
import {
  AnnotationModal,
  type UseAnnotationModal,
} from '../AnnotationModal.definition';
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
