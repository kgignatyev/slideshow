import {Component, OnInit} from '@angular/core';
import {Observable, Subscription, timer} from "rxjs";
import {ImagesSupplierService} from "../images-supplier.service";

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {


  timer: Observable<number>;
  // @ts-ignore
  subscription: Subscription;


  animationDurationMilliseconds = 10000

  constructor( private imgSupplier:ImagesSupplierService) {
    this.timer = timer(this.animationDurationMilliseconds, this.animationDurationMilliseconds);
  }

  images = [
    '/assets/DSC_6177.jpg',
    '/assets/DSC_6224.jpg',
    '/assets/DSC_6151.jpg',
    '/assets/DSC_6156.jpg'
  ]

  currentIndex = 0;
  image_link: string = '';

  ngOnInit(): void {
    this.setInitialImages();

    this.subscription = this.timer.subscribe(val => {
      this.runSequence()
    });
  }

  setClassToFirst() {
    // @ts-ignore
    document.getElementById("i1").setAttribute("class", "FadeOut");
    // @ts-ignore

  }

  async setInitialImages(){
    let  url = await this.nextImage()

    // @ts-ignore
    document.getElementById("i1").setAttribute("src", url)
    url = await this.nextImage()
    // @ts-ignore
    document.getElementById("i2").setAttribute("src", url)
  }

  async nextImage() {
    // @ts-ignore
    let imageInfo:any = await this.imgSupplier.getNextImage();
    const nextImageUri = imageInfo['uri']
    const nextImage = "http://localhost:8080/images/" + nextImageUri
    return nextImage;
  }

  async runSequence() {
    // @ts-ignore
    let elementById1 = document.getElementById("i1");
    // @ts-ignore
    let elementById2 = document.getElementById("i2");
    // @ts-ignore
    const e1class = elementById1.getAttribute("class")
    // @ts-ignore
    const e2class = elementById2.getAttribute("class")
    // @ts-ignore
    elementById1.setAttribute("class", e2class);
    // @ts-ignore
    elementById2.setAttribute("class", e1class)

    // @ts-ignore
    const nextImageUri = (await this.imgSupplier.getNextImage())['uri']
    const nextImage = "http://localhost:8080/images/" + nextImageUri
    // debugger
    if (e1class == 'FadeIn') {
      // @ts-ignore
      elementById2.setAttribute("src", nextImage )
    } else {
      // @ts-ignore
      elementById1.setAttribute("src", nextImage )
    }
  }

  setClassToSecond() {
    // @ts-ignore
    document.getElementById("i2").setAttribute("class", "FadeIn")
  }

  toggleFullScreen() {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen = docEl.requestFullscreen;
    const cancelFullScreen = doc.exitFullscreen;

    if(!doc.fullscreenElement ) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }
}
