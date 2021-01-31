import {Component, OnInit, TemplateRef} from '@angular/core';
import {Observable, Subscription, timer} from "rxjs";
import {ImagesSupplierService} from "../images-supplier.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {

  // @ts-ignore
  timer: Observable<number>;
  // @ts-ignore
  subscription: Subscription;

  //used in modal
  duration = 0;


  // @ts-ignore
  modalRef: BsModalRef;

  constructor( private imgSupplier:ImagesSupplierService, private modalService: BsModalService ) {


  }



  image_link: string = '';

  ngOnInit(): void {
    this.setInitialImages();

    let storedDuration = localStorage.getItem("slideDuration")
    if( !storedDuration ){
      storedDuration = '10';
    }
    const animationDurationSeconds:number = Number.parseInt( storedDuration );

    this.setupTimer( animationDurationSeconds );

  }

  setupTimer(durationSeconds:number){
    localStorage.setItem("slideDuration", "" + durationSeconds)
    document.documentElement.style.setProperty('--duration', durationSeconds + "s");
    if( this.subscription ){
      this.subscription.unsubscribe();
    }
    this.timer = timer(durationSeconds*1000, durationSeconds*1000);
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
    let imageInfo:any = this.imgSupplier.getNextImage();
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
    const nextImageUri =  this.imgSupplier.getNextImage()['uri']
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

  openModal(template: TemplateRef<any>) {
    this.duration = Number.parseInt( ""+ localStorage.getItem("slideDuration") );
    this.modalRef = this.modalService.show(template);
  }

  setDuration() {
    this.setupTimer( this.duration )
    this.modalRef.hide();
  }
}
