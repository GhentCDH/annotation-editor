import { type EmitFn, ref } from 'vue';
import { NotificationService } from '@ghentcdh/ui';
import { type FormMessageProps, resourceApi } from '@ghentcdh/crouton-vue';
import {
  type EditorAnnotation,
  editorAnnotationSchema,
  Selector,
} from '@ghentcdh/annotation-ui';
import {
  type AnnotationEditEmits,
  type AnnotationEditModal,
} from './AnnotationEditModal.properties';
import { useEditorState } from '../../composables/useEditorState';

export const UseAnnotationEdit = (
  props: AnnotationEditModal,
  emits: EmitFn<typeof AnnotationEditEmits>,
) => {
  const { editorState } = useEditorState();
  console.log(props.annotation);

  const resource = resourceApi(props.annotation.definition, {});

  let selector: Selector | null = props.annotation?.getSelector?.(
    props.source.uri,
  );
  let hasChanged = false;

  console.log(selector);
  let metadata = ref(props.annotation.metadata ?? {});
  const message = ref<FormMessageProps>({ status: 'idle' });

  const annotationSelector = ref<EditorAnnotation | null>(null);

  const cancel = () => {
    // utils.cancel();
    emits('close', null);
  };

  const saveToBackend = async () => {
    const originalAnnotation = props.annotation.id
      ? props.annotation
      : editorAnnotationSchema.parse({
          id: 'NEW_ANNOTATION',
          metadata: {},
          definition: props.annotation.definition,
          label: '',
          links: [],
          selectors: [selector],
        });
    const operations = originalAnnotation.definition.operations ?? {};
    // check if resource can handle backend requests
    if (!originalAnnotation && !operations.create) return;
    if (originalAnnotation && !operations.update) return;

    const cloned = originalAnnotation.clone({
      metadata: metadata.value,
    });
    cloned.setSelector(selector);

    const dataToSave = editorState.annotationTransformer.format(
      cloned,
      !originalAnnotation.id,
    );
    if (props.annotation.id) {
      return resource.save(originalAnnotation.id, dataToSave).then(() => {
        message.value = { status: 'saved' };
        NotificationService.success('Annotation saved successfully.');
      });
    } else {
      return resource.create(dataToSave).then(() => {
        message.value = { status: 'saved' };
        NotificationService.success('Annotation saved successfully.');
      });
    }
  };

  const save = () => {
    if (!selector || !metadata) {
      message.value = { message: 'Select annotation first', status: 'error' };
      return;
    }

    message.value = { status: 'saving' };

    saveToBackend()
      .then((result) => {
        emits('close', {
          result,
        });
      })
      .catch((err) => {
        console.error(err);
        message.value = { status: 'error' };
      });
  };

  const onChangeValue = ({
    annotation: _annotation,
    metadata: _metadata,
  }: {
    annotation?: EditorAnnotation | null;
    metadata?: any;
  }) => {
    // if (selectors)
    //   editedAnnotation.value = utils.createAnnotation(
    //     props.annotation,
    //     annotationDef,
    //     metadata,
    //     selectors,
    //   );
    hasChanged = true;
    metadata.value = editorState.annotationTransformer.transformMetadata(
      _metadata,
      selector,
    );
    return metadata.value;
  };

  const updateSelector = (updatedSelector: Selector) => {
    console.log('updatedSelector', updatedSelector);
    selector = updatedSelector;
    hasChanged = true;

    selector = updatedSelector;
    metadata.value = editorState.annotationTransformer.transformMetadata(
      metadata.value,
      updatedSelector,
    );
  };

  return {
    save,
    cancel,
    metadata,
    annotationSelector,
    onChangeValue,
    message,
    updateSelector,
  };
};
