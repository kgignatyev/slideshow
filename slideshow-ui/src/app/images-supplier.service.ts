import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImagesSupplierService {

  constructor( public http:HttpClient) {

  }

  getNextImage(){
    return this.http.get("http://localhost:8080/api/random-image").toPromise()
  }

}
