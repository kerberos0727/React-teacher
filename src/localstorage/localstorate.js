
export const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    } else {
        localStorage.removeItem('accessToken');
    }
};
