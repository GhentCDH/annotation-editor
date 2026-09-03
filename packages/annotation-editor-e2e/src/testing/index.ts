/**
 * Re-export the @ghentcdh/ui testing harnesses from the published package.
 *
 * The @ghentcdh/ui package exposes these via its `./testing` subpath export.
 */
export { Harness, byRole } from '@ghentcdh/ui/testing';
export { CollapseHarness } from '@ghentcdh/ui/testing';
export { ModalHarness } from '@ghentcdh/ui/testing';
