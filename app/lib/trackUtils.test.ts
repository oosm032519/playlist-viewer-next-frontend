// trackUtils.test.ts

import {cn, addTrackToPlaylist, removeTrackFromPlaylist} from './trackUtils';
import fetchMock from 'jest-fetch-mock';
import {expect} from '@jest/globals';

// fetchのモックを有効化
fetchMock.enableMocks();

describe('cn function', () => {
    it('should merge class names correctly', () => {
        expect(cn('class1', 'class2')).toBe('class1 class2');
        expect(cn('class1', {class2: true, class3: false})).toBe('class1 class2');
        expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
    });
});

describe('addTrackToPlaylist function', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        console.log = jest.fn();
        console.error = jest.fn();
    });
    
    it('should add track successfully', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}), {status: 200});
        
        const result = await addTrackToPlaylist('playlist1', 'track1');
        
        expect(result).toBe(true);
        expect(console.log).toHaveBeenCalledWith('曲が正常に追加されました');
        expect(fetchMock).toHaveBeenCalledWith('/api/playlist/add-track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({playlistId: 'playlist1', trackId: 'track1'}),
        });
    });
    
    it('should handle failure to add track', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}), {status: 400});
        
        const result = await addTrackToPlaylist('playlist1', 'track1');
        
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith('曲の追加に失敗しました');
    });
    
    it('should handle network error', async () => {
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        const result = await addTrackToPlaylist('playlist1', 'track1');
        
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith('エラーが発生しました:', expect.any(Error));
    });
});

describe('removeTrackFromPlaylist function', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        console.log = jest.fn();
        console.error = jest.fn();
    });
    
    it('should remove track successfully', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}), {status: 200});
        
        const result = await removeTrackFromPlaylist('playlist1', 'track1');
        
        expect(result).toBe(true);
        expect(console.log).toHaveBeenCalledWith('曲が正常に削除されました');
        expect(fetchMock).toHaveBeenCalledWith('/api/playlists/remove-track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({playlistId: 'playlist1', trackId: 'track1'}),
        });
    });
    
    it('should handle failure to remove track', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({error: 'Failed to remove'}), {status: 400});
        
        const result = await removeTrackFromPlaylist('playlist1', 'track1');
        
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith('曲の削除に失敗しました', {error: 'Failed to remove'});
    });
    
    it('should handle network error', async () => {
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        const result = await removeTrackFromPlaylist('playlist1', 'track1');
        
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith('エラーが発生しました:', expect.any(Error));
    });
});
