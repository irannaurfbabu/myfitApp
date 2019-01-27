import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
// import { FileUpload } from './file-upload';

@Injectable({
  providedIn: 'root'
})

// var locationUrl: any;

export class MeImageUploadService {

  FOLDER = 'mobifit/';

  constructor() { }

  uploadfile(file)  {

      const bucket = new S3(
        {
          accessKeyId: 'AKIAIV4NWQ7NTJRRCIXQ',
          secretAccessKey: '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',
          region: 'ap-south-1'
        }
      );
  
      const params = {
        Bucket: 'mobiezy-image-upload',
        Key: this.FOLDER + file.name,
        Body: file,
        ContentType: file.type
      };
      console.log('params',params);
      console.log('file',file);
  
      bucket.upload(params, function (err, data) {
        if (err) {
          console.log('There was an error uploading your file: ', err);
          return false;
        }
  
        console.log('Successfully uploaded file.', data);
        return true;
      });

     
  }

  // getFiles(): Observable<Array<File>> {
  //   const fileUploads = new Array<File>();
 
  //   const params = {
  //     Bucket: 'mobiezy-image-upload',
  //     Prefix: this.FOLDER
  //   };
  //   const bucket = new S3(
  //     {
  //       accessKeyId: 'AKIAIV4NWQ7NTJRRCIXQ',
  //       secretAccessKey: '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',
  //       region: 'ap-south-1'
  //     }
  //   );
 
  //   bucket.listObjects(params, function (err, data) {
  //     if (err) {
  //       console.log('There was an error getting your files: ' + err);
  //       return;
  //     }
 
  //     console.log('Successfully get files.', data);
 
  //     const fileDatas = data.Contents;
 
  //     fileDatas.forEach(function (file) {
  //       fileUploads.push(new File(file.Key, 'https://s3.amazonaws.com/' + params.Bucket + '/' + file.Key));
  //     });
  //   });
 
  //   return Observable.of(fileUploads);
  // }
 

  
}
