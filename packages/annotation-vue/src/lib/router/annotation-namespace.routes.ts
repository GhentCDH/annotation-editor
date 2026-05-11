import { computed, defineComponent, h, type PropType } from 'vue';
import { type RouteRecordRaw } from 'vue-router';
import {
  type AnnotationDefConfig,
  AnnotationStyleContextBuilder,
  AnnotationStyleType,
} from '@ghentcdh/annotation-core';
import { type ContextBuilder } from '@ghentcdh/w3c-utils';
import { type AnnotationDefinitionService } from '../service/annotation-definition.service';

export type AnnotationNamespaceRoutePaths = {
  all: string;
  allJsonLd: string;
  byId: (id: string) => string;
  jsonLdById: (id: string) => string;
  schemasById: (id: string) => string;
  typeJsonLd: (type: string) => string;
};

export const createAnnotationNamespacePaths = (
  basePath = '/ns',
): AnnotationNamespaceRoutePaths => {
  const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return {
    all: base,
    allJsonLd: `${base}/anno.jsonld`,
    byId: (id) => `${base}/${id}`,
    jsonLdById: (id) => `${base}/${id}.jsonld`,
    schemasById: (id) => `${base}/${id}/schemas`,
    typeJsonLd: (type) => `${base}/${type}/anno.jsonld`,
  };
};

const JsonView = defineComponent({
  name: 'JsonView',
  props: {
    data: { type: [Object, Array, String, Number] as PropType<unknown>, default: null },
    title: { type: String, required: false, default: '' },
  },
  setup(props) {
    const json = computed(() => JSON.stringify(props.data, null, 2));
    const copied = computed(() => false);

    const copy = () => {
      navigator.clipboard.writeText(json.value);
    };

    const download = () => {
      const blob = new Blob([json.value], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${props.title || 'data'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return () =>
      h(
        'div',
        {
          style: {
            fontFamily: 'monospace',
            fontSize: '13px',
            padding: '16px',
            maxWidth: '100%',
            boxSizing: 'border-box',
          },
        },
        [
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                flexWrap: 'wrap',
              },
            },
            [
              props.title
                ? h(
                    'span',
                    {
                      style: {
                        fontWeight: 'bold',
                        fontSize: '14px',
                        marginRight: 'auto',
                      },
                    },
                    props.title,
                  )
                : null,
              h(
                'button',
                {
                  onClick: copy,
                  style: {
                    cursor: 'pointer',
                    padding: '4px 10px',
                    fontSize: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: '#f5f5f5',
                  },
                },
                copied.value ? 'Copied' : 'Copy',
              ),
              h(
                'button',
                {
                  onClick: download,
                  style: {
                    cursor: 'pointer',
                    padding: '4px 10px',
                    fontSize: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: '#f5f5f5',
                  },
                },
                'Download',
              ),
            ],
          ),
          h(
            'pre',
            {
              style: {
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: '#fafafa',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                padding: '12px',
                overflow: 'auto',
              },
            },
            json.value,
          ),
        ],
      );
  },
});

export const NAMESPACE_ROUTE_META = { namespace: true, layout: 'blank' } as const;

export const createAnnotationNamespaceRoutes = (
  basePath: string,
  service: AnnotationDefinitionService,
  config?: AnnotationDefConfig,
): RouteRecordRaw[] => {
  const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const meta = { ...NAMESPACE_ROUTE_META };

  return [
    {
      path: `${base}/anno.jsonld`,
      name: 'annotation-ns-all-jsonld',
      component: JsonView,
      meta,
      props: () => ({
        title: 'All JSON-LD contexts',
        data: service
          .getAllContextBuilders()
          .map((b) => (b as ContextBuilder).toJsonLdContext()),
      }),
    },
    {
      path: `${base}/:id.jsonld`,
      name: 'annotation-ns-jsonld',
      component: JsonView,
      meta,
      props: (route) => {
        const id = route.params['id'] as string;
        if (id === AnnotationStyleType && config) {
          return {
            title: `${id}.jsonld`,
            data: AnnotationStyleContextBuilder(config).toJsonLdContext(),
          };
        }
        const def = service.findById(id);
        return { title: `${id}.jsonld`, data: def?.json_ld ?? null };
      },
    },
    {
      path: `${base}/:type/anno.jsonld`,
      name: 'annotation-ns-type-jsonld',
      component: JsonView,
      meta,
      props: (route) => {
        const type = route.params['type'] as string;
        const context = service.getContextBuilder(type) as
          | ContextBuilder
          | undefined;
        if (!context) return { title: type, data: null };
        return {
          title: `${type}/anno.jsonld`,
          data: {
            jsonLd: context.toJsonLdContext(),
            forms: context.toJsonSchema(),
          },
        };
      },
    },
    {
      path: `${base}/:id/schemas`,
      name: 'annotation-ns-schemas',
      component: JsonView,
      meta,
      props: (route) => {
        const id = route.params['id'] as string;
        const def = service.findById(id);
        if (!def) return { title: id, data: null };
        return {
          title: `${id}/schemas`,
          data: {
            id: def.id,
            name: def.name,
            json_schema: def.json_schema,
            ui_schema: def.ui_schema,
            metadata_schema: def.metadata_schema,
            columns: def.columns,
            isRoot: def.isRoot,
            allowedChildren: def.allowedChildren,
            allowedLinks: def.allowedLinks,
            type: def.type,
            icon: def.icon,
            target: def.target,
          },
        };
      },
    },
    {
      path: `${base}/:id`,
      name: 'annotation-ns-by-id',
      component: JsonView,
      meta,
      props: (route) => {
        const id = route.params['id'] as string;
        return {
          title: id,
          data: service.findById(id) ?? null,
        };
      },
    },
    {
      path: base,
      name: 'annotation-ns-all',
      component: JsonView,
      meta,
      props: () => ({ title: 'All definitions', data: service.findAll() }),
    },
  ];
};