const AWS = require('aws-sdk')
const S3 = new AWS.S3();

const s3List = {
    Bucket: "cck-list-zarizeni",
    Key: "seznamy/2020-11-16.csv"
}

export function loadListOfFacilities(callback) {
    let request = S3.getObject(s3List);
    request.removeListener('validate', AWS.EventListeners.Core.VALIDATE_CREDENTIALS);
    request.removeListener('sign', AWS.EventListeners.Core.SIGN);
    request.on('success', function(response) {
        return response.data["Body"].toString()
    }).on('error', function(error, response) {
        console.error(error)
        console.log(response)
        return null
    }).send(callback);
}
