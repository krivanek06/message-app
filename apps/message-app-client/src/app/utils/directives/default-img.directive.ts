import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

type ImageSrc = string | null | undefined;

/**
 * directive used to load an image and if error happens, use a default image as fallback
 */
@Directive({
  selector: '[appDefaultImg]',
  standalone: true,
})
export class DefaultImgDirective {
  private imageRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  src = input<ImageSrc | null | undefined>(null);

  srcChangeEffect = effect(() => {
    this.initImage();
  });

  private defaultLocalImage = 'assets/image-placeholder.jpg';

  private initImage() {
    // show skeleton before image is loaded
    this.renderer.addClass(this.imageRef.nativeElement, 'g-skeleton');

    const img = new Image();

    if (!this.src()) {
      this.setImage(this.defaultLocalImage);
      this.renderer.removeClass(this.imageRef.nativeElement, 'g-skeleton');
      return;
    }

    // if possible to load image, set it to img
    img.onload = () => {
      this.setImage(this.resolveImage(this.src()));
      this.renderer.removeClass(this.imageRef.nativeElement, 'g-skeleton');
    };

    img.onerror = () => {
      // Set a placeholder image
      this.setImage(this.defaultLocalImage);
      this.renderer.removeClass(this.imageRef.nativeElement, 'g-skeleton');
    };

    // triggers http request to load image
    img.src = this.resolveImage(this.src());
  }

  private setImage(src: ImageSrc) {
    this.imageRef.nativeElement.setAttribute('src', src);
  }

  private resolveImage(src: ImageSrc): string {
    if (!src) {
      return this.defaultLocalImage;
    }

    return src;
  }
}
