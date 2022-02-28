exports.handler = async (event) => {
    console.log("request: " + JSON.stringify(event));
    // TODO implement
    let response_data;
    let status;
    if (event.queryStringParameters && event.queryStringParameters.keyword) {
        console.log("Received keyword: " + event.queryStringParameters.keyword);
        let keyword = event.queryStringParameters.keyword;
        response_data = "Ramavathy says " + keyword;
        status= 200;
    } else {
        response_data = " set input parameter keyword";
        status= 400;
        }
    const response = {
        statusCode: status,
        body: JSON.stringify(response_data)
    };
    console.log("response: " + JSON.stringify(response))
    return response;
};