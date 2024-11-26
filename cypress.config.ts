// cypress.config.ts
import {defineConfig} from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: false,
    },
    env: {
        CYPRESS_SHELL: 'cmd.exe'
    },
});
