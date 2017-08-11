# s3stream
Thin wrapper over existing libraries to standardize the interface for streaming uploads and downloads from Amazon S3, from local filesystem or URLs.

## Example usage
```js
import AWS from "aws-sdk";
import S3Stream from 's3-streamer';

let s3 = new AWS.S3();
let s3stream = new S3Stream(s3);

let s3params = { Bucket: "BUCKET", Key: "KEY" };

// upload a string to s3
s3stream.stringToS3("Hello World", s3params).then(function() {
	console.log('Uploaded: %s', string);
	// do something

	s3stream.stringFromS3(s3params).then(function(string) {
		console.log('Downloaded: %s', string);

		// do something
	});
});
```
## Methods

```js
s3stream.urlToS3(url, s3params)
```
Streams the data from a URL to an S3 object without using local storage. Returns a bluebird promise.

```js
s3stream.stringToS3(string, s3params)
```
Streams a string to an S3 object. Returns a bluebird promise.

```js
s3stream.stringFromS3(s3params)
```
Streams an S3 object to a string variable. Returns a bluebird promise that resolves with the string.


## Lower level methods

```js
s3stream.uploadStream(s3params)
```
Returns a Writable that you can pipe streams to.

```js
s3stream.downloadStream(s3params)
```
Returns a Readable that you can pipe to other streams.

