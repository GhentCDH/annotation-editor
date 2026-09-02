import { JsonSchema, UISchemaElement } from '../models';
import { JsonFormsState } from '../store';
/**
 * Indicates whether the given `uischema` element shall be enabled or disabled.
 * Checks the global readonly flag (unless separateReadonlyFromDisabled is enabled), uischema rule, uischema options (including the config),
 * the schema and the enablement indicator of the parent.
 */
export declare const isInherentlyEnabled: (state: JsonFormsState, ownProps: any, uischema: UISchemaElement, schema: (JsonSchema & {
    readOnly?: boolean;
}) | undefined, rootData: any, config: any) => any;
/**
 * Indicates whether the given `uischema` element shall be readonly or writable.
 * Checks the global readonly flag, uischema rule, uischema options (including the config),
 * the schema and the readonly indicator of the parent.
 */
export declare const isInherentlyReadonly: (state: JsonFormsState, ownProps: any, uischema: UISchemaElement, schema: (JsonSchema & {
    readOnly?: boolean;
}) | undefined, rootData: any, config: any) => any;
