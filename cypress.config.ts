// cypress.config.ts
import {defineConfig} from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        // その他のe2eテストの設定
    },
    // shellの設定はe2eオブジェクトの中に移動します
    env: {
        // 環境変数としてシェルを指定
        CYPRESS_SHELL: 'cmd.exe'
    }
});
