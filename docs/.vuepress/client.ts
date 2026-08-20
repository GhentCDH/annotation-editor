import { defineClientConfig } from 'vuepress/client';

import './styles/app.css';
import { configureApi } from '../../packages/annotation-vue/src/lib/service/useApi';
import axios from 'axios';

configureApi(axios);
export default defineClientConfig({});
