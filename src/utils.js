import qs from 'query-string';

class Utils {
    getDataFromURL (url) {
        console.log({url});
        const urlObj = new URL(url);
        const queryParams = qs.parse(urlObj.search);
        return queryParams;
    }
}

export default new Utils();
