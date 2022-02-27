exports.handler = async (event) => {
    console.log("request: " + JSON.stringify(event));
    // TODO implement
    let resp_data;
    let status;
    if (event.queryStringParameters && event.queryStringParameters.keyword) {
        console.log("Received keyword: " + event.queryStringParameters.keyword);
        let keyword = event.queryStringParameters.keyword;
        resp_data = "Ramavathy says " + keyword;
        status= 200;
    } else {
        resp_data = "set input parameter keyword";
        status= 400;
        }
    const response = {
        statusCode: status,
        body: JSON.stringify(resp_data)
    };
    console.log("response: " + JSON.stringify(response))
    return response;
};