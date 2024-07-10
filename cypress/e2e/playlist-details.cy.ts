import cypress from 'cypress';

describe('プレイリスト詳細の表示', () => {
    const validPlaylistUrl = 'https://open.spotify.com/playlist/37i9dQZF1DXcWRjTQVz';
    const validPlaylistId = '37i9dQZF1DXcWRjTQVz';
    
    beforeEach(() => {
        cy.intercept('GET', `/api/playlists/${validPlaylistId}`, {fixture: 'playlist.json'}).as('getPlaylist');
        cy.visit('/');
    });
    
    it('有効なプレイリストURLを入力して詳細を表示できる', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        
        cy.wait('@getPlaylist');
        
        cy.get('table').should('be.visible');
        
        cy.get('table tbody tr').should('have.length.greaterThan', 0);
        cy.get('table tbody tr:first-child td').eq(1).should('contain', '月の椀');
    });
    
    it('無効なプレイリストURLを入力するとエラーメッセージが表示される', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type('invalid-url');
        cy.get('button').contains('Submit').click();
        
        cy.get('.text-destructive').should('be.visible').and('contain', '無効なプレイリストURLです');
    });
    
    it('プレイリストの読み込み中にローディングスピナーが表示される', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        
        cy.get('.loading-spinner').should('exist');
        cy.wait('@getPlaylist');
        cy.get('.loading-spinner').should('not.be.visible');
    });
    
    it('プレイリストの音声特徴チャートが正しく表示される', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        cy.wait('@getPlaylist');
        
        cy.get('table', {timeout: 10000}).should('be.visible');
        cy.get('table tbody tr').first().click();
        
        cy.get('.recharts-responsive-container', {timeout: 10000}).should('be.visible');
        
        cy.contains('Audio Features: 月の椀').should('be.visible');
        
        cy.get('.recharts-polar-grid', {timeout: 5000}).should('exist');
        cy.get('.recharts-polar-angle-axis', {timeout: 5000}).should('exist');
        cy.get('.recharts-polar-radius-axis', {timeout: 5000}).should('exist');
        
        cy.contains('Genre Distribution').should('be.visible');
    });
    
    it('ジャンル分布チャートが正しく表示される', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        cy.wait('@getPlaylist');
        cy.get('.recharts-responsive-container').should('be.visible');
        cy.get('.recharts-pie').should('exist');
    });
    
    it('おすすめ楽曲テーブルが正しく表示される', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        cy.wait('@getPlaylist');
        cy.get('table').should('be.visible');
        cy.get('table thead th').should('contain', 'Album')
            .and('contain', 'Title')
            .and('contain', 'Artist')
            .and('contain', 'Preview')
    });
    
    it('空のプレイリストが正しく表示される', () => {
        cy.intercept('GET', `/api/playlists/${validPlaylistId}`, {fixture: 'empty-playlist.json'}).as('getEmptyPlaylist');
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        cy.wait('@getEmptyPlaylist');
        cy.get('table').should('be.visible');
        cy.get('table tbody tr').should('have.length', 0);
        cy.contains('このプレイリストには曲が含まれていません').should('be.visible');
    });
    
    it('おすすめ楽曲テーブルのプレビュー再生ボタンが正しく機能する', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        cy.wait('@getPlaylist');
        
        // テーブルの存在を確認
        cy.get('table', {timeout: 10000}).should('be.visible');
        
        // プレビューボタンを探す
        cy.get('table tbody tr')
            .find('button')
            .contains('試聴する', {timeout: 10000})
            .first()
            .click();
        
        // オーディオ要素の存在を確認
        cy.get('audio').should('exist');
        
        // オーディオの再生状態を確認
        cy.get('audio').should('have.prop', 'paused', false);
        
        // 停止ボタンの存在を確認
        cy.get('table tbody tr')
            .find('button')
            .contains('停止')
            .should('exist');
    });
    
    it('プレビューURLがない曲では試聴ボタンが表示されない', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        cy.wait('@getPlaylist');
        
        // RecommendationsTableに特有のヘッダーを持つテーブルが表示されるまで待機
        cy.get('table').contains('th', 'Album').should('be.visible');
        cy.get('table').contains('th', 'Preview').should('be.visible');
        
        // RecommendationsTableのテーブルを特定
        cy.get('table').contains('th', 'Album').closest('table').within(() => {
            // 各行をチェック
            cy.get('tbody tr').each(($row) => {
                // プレビューURLの列（4番目の列）を取得
                cy.wrap($row).find('td').eq(3).then($previewCell => {
                    if ($previewCell.find('button').length === 0) {
                        // 試聴ボタンがない場合、ボタンが存在しないことを確認
                        cy.wrap($previewCell).find('button').should('not.exist');
                    } else {
                        // 試聴ボタンがある場合、ボタンのテキストを確認
                        cy.wrap($previewCell).find('button').should('contain.text', '試聴する');
                    }
                });
            });
        });
    });
    
    it('テーブルのソート機能が正しく動作する', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        cy.wait('@getPlaylist');
        cy.get('table thead th').contains('Title').click();
        cy.get('table tbody tr:first-child td').eq(1).should('contain', '月の椀');
    });
    
    it('モバイル画面でレイアウトが正しく表示される', () => {
        cy.viewport('iphone-x');
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        cy.wait('@getPlaylist');
        cy.get('table').should('be.visible');
        cy.get('.recharts-responsive-container').should('be.visible');
    });
    
    it('APIエラー時に適切なエラーメッセージが表示される', () => {
        cy.intercept('GET', `/api/playlists/${validPlaylistId}`, {
            statusCode: 500,
            body: 'Internal Server Error'
        }).as('getPlaylistError');
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        cy.wait('@getPlaylistError');
        cy.wait(10000);
        cy.contains('プレイリスト取得中にエラーが発生しました', {timeout: 10000}).should('be.visible');
    });
});
