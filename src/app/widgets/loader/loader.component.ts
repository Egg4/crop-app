import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { delay} from 'rxjs/operators';

import { Loader } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  public loading$: Observable<boolean>;

  constructor(
	private loader: Loader,
  ) { }

  public ngOnInit(): void {
    this.loading$ = this.loader.loading.pipe(delay(0));
  }

}