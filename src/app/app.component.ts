import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { mergeMap, filter } from 'rxjs/operators';

import { routeAnimation } from './animations/route.animation';
import { I18n } from './i18n/i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [ routeAnimation ],
})
export class AppComponent implements OnInit {

  constructor(
	private router: Router,
	private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translate: TranslateService,
    private i18n: I18n,
  ) { }

  public ngOnInit(): void {
    const language = this.i18n.getLanguage();
    this.translate.use(language);
    this.handleTitle();
  }

  public handleTitle(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      mergeMap(_ => {
        let child = this.activatedRoute.firstChild;
        while (child.firstChild) child = child.firstChild;
        const title = child.snapshot.data.title || 'app_title';
        return this.translate.get(title);
      }),
    ).subscribe((title: string) => {
      this.titleService.setTitle(title.upperCaseFirst());
    });
  }

  public getAnimationState(outlet: RouterOutlet): string | undefined {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}