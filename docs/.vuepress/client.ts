import { defineClientConfig } from 'vuepress/client';

import './styles/app.css';
import axios from 'axios';
import { configureApi } from '@ghentcdh/annotation-vue';
import { CroutonPlugin } from '@ghentcdh/crouton-vue';

configureApi(axios);

export default defineClientConfig({
  enhance({ app }) {
    app.use(CroutonPlugin(axios));
  },
});
