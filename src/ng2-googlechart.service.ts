import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';

/**
 * <tt>ChartDivService </tt> service is injected to load loader js file
 */
@Injectable()
export class ChartLoaderService {
    w: any;
    private googleScriptIsLoading: boolean;
    constructor() {
        this.googleScriptIsLoading = false;
        this.w = window;
    }
    /**
     * loadLoader() method is called to load loader js file to window
     */
    loadLoader():Observable<Object> {
        return Observable.create(observer => {
            if (!this.w.google) {
                if (!this.googleScriptIsLoading) {
                    this.googleScriptIsLoading = true;
                    let node = document.createElement('script');
                    node.src = 'https://www.gstatic.com/charts/loader.js';
                    node.type = 'text/javascript';
                    node.async = true;
                    node.defer = true;
                    document.getElementsByTagName('head')[0].appendChild(node);
                    setTimeout(function () {
                        observer.next();
                        observer.complete();
                    }, 1000);
                } else {
                    if (!this.w.google) {
                        setTimeout(function () {
                            observer.next();
                            observer.complete();
                        }, 1000);
                    } else {
                        observer.next();
                        observer.complete();
                    }
                }
            } else {
                observer.next();
                observer.complete();
            }
        });
    }
}
