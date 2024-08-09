// trackUtils.test.ts

import {addTrackToPlaylist, removeTrackFromPlaylist} from './trackUtils';
import fetchMock from 'jest-fetch-mock';
import {expect} from '@jest/globals';

fetchMock.enableMocks();

describe('trackUtils', () => {
    
    // addTrackToPlaylistのテスト
    describe('addTrackToPlaylist function', () => {
        beforeEach(() => {
            fetchMock.resetMocks();
            console.log = jest.fn();
            console.error = jest.fn();
            sessionStorage.clear();
        });
        
        it('正常系: 曲が追加された場合、trueを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockResponseOnce(JSON.stringify({success: true}));
            
            const result = await addTrackToPlaylist('playlist123', 'track456');
            
            expect(result).toBe(true);
            expect(console.log).toHaveBeenCalledWith("[addTrackToPlaylist] 曲が正常に追加されました");
        });
        
        it('APIエラーの場合、falseを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockResponseOnce('Error message', {status: 400});
            
            const result = await addTrackToPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('曲の追加に失敗しました'));
        });
        
        it('ネットワークエラーの場合、falseを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockRejectOnce(new Error('Network error'));
            
            const result = await addTrackToPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('[addTrackToPlaylist] 予期せぬエラーが発生しました:'),
                expect.any(Error)
            );
        });
    });
    
    // removeTrackFromPlaylistのテスト
    describe('removeTrackFromPlaylist function', () => {
        beforeEach(() => {
            fetchMock.resetMocks();
            console.log = jest.fn();
            console.error = jest.fn();
            sessionStorage.clear();
        });
        
        it('正常系: 曲が削除された場合、trueを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockResponseOnce(JSON.stringify({success: true}));
            
            const result = await removeTrackFromPlaylist('playlist123', 'track456');
            
            expect(result).toBe(true);
            expect(console.log).toHaveBeenCalledWith("[removeTrackFromPlaylist] 曲が正常に削除されました");
        });
        
        it('APIエラーの場合、falseを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockResponseOnce('Error message', {status: 400});
            
            const result = await removeTrackFromPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('曲の削除に失敗しました'));
        });
        
        it('ネットワークエラーの場合、falseを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockRejectOnce(new Error('Network error'));
            
            const result = await removeTrackFromPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('[removeTrackFromPlaylist] 予期せぬエラーが発生しました:'),
                expect.any(Error)
            );
        });
    });
});
