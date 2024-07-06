// app/api/playlists/[id]/route.test.ts

import {GET} from './route';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, init) => ({
            status: init?.status || 200,
            json: async () => data,
        })),
    },
}));

const mock = new MockAdapter(axios);

const mockPlaylistData = {
    id: '1',
    name: 'テストプレイリスト',
    songs: [
        {id: '1', title: 'テスト曲1'},
        {id: '2', title: 'テスト曲2'},
    ],
};

describe('GET /api/playlists/[id]', () => {
    beforeEach(() => {
        mock.reset();
    });
    
    it('正常にプレイリストデータを取得できる', async () => {
        const playlistId = '1';
        mock.onGet(`http://localhost:8080/api/playlists/${playlistId}`).reply(200, mockPlaylistData);
        
        const response = await GET({} as Request, {params: {id: playlistId}});
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockPlaylistData);
    });
    
    it('プレイリストが見つからない場合は500エラーを返す', async () => {
        const playlistId = 'nonexistent';
        mock.onGet(`http://localhost:8080/api/playlists/${playlistId}`).reply(404, {error: 'プレイリストが見つかりません'});
        
        const response = await GET({} as Request, {params: {id: playlistId}});
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({error: 'プレイリストの取得に失敗しました'});
    });
    
    it('サーバーエラーの場合は500エラーを返す', async () => {
        const playlistId = '1';
        mock.onGet(`http://localhost:8080/api/playlists/${playlistId}`).reply(500, {error: 'サーバーエラー'});
        
        const response = await GET({} as Request, {params: {id: playlistId}});
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({error: 'プレイリストの取得に失敗しました'});
    });
});
