export const convertJsonToLocations = j => j.items.map(item => item.place.position);

export const convertJsonToCurl = j => {
    const jsonData = JSON.parse(j);
    const headers = jsonData.httpHeaders.map(header => `-H "${header}"`).join(' ');
    return `curl -X ${jsonData.method} ${jsonData.url} ${headers} -d '${JSON.stringify(jsonData.body)}'`;
}


export const checkInputValidation = inputJson => {
    if (!Array.isArray(inputJson) && 'items' in inputJson) {
        inputJson = inputJson.items
    }
    return inputJson.filter(item => item.itemType !== "SEARCH_TERM");
    // return inputJson.filter(item => [
    //     'providerId', 'providerPlaceId', 'position', 'title'
    // ].every(key => key in item));
}
