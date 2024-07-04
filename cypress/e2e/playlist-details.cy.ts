// cypress/e2e/playlist-details.cy.ts

import {Track} from "@/app/types/track";
import cypress from 'cypress';

describe('Playlist Details', () => {
    const playlistId = 'your_playlist_id_here'; // 実際のプレイリストIDに置き換えてください
    
    beforeEach(() => {
        cy.intercept('GET', `/api/playlists/${playlistId}`, {fixture: 'playlistDetails.json'}).as('getPlaylistDetails');
        cy.visit('/');
        cy.wait('@getPlaylistDetails');
    });
    
    it('プレイリスト詳細が表示されること', () => {
        cy.get('[data-testid="playlist-details"]').should('be.visible');
    });
    
    it('プレイリストのトラックリストが表示されること', () => {
        cy.get('[data-testid="playlist-details-table"]').should('be.visible');
        cy.get('[data-testid="playlist-details-table"] tbody tr').should('have.length.at.least', 1);
    });
    
    it('トラックをクリックすると音声特徴が表示されること', () => {
        cy.get('[data-testid="playlist-details-table"] tbody tr:first').click();
        cy.get('[data-testid="audio-features-chart"]').should('be.visible');
    });
    
    it('ジャンルチャートが表示されること', () => {
        cy.get('[data-testid="genre-chart"]').should('be.visible');
    });
    
    it('レコメンドトラックリストが表示されること', () => {
        cy.get('[data-testid="recommendations-table"]').should('be.visible');
        cy.get('[data-testid="recommendations-table"] tbody tr').should('have.length.at.least', 1);
    });
    
    it('レコメンドトラックの試聴ボタンをクリックすると再生/停止が切り替わること', () => {
        cy.get('[data-testid="recommendations-table"] tbody tr:first [data-testid="preview-button"]').click();
        cy.get('[data-testid="recommendations-table"] tbody tr:first [data-testid="preview-button"]').should('contain', '停止');
        cy.get('[data-testid="recommendations-table"] tbody tr:first [data-testid="preview-button"]').click();
        cy.get('[data-testid="recommendations-table"] tbody tr:first [data-testid="preview-button"]').should('contain', '試聴する');
    });
    
    it('ログイン済みのユーザーはレコメンドトラックを追加できること', () => {
        // モックログイン処理
        cy.intercept('GET', '/api/session', {fixture: 'loggedInSession.json'}).as('getSession');
        cy.reload();
        cy.wait('@getSession');
        
        // 所有者とユーザーIDを一致させる
        cy.intercept('GET', `/api/playlists/${playlistId}`, (req) => {
            req.reply((res: { body: { ownerId: string; }; }) => {
                res.body.ownerId = 'your_user_id_here'; // 実際のユーザーIDに置き換えてください
                return res;
            });
        }).as('getPlaylistDetailsWithModifiedOwner');
        cy.visit(`/${playlistId}`);
        cy.wait('@getPlaylistDetailsWithModifiedOwner');
        
        // トラック追加
        cy.get('[data-testid="recommendations-table"] tbody tr:first [data-testid="add-track-button"]').click();
        
        // APIリクエストの確認
        cy.wait('@addTrackToPlaylist').then((interception) => {
            expect(interception.request.method).to.equal('POST');
            expect(interception.request.url).to.include(`/api/playlists/${playlistId}/tracks`);
            // 追加するトラックIDの検証
            const trackId = interception.request.body.trackId;
            expect(trackId).to.be.a('string');
        });
    });
});
