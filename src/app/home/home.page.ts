import { Component } from '@angular/core';
import {  ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import * as Tesseract from 'tesseract.js';
import { ApiService } from '../api.service';
import { Ipost } from '../ipost';

// class Photo{
//   myImage:any;

// }

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  // public photos:Photo[]=[{"" " }];

  imagesData="assets/imgs/test2.jpg";
  public test;
  getjson:Ipost[];
  compareData1=[];
  compareData2=[];

  id1=1;
  name1="Acer";
  id2=2;
  name2="Dell";

  displayData;
  constructor(private camera:Camera, private actionSheetCtrl: ActionSheetController,
    private photoViewer: PhotoViewer, public apiservice: ApiService ) {

  }

  getData(){
    this.apiservice.getData().subscribe((result:Ipost[]) => {
      this.getjson=result;

      for(let items of result){
        this.compareData1.push(items.id);
        this.compareData2.push(items.name);    
      }
      console.log("ids are", this.compareData1);
        console.log("names are", this.compareData2); 
    },
      (error) =>{
        console.log("this is error", error);
      } 
    )
  }

  ngOnInit(){
    this.getData();
  }

//action sheet list
  async selectSource(){
    this.test=null;
    this.displayData=null;
    let actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Capture Image',
          icon:'camera-outline',
          cssClass:'iconColors',
          handler: () => {
            this.getPicture();
          }
        }, {
          text: 'Pic from Gallery',
          icon:'image-outline',
          handler: () => {
            this.picPicture();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          icon:'close-circle-outline',
        }
      ]
    });
    await actionSheet.present();
  }

  //capturing the imag from camera
  getPicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit:true,
   }
    this.camera.getPicture(options).then((imageData) => {  
      
        this.imagesData= 'data:image/jpeg;base64,' + imageData;
          
    }, (err) => {
      alert(JSON.stringify(err));
   });
}

//pickup image from gallery 
picPicture(){
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
  }
     this.camera.getPicture(options).then((imageData) => {
      this.imagesData= 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
     alert(JSON.stringify(err));
    });
  }

  //for fullscreen the image
  fullScreenImg(imgData){
    this.photoViewer.show(imgData, 'My image title', {share: false});
  }

  //recognize the image and display the text
  analizar(imgdata) {
    Tesseract.recognize(imgdata).then((result)=>{
      console.log("this is result  ", result.data.text);
      this.test=result.data.text;
      console.log("this is textdata  ",this.test);

    }).catch( (err)=>{
      alert("error in tesseract"+ JSON.stringify(err));
     });
    }

  //for comparing json values
  compareDatas(){
    if(this.id1 in this.compareData1 || this.name2 in this.compareData2){
      this.displayData="Data Matched";
      console.log("hello World");
    }

    else{
      this.displayData="No Corresponding data found";
    }
  }

}

