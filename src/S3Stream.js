import request from 'request';
import s3UploadStreamFactory from 's3-upload-stream';
import s3DownloadStream from 's3-download-stream';
import _ from 'lodash';
import { Readable, Writable } from 'stream';
import Promise from 'bluebird';

class S3Stream {
	constructor(s3, awsConfig=null) {
		this.s3 = s3;
		this.s3UploadStream = s3UploadStreamFactory(s3);
	}

	uploadStream(s3params) {
		return this.s3UploadStream.upload(s3params);
	}

	downloadStream(s3params) {
		return s3DownloadStream({
			client: this.s3,
			params: s3params
		});
	}

	_streamToS3(inputStream, s3params) {
		return new Promise((resolve, reject)=>{
			let upload = this.uploadStream(s3params);
			upload.on('error', reject);
			upload.on('uploaded', resolve);
			inputStream.pipe(upload);
		});
	}

	urlToS3(url, s3params) {
		let stream = request(url);
		return this._streamToS3(stream, s3params);
	}

	stringToS3(string, s3params) {
		let stream = this._string2stream(string);
		return this._streamToS3(stream, s3params);
	}

	stringFromS3(s3params) {
		return new Promise((resolve, reject)=>{
			let stringSink = new StringSink();
			let download = this.downloadStream(s3params).pipe(stringSink);
			download.on('error', reject);
			download.on('finish', function() {
				resolve(stringSink.getString());
			});
		});
	}

	_string2stream(string) {
		if(!_.isString(string)) {
			throw new Error('Can only convert string to stream');
		}
		// https://stackoverflow.com/a/22085851
		let s = new Readable();
		s.push(string);		// the string you want
		s.push(null);		// indicates end-of-file basically - the end of the stream
		return s;
	}

}

class StringSink extends Writable {
	constructor(...args) {
		super(...args);

		this.chunks=[];
	}
	_write(chunk, enc, next) {
		this.chunks.push(chunk);
		console.log('writing', this.chunks.length);
		next();
	}

	getString() {
		console.log('getting string', this.chunks.length);
		return Buffer.concat(this.chunks).toString();
	}
}

export default S3Stream;