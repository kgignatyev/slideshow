import {Component, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subscription, timer} from "rxjs";
import {ImagesSupplierService} from "../images-supplier.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {PictureAndCatalogInfo} from "../data";
import {faTrash} from '@fortawesome/free-solid-svg-icons';


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


  faDelete = faTrash

  // @ts-ignore
  modalRef: BsModalRef;

  @ViewChild("lastPhotosTemplate")
  lastPhotosModalTemplate: any;

  constructor(public imgSupplier: ImagesSupplierService, private modalService: BsModalService) {


  }

  @HostListener('document:keydown.meta.l')
  openLastPhotosDialog() {
    this.openLastPhotosModal(this.lastPhotosModalTemplate)
  }


  image_link: string = '';

  ngOnInit(): void {
    this.setInitialImages();

    let storedDuration = localStorage.getItem("slideDuration")
    if (!storedDuration) {
      storedDuration = '10';
    }
    const animationDurationSeconds: number = Number.parseInt(storedDuration);

    this.setupTimer(animationDurationSeconds);

  }

  setupTimer(durationSeconds: number) {
    localStorage.setItem("slideDuration", "" + durationSeconds)
    document.documentElement.style.setProperty('--duration', durationSeconds + "s");
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.timer = timer(durationSeconds * 1000, durationSeconds * 1000);
    this.subscription = this.timer.subscribe(val => {
      this.runSequence()
    });
  }

  setClassToFirst() {
    // @ts-ignore
    document.getElementById("i1").setAttribute("class", "FadeOut");
    // @ts-ignore

  }

  async setInitialImages() {
    let url = await this.nextImageFullUrl()
    // @ts-ignore
    document.getElementById("i1").setAttribute("src", url)
    url = await this.nextImageFullUrl()
    // @ts-ignore
    document.getElementById("i2").setAttribute("src", url)
  }

  async nextImageFullUrl() {
    // @ts-ignore
    let imageInfo: PictureAndCatalogInfo = await this.imgSupplier.getNextImage();
    const nextImageUri = imageInfo.uri
    const nextImage = this.getFullImageUrl(nextImageUri)
    return nextImage;
  }

  getFullImageUrl(uri: String) {
    return "http://localhost:8080/images/" + uri;
  }

  async runSequence() {
    const nextImageUrl = await this.nextImageFullUrl()
    this.setImage(nextImageUrl, true)
  }


  setImage(fullImageUrl: string, next: boolean) {
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
    const e1Opacity = parseFloat( getComputedStyle(elementById1).opacity );
    // @ts-ignore
    const e2Opacity = parseFloat( getComputedStyle(elementById2).opacity );
    // debugger
    if( next ) {
      if (e1Opacity > e2Opacity) {
        // @ts-ignore
        elementById2.setAttribute("src", fullImageUrl)
      } else {
        // @ts-ignore
        elementById1.setAttribute("src", fullImageUrl)
      }
    }else{
      if (e1Opacity > e2Opacity) {
        // @ts-ignore
        elementById1.setAttribute("src", fullImageUrl)
      } else {
        // @ts-ignore
        elementById2.setAttribute("src", fullImageUrl)
      }
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

    if (!doc.fullscreenElement) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
  }

  openSettingsModal(template: TemplateRef<any>) {
    this.duration = Number.parseInt("" + localStorage.getItem("slideDuration"));
    this.modalRef = this.modalService.show(template);
  }

  setDuration() {
    this.setupTimer(this.duration)
    this.modalRef.hide();
  }

  openLastPhotosModal(lastPhotosTemplate: TemplateRef<any>) {

    this.modalRef = this.modalService.show(lastPhotosTemplate, {class: 'modal-lg'});
  }

  deleteImage(p: PictureAndCatalogInfo, imgIndex: number) {
    this.imgSupplier.deleteImage(p.uri, imgIndex);
  }

  showPhoto(p: PictureAndCatalogInfo) {
    this.setImage( this.getFullImageUrl( p.uri), false);
  }


}
