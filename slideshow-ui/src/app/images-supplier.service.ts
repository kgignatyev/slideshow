import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PictureAndCatalogInfo} from "./data";

@Injectable({
  providedIn: 'root'
})
export class ImagesSupplierService {

  public lastPhotos = new Array<PictureAndCatalogInfo>();
  lastPhotosLength = 5;
  imageServerBaseUrl = "http://localhost:8080/api";
  public lastPhoto: PictureAndCatalogInfo | undefined;
  constructor( public http:HttpClient) {

  }

  listLastPhotos(): any[]{
    const myClonedArray = new Array<any>();
    this.lastPhotos.forEach(val => myClonedArray.push(Object.assign({}, val)));
    return myClonedArray;
  }

  async getNextImage(): Promise< PictureAndCatalogInfo>{

    let pictureAndCatalogInfo:PictureAndCatalogInfo = (await this.http.get(this.imageServerBaseUrl + "/random-image").toPromise()) as PictureAndCatalogInfo;
    this.lastPhoto = pictureAndCatalogInfo;
    this.pushPhoto(pictureAndCatalogInfo)
    return  pictureAndCatalogInfo
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

  lastModified(): Date {
    var d = new Date(0);
    if(this.lastPhoto) {
      d = new Date(this.lastPhoto.lastUpdated );
    }
    console.info(this.lastPhoto, d)
    return d

  }
}
