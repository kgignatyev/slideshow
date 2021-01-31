import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PictureInfo} from "./data";

@Injectable({
  providedIn: 'root'
})
export class ImagesSupplierService {

  public lastPhotos = new Array<PictureInfo>();
  lastPhotosLength = 5;
  imageServerBaseUrl = "http://localhost:8080/api";
  constructor( public http:HttpClient) {

  }

  listLastPhotos(): any[]{
    const myClonedArray = new Array<any>();
    this.lastPhotos.forEach(val => myClonedArray.push(Object.assign({}, val)));
    return myClonedArray;
  }

  async getNextImage(): Promise< PictureInfo>{

    let picture:PictureInfo = (await this.http.get(this.imageServerBaseUrl + "/random-image").toPromise()) as PictureInfo;
    this.pushPhoto(picture)
    return  picture
  }

  async deleteImage(imageUri: string, imgIndex: number): Promise<Boolean>{
    let pictureDeleted:boolean = (await this.http.delete(this.imageServerBaseUrl + "/images/"+ imageUri).toPromise()) as boolean;
    const idxToDelete = this.lastPhotos.findIndex( (pi, idx)=>{
      return  pi.uri  == imageUri
    } )
    if( idxToDelete!= -1) {
      this.lastPhotos.splice(idxToDelete, 1);
    }
    return  pictureDeleted
  }

  private pushPhoto(picture: any) {
    this.lastPhotos.push(picture)
    if( this.lastPhotos.length> this.lastPhotosLength){
      this.lastPhotos.splice( 0,1);
    }
  }
}
