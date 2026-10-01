export const ANNOTATION_STATUS = 'annotation-editor/status';

export const AnnotationStatusRoutes = [
  {
    path: 'status',
    name: ANNOTATION_STATUS,
    component: () => import('./AnnotationDefinitionsStatusView.vue'),
  },
];
