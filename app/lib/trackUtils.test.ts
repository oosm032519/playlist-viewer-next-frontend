// trackUtils.test.ts

import {addTrackToPlaylist, removeTrackFromPlaylist} from './trackUtils';
import fetchMock from 'jest-fetch-mock';
import {expect} from '@jest/globals';

fetchMock.enableMocks();

describe('trackUtils', () => {
    // cn関数のテストは変更なし
    
    // addTrackToPlaylistのテスト
    describe('addTrackToPlaylist function', () => {
        beforeEach(() => {
            fetchMock.resetMocks();
            console.log = jest.fn();
            console.error = jest.fn();
        });
        
        // 正常系のテストは変更なし
        
        it('APIエラーの場合、falseを返す', async () => {
            fetchMock.mockResponseOnce('Error message', {status: 400});
            
            const result = await addTrackToPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('曲の追加に失敗しました'));
        });
        
        it('ネットワークエラーの場合、falseを返す', async () => {
            fetchMock.mockRejectOnce(new Error('Network error'));
            
            const result = await addTrackToPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(
                '[addTrackToPlaylist] 予期せぬエラーが発生しました:',
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
        });
        
        // 正常系のテストは変更なし
        
        it('APIエラーの場合、falseを返す', async () => {
            fetchMock.mockResponseOnce('Error message', {status: 400});
            
            const result = await removeTrackFromPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('曲の削除に失敗しました'));
        });
        
        it('ネットワークエラーの場合、falseを返す', async () => {
            fetchMock.mockRejectOnce(new Error('Network error'));
            
            const result = await removeTrackFromPlaylist('playlist123', 'track456');
            
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(
                '[removeTrackFromPlaylist] 予期せぬエラーが発生しました:',
                expect.any(Error)
            );
        });
    });
});
