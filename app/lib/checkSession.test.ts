import {checkSession} from './checkSession';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('checkSession', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    
    it('should return true when session check is successful', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({status: 'success'}));
        
        const result = await checkSession();
        
        expect(result).toBe(true);
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('should return false when session check fails', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({status: 'failure'}));
        
        const result = await checkSession();
        
        expect(result).toBe(false);
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('should return false and log error when fetch throws an error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        const result = await checkSession();
        
        expect(result).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith('セッションチェックエラー:', expect.any(Error));
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/session/check', {
            credentials: 'include'
        });
        
        consoleErrorSpy.mockRestore();
    });
});
