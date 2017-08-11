import AWS from "aws-sdk";
import S3Stream from './S3Stream';

// optional
AWS.config.update({
	accessKeyId: "<YOUR_ACCESS_KEY>",
	secretAccessKey: '<YOUR_SECRET_ACCESS>',
	region: "<REGION>"
});
let s3 = new AWS.S3();

const BUCKET = "<BUCKET_NAME>";
const KEY = "<KEY_NAME>";

let s3stream = new S3Stream(s3);

let string = "Some string";
let url = 'http://www.google.com/';

let uploadParams = {
	Bucket: BUCKET,
	Key: KEY,
	ContentType: "text/plain"
};

let downloadParams = {
	Bucket: BUCKET,
 	Key: KEY
};

s3stream.stringToS3(string, uploadParams).then(function() {
	console.log('Upload Success');
}).catch(function(err) {
	console.log('Upload Error', err);
});

setTimeout(function() {

	s3stream.stringFromS3(downloadParams).then(function(string) {
		console.log('Download Success', string);
	}).catch(function(err) {
		console.log('Download Error', err);
	});

}, 5000);
