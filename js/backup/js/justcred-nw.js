var creds = new AWS.CognitoIdentityCredentials({
    IdentityPoolId :   'us-east-1:295c9110-6d6c-48ce-b7c7-8c0b969d1305', // Identity Pool ID
});

// get aws set up
AWS.config.update({
    region: 'us-east-1',
    credentials: creds
 });
var s3 = new AWS.S3();
