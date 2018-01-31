import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
/**
 * <tt>ChartDivService </tt> service is injected to load loader js file
 */
@Injectable()
export class ChartService {
    private googleScriptIsLoading: boolean;
     w: any;
    constructor() {
        this.googleScriptIsLoading = false;
         this.w = window;
        if(!this.w.google){
        this.loadLoader();
        }
    }
    /**
     * 
     */
    private loadLoader() {
        if (!this.googleScriptIsLoading) {
            this.googleScriptIsLoading = true;
            let node = document.createElement('script');
            node.src = 'https://www.gstatic.com/charts/loader.js';
            node.type = 'text/javascript';
            node.async = true;
            node.defer = true;
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }
}