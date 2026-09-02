export declare const createId: (proposedId: string) => string;
export declare const removeId: (id: string) => boolean;
export declare const clearAllIds: () => void;
/**
 * Mutable registry of the ID generation functions used internally by JSON Forms.
 *
 * Adopters can override one or more of these methods to provide a custom HTML
 * ID strategy (e.g. for performance reasons or to integrate with an existing
 * scheme). Reassigning the methods only affects callers that go through this
 * object; the standalone `createId`, `removeId` and `clearAllIds` exports
 * always invoke the default implementations.
 *
 * @example
 * ```ts
 * import { Id } from '@jsonforms/core';
 *
 * let next = 0;
 * Id.createId = () => `jf-${next++}`;
 * Id.removeId = () => true;
 * Id.clearAllIds = () => {
 *   next = 0;
 * };
 * ```
 */
export declare const Id: {
    createId: (proposedId: string) => string;
    removeId: (id: string) => boolean;
    clearAllIds: () => void;
};
