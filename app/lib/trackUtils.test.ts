// trackUtils.test.ts

import {addTrackToPlaylist, removeTrackFromPlaylist} from '@/app/lib/trackUtils';
import fetchMock from 'jest-fetch-mock';
import {expect} from '@jest/globals';

fetchMock.enableMocks();

describe('trackUtils', () => {
    
    // addTrackToPlaylistのテスト
    describe('addTrackToPlaylist function', () => {
        beforeEach(() => {
            fetchMock.resetMocks();
            sessionStorage.clear();
        });
        
        it('正常系: 曲が追加された場合、trueを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockResponseOnce(JSON.stringify({success: true}));
            
            const result = await addTrackToPlaylist('playlist123', 'track456');
            
            expect(result).toBe(true);
        });
        
        it('APIエラーの場合、falseを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockResponseOnce('Error message', {status: 400});
            
            const result = await addTrackToPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
        });
        
        it('ネットワークエラーの場合、falseを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockRejectOnce(new Error('Network error'));
            
            const result = await addTrackToPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
        });
    });
    
    // removeTrackFromPlaylistのテスト
    describe('removeTrackFromPlaylist function', () => {
        beforeEach(() => {
            fetchMock.resetMocks();
            sessionStorage.clear();
        });
        
        it('正常系: 曲が削除された場合、trueを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockResponseOnce(JSON.stringify({success: true}));
            
            const result = await removeTrackFromPlaylist('playlist123', 'track456');
            
            expect(result).toBe(true);
        });
        
        it('APIエラーの場合、falseを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockResponseOnce('Error message', {status: 400});
            
            const result = await removeTrackFromPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
        });
        
        it('ネットワークエラーの場合、falseを返す', async () => {
            sessionStorage.setItem('JWT', 'dummy_jwt');
            fetchMock.mockRejectOnce(new Error('Network error'));
            
            const result = await removeTrackFromPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
        });
    });
});
