import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen: boolean = false;
  //constructor(private elemRef: ElementRef, private renderer: Renderer2) {}
  constructor(private elemRef: ElementRef) {}

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elemRef.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
    // if (this.isOpen) {
    //   this.renderer.addClass(this.elemRef.nativeElement, 'open');
    // } else {
    //   this.renderer.removeClass(this.elemRef.nativeElement, 'open');
    // }
  }
}
