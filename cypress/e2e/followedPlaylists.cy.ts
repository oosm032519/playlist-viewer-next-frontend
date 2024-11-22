// followedPlaylists.cy.ts

import {Playlist} from "@/app/types/playlist";

describe('Followed Playlists', () => {
    const playlists: Playlist[] = [
        {
            id: '1',
            name: 'プレイリスト1',
            images: [{url: 'https://example.com/image1.jpg', width: 300, height: 300}],
            tracks: {items: []},
            totalDuration: 0,
            ownerName: '',
            minAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0
            },
            maxAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0
            },
            averageAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0
            },
            seedArtists: [],
            ownerId: '',
            genreCounts: {},
            externalUrls: {
                externalUrls: {
                    spotify: 'https://example.com/playlist1'
                }
            }
        },
        {
            id: '2',
            name: 'プレイリスト2',
            images: [{url: 'https://example.com/image2.jpg', width: 300, height: 300}],
            tracks: {items: []},
            totalDuration: 0,
            ownerName: '',
            minAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0
            },
            maxAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0
            },
            averageAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0
            },
            seedArtists: [],
            ownerId: '',
            genreCounts: {},
            externalUrls: {
                externalUrls: {
                    spotify: 'https://example.com/playlist2'
                }
            }
        },
    ];
    
    beforeEach(() => {
        cy.intercept('GET', '/api/session/check', {
            status: 'success',
            userId: 'test-user',
        }).as('checkSession');
    });
    
    it('ログイン後、フォロー中のプレイリストが表示されること', () => {
        cy.intercept('GET', '/api/playlists/followed', {
            statusCode: 200,
            body: playlists,
        }).as('followedPlaylists');
        
        cy.visit('/');
        cy.wait('@checkSession');
        cy.wait('@followedPlaylists');
        cy.get('h2').contains('フォロー中のプレイリスト').should('be.visible');
        cy.get('ul li').should('have.length', playlists.length);
        playlists.forEach((playlist) => {
            cy.get('li').contains(playlist.name).should('be.visible');
        });
    });
    
    it('ログイン後、フォロー中のプレイリストがない場合、メッセージが表示されること', () => {
        cy.intercept('GET', '/api/playlists/followed', {
            statusCode: 200,
            body: [],
        }).as('followedPlaylists');
        
        cy.visit('/');
        cy.wait('@checkSession');
        cy.wait('@followedPlaylists');
        cy.get('h2').contains('フォロー中のプレイリスト').should('be.visible');
        cy.get('div').contains('フォロー中のプレイリストはありません。').should('be.visible');
    });
    
    it('フォロー中のプレイリスト取得中にエラーが発生した場合、エラーメッセージが表示されること', () => {
        cy.intercept('GET', '/api/playlists/followed', {
            statusCode: 500,
            body: {error: 'Internal Server Error'},
        }).as('followedPlaylists');
        
        cy.visit('/');
        cy.wait('@checkSession');
        cy.wait('@followedPlaylists');
        
        // "API request failed with status" というテキストが表示されるのを待つ
        cy.contains('API request failed with status', {timeout: 10000}).should('be.visible');
    });
});
