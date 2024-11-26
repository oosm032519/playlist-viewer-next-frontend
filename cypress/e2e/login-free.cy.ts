// cypress/e2e/login-free.cy.ts

describe('ログイン不要の機能テスト', () => {
    const mockPlaylistData: { playlists: any[], total: number } = {
        playlists: [
            {
                id: '1',
                name: 'Mock Playlist 1',
                images: [{url: 'https://example.com/image1.jpg'}],
                tracks: {total: 10},
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/playlist/1'}},
                owner: {displayName: 'Mock Owner 1'}
            },
            {
                id: '2',
                name: 'Mock Playlist 2',
                images: [{url: 'https://example.com/image2.jpg'}],
                tracks: {total: 20},
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/playlist/2'}},
                owner: {displayName: 'Mock Owner 2'}
            }
        ],
        total: 2
    };
    
    const mockPlaylistDetails: any = {
        seedArtists: [],
        tracks: {
            items: [
                {
                    track: {
                        album: {
                            name: 'Mock Album 1',
                            images: [{url: 'https://example.com/album1.jpg'}],
                            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/1'}}
                        },
                        artists: [{
                            name: 'Mock Artist 1',
                            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/artist/1'}}
                        }],
                        durationMs: 180000,
                        externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/1'}},
                        id: 'track1',
                        name: 'Mock Track 1',
                        previewUrl: 'https://example.com/preview1.mp3',
                        audioFeatures: {
                            acousticness: 0.5,
                            danceability: 0.7,
                            energy: 0.8,
                            instrumentalness: 0.2,
                            liveness: 0.3,
                            loudness: -6,
                            mode: 'major',
                            speechiness: 0.1,
                            tempo: 120,
                            timeSignature: 4,
                            valence: 0.6,
                            key: 2
                        }
                    },
                    audioFeatures: {
                        acousticness: 0.5,
                        danceability: 0.7,
                        energy: 0.8,
                        instrumentalness: 0.2,
                        liveness: 0.3,
                        loudness: -6,
                        mode: 'major',
                        speechiness: 0.1,
                        tempo: 120,
                        timeSignature: 4,
                        valence: 0.6,
                        key: 2,
                        durationMs: 180000,
                        id: 'audioFeatures1'
                    }
                }
            ]
        },
        genreCounts: {'pop': 5, 'rock': 3},
        playlistName: 'Mock Playlist Details',
        ownerId: 'owner1',
        totalDuration: 360000,
        averageAudioFeatures: {
            acousticness: 0.6,
            danceability: 0.8,
            energy: 0.7,
            instrumentalness: 0.3,
            liveness: 0.4,
            speechiness: 0.2,
            valence: 0.5,
            tempo: 110
        },
        ownerName: 'Mock Owner',
        maxAudioFeatures: {
            acousticness: 1,
            danceability: 1,
            energy: 1,
            instrumentalness: 1,
            liveness: 1,
            speechiness: 1,
            valence: 1,
            tempo: 200
        },
        minAudioFeatures: {
            acousticness: 0,
            danceability: 0,
            energy: 0,
            instrumentalness: 0,
            liveness: 0,
            speechiness: 0,
            valence: 0,
            tempo: 60
        }
    };
    
    it('プレイリスト検索フォームの表示', () => {
        cy.visit('/');
        cy.contains('プレイリスト名で検索').click();
        cy.get('input[placeholder="Enter playlist name"]').should('be.visible');
        cy.get('button:contains("Search")').should('be.visible');
    });
    
    it('プレイリストIDフォームの表示', () => {
        cy.visit('/');
        cy.contains('URLで検索').click();
        cy.get('input[placeholder="Enter playlist URL"]').should('be.visible');
        cy.get('button:contains("Submit")').should('be.visible');
        cy.get('input[placeholder="Enter playlist URL"]').type('https://open.spotify.com/playlist/7FGzKtW9KMj79l0J8YjL9u');
        cy.get('button:contains("Submit")').click();
    });
    
    it('プレイリスト検索', () => {
        cy.intercept('/api/playlists/search*', mockPlaylistData).as('searchPlaylists');
        cy.visit('/');
        cy.contains('プレイリスト名で検索').click();
        cy.get('input[placeholder="Enter playlist name"]').type('test');
        cy.get('button:contains("Search")').click();
        cy.wait('@searchPlaylists');
        cy.get('table').should('exist');
        cy.get('table tbody tr').should('have.length', mockPlaylistData.playlists.length);
    });
    
    it('プレイリスト詳細の表示', () => {
        cy.intercept('/api/playlists/1/details', mockPlaylistDetails).as('playlistDetails');
        cy.intercept('/api/playlists/recommendations', {body: []}).as('recommendations');
        cy.visit('/');
        cy.intercept('/api/playlists/search*', mockPlaylistData).as('searchPlaylists');
        cy.contains('プレイリスト名で検索').click();
        cy.get('input[placeholder="Enter playlist name"]').type('test');
        cy.get('button:contains("Search")').click();
        cy.wait('@searchPlaylists');
        cy.get('table tbody tr').first().click();
        cy.wait('@playlistDetails');
        cy.wait('@recommendations');
        cy.contains(mockPlaylistDetails.playlistName).should('be.visible');
        cy.get('table').should('exist');
        cy.contains('CSVをエクスポート').click();
        cy.contains('現在のソート順で新しいプレイリストを作成').click();
    });
    
    it('フッターの表示とモーダル', () => {
        cy.visit('/');
        cy.get('footer').should('be.visible');
        cy.contains('利用規約').click();
        cy.get('[role="dialog"]').should('be.visible');
        cy.get('[role="dialog"] button:has(svg)').click();
        cy.contains('プライバシーポリシー').click();
        cy.get('[role="dialog"]').should('be.visible');
        cy.get('[role="dialog"] button:has(svg)').click();
    });
    
    it('プレイリストIDフォームの無効なURL', () => {
        cy.visit('/');
        cy.contains('URLで検索').click();
        cy.get('input[placeholder="Enter playlist URL"]').type('invalid url');
        cy.get('button:contains("Submit")').click();
        cy.contains('無効なプレイリストURLです').should('be.visible');
    });
});
