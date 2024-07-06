// app/utils/utils.test.ts

import {addTrackToPlaylist, removeTrackFromPlaylist} from './utils';
import axios from 'axios';
import {expect} from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Playlist Utility Functions', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
    });
    
    describe('addTrackToPlaylist', () => {
        it('successfully adds a track to the playlist', async () => {
            mockedAxios.post.mockResolvedValue({status: 200});
            const result = await addTrackToPlaylist('playlist1', 'track1');
            expect(result).toBe(true);
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/playlist/add-track', {
                playlistId: 'playlist1',
                trackId: 'track1',
            });
        });
        
        it('handles errors when adding a track', async () => {
            mockedAxios.post.mockRejectedValue(new Error('API Error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
            });
            const result = await addTrackToPlaylist('playlist1', 'track1');
            expect(result).toBe(false);
            expect(consoleErrorSpy).toHaveBeenCalledWith('エラーが発生しました:', expect.any(Error));
            consoleErrorSpy.mockRestore();
        });
    });
    
    describe('removeTrackFromPlaylist', () => {
        it('successfully removes a track from the playlist', async () => {
            mockedAxios.post.mockResolvedValue({status: 200});
            const result = await removeTrackFromPlaylist('playlist1', 'track1');
            expect(result).toBe(true);
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/playlists/remove-track', {
                playlistId: 'playlist1',
                trackId: 'track1',
            });
        });
        
        it('handles errors when removing a track', async () => {
            mockedAxios.post.mockRejectedValue(new Error('API Error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
            });
            const result = await removeTrackFromPlaylist('playlist1', 'track1');
            expect(result).toBe(false);
            expect(consoleErrorSpy).toHaveBeenCalledWith('エラーが発生しました:', expect.any(Error));
            consoleErrorSpy.mockRestore();
        });
    });
});
