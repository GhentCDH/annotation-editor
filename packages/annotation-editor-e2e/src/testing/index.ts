/**
 * Re-export the @ghentcdh/ui testing harnesses via a relative path.
 *
 * The installed @ghentcdh/ui package does not expose a ./testing subpath in
 * its exports map, so we import directly from the ghentcdh monorepo source.
 */
export {
  Harness,
  byRole,
} from '../../../../../ghentcdh/libs/ui/src/testing/Harness';
export { CollapseHarness } from '../../../../../ghentcdh/libs/ui/src/testing/CollapseHarness';
export { ModalHarness } from '../../../../../ghentcdh/libs/ui/src/testing/ModalHarness';
