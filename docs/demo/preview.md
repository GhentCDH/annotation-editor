# Preview

<div>
 <AnnotationPreview
    :configuration="config"
    :sources="sourcesPlainTxt"
    :annotations="annotations"
    :layout="layout"
    :annotation-definitions="definitions"
  />
</div>




<script setup>
//
import {layout, sourcesPlainTxt, annotations, definitions, config} from '@demo/demo-text';
import { AnnotationPreview } from '@ghentcdh/annotation-preview';

</script>
