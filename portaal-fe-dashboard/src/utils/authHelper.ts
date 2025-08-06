import authService from '../services/auth/authService';

export const getAccountIdFromToken = (): number | null => {
  try {
    const token = authService.getToken();
    if (!token) {
      console.log('No token available');
      return null;
    }
    
    // Decode JWT token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    
    console.log('JWT payload:', payload);
    
    // Try different possible field names
    // In questo caso, 'sub' sembra essere l'account ID
    return payload.accountId || payload.account_id || payload.sub || payload.id || null;
  } catch (error) {
    console.error('Error decoding token for account ID:', error);
    return null;
  }
};

export const getPersonIdFromToken = (): number | null => {
  try {
    const token = authService.getToken();
    if (!token) return null;
    
    // Decode JWT token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    
    // Try different possible field names
    return payload.person_id || payload.personId || payload.person || null;
  } catch (error) {
    console.error('Error decoding token for person ID:', error);
    return null;
  }
};