import { type UIAnnotationDefinition } from '@ghentcdh/annotation-ui';

import { type AnnotationDefinitionsState } from '../../definitions/useAnnotationDefinitions';
import {
  buildRows,
  collectIssues,
  errorCount,
  filterRows,
  worstState,
} from '../status.utils';

const def = (id: string, title?: string) =>
  ({ id, name: id, title }) as unknown as UIAnnotationDefinition;

const makeState = (
  partial: Partial<AnnotationDefinitionsState> = {},
): AnnotationDefinitionsState =>
  ({
    definitions: [],
    loadErrors: [],
    rawJsonMap: {},
    loading: false,
    error: null,
    ...partial,
  }) as unknown as AnnotationDefinitionsState;

const loadError = { id: 'broken', name: 'Broken', error: 'bad json', raw: {} };

describe('status.utils', () => {
  it.each`
    name               | state                                             | errors | worst        | issues
    ${'no state'}      | ${null}                                           | ${0}   | ${'warning'} | ${0}
    ${'all ok'}        | ${makeState({ definitions: [def('a')] })}         | ${0}   | ${'ok'}      | ${0}
    ${'loading'}       | ${makeState({ loading: true })}                   | ${0}   | ${'warning'} | ${0}
    ${'global error'}  | ${makeState({ error: new Error('boom') })}        | ${1}   | ${'error'}   | ${1}
    ${'load errors'}   | ${makeState({ loadErrors: [loadError] })}         | ${1}   | ${'error'}   | ${1}
  `('$name → $errors errors, $worst, $issues issues', ({ state, errors, worst, issues }) => {
    expect(errorCount(state)).toBe(errors);
    expect(worstState(state)).toBe(worst);
    expect(collectIssues(state)).toHaveLength(issues);
  });

  it('puts load errors first with anchors matching their issues', () => {
    const state = makeState({
      definitions: [def('a', 'Alpha')],
      loadErrors: [loadError, { error: 'no id', raw: null }],
      rawJsonMap: { a: { raw: true } },
    });

    const rows = buildRows(state);
    const issues = collectIssues(state);

    expect(rows.map((r) => [r.key, r.state])).toEqual([
      ['broken', 'error'],
      ['error-1', 'error'],
      ['a', 'ok'],
    ]);
    expect(rows[2].raw).toEqual({ raw: true });
    expect(issues.map((i) => i.anchor)).toEqual(
      rows.filter((r) => r.state === 'error').map((r) => r.anchor),
    );
  });

  it.each`
    filter      | search     | keys
    ${'all'}    | ${''}      | ${['broken', 'a', 'b']}
    ${'errors'} | ${''}      | ${['broken']}
    ${'all'}    | ${'alp'}   | ${['a']}
    ${'all'}    | ${'B'}     | ${['broken', 'b']}
    ${'errors'} | ${'alpha'} | ${[]}
  `('filter=$filter search=$search → $keys', ({ filter, search, keys }) => {
    const rows = buildRows(
      makeState({
        definitions: [def('a', 'Alpha'), def('b', 'Beta')],
        loadErrors: [loadError],
      }),
    );
    expect(filterRows(rows, filter, search).map((r) => r.key)).toEqual(keys);
  });
});
