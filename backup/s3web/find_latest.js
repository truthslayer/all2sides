AWS.config.update({
    accessKeyId: "AKIAJ5QHG7BBXGRUXQZA",
    secretAccessKey: "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"
});

var s3 = new AWS.S3();
var params = {Bucket: 'all2sides.com', Key: 'styles.css'};
s3.headObject(params).on('success', function(response) {
    console.log("Key was", response.request.params.Key);
}).on('error',function(error){
    //error return a object with status code 404
    console.log('error!');
}).send();
