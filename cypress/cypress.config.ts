// cypress/cypress.config.ts
import {defineConfig} from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        // その他のe2eテストの設定
    },
    // その他のCypressの設定
});
