import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImagesSupplierService {

  lastPhotos = new Array();
  lastPhotosLength = 10;

  constructor( public http:HttpClient) {

  }

  listLastPhotos(): any[]{
    const myClonedArray = new Array<any>();
    this.lastPhotos.forEach(val => myClonedArray.push(Object.assign({}, val)));
    return myClonedArray;
  }

  async getNextImage(){
    let picture = await this.http.get("http://localhost:8080/api/random-image").toPromise();
    this.pushPhoto(picture)
    return picture
  }

  private pushPhoto(picture: any) {
    this.lastPhotos.push(picture)
    if( this.lastPhotos.length> this.lastPhotosLength){
      this.lastPhotos.splice( this.lastPhotosLength-1);
    }
  }
}
