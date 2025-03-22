function isMobile() {
    try {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|Macintosh|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator?.userAgent);
    } catch (error) {
        return ""
    }
}
export default isMobile
