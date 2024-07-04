// playlist-viewer-next-frontend/cypress/e2e/playlistDetails.cy.ts

import cypress from 'cypress';

describe('プレイリスト詳細の表示', () => {
    const validPlaylistUrl = 'https://open.spotify.com/playlist/37i9dQZF1DXcWRjTQVzjmK?si=test';
    const validPlaylistId = '37i9dQZF1DXcWRjTQVzjmK';
    
    beforeEach(() => {
        cy.intercept('GET', `/api/playlists/${validPlaylistId}`, {fixture: 'playlist.json'}).as('getPlaylist');
        cy.visit('/');
    });
    
    it('有効なプレイリストURLを入力して詳細を表示できる', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        
        cy.wait('@getPlaylist');
        
        // プレイリスト詳細テーブルが表示されていることを確認
        cy.get('table').should('be.visible');
        
        // トラック情報が正しく表示されていることを確認
        cy.get('table tbody tr').should('have.length.greaterThan', 0);
        cy.get('table tbody tr:first-child td').eq(1).should('contain', 'Track Name 1');
    });
    
    it('無効なプレイリストURLを入力するとエラーメッセージが表示される', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type('invalid-url');
        cy.get('button').contains('Submit').click();
        
        // エラーメッセージが表示されていることを確認
        cy.get('.text-destructive').should('be.visible').and('contain', 'Invalid Playlist URL');
    });
    
    it('プレイリストの読み込み中にローディングスピナーが表示される', () => {
        cy.get('input[placeholder="Enter playlist URL"]').type(validPlaylistUrl);
        cy.get('button').contains('Submit').click();
        
        cy.get('.loading-spinner').should('exist');
        cy.wait('@getPlaylist');
        cy.get('.loading-spinner').should('not.be.visible');
    });
});
