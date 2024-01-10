import { Component, AfterViewInit, OnInit } from '@angular/core';
declare var anime: any;
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-headline',
  templateUrl: './headline.component.html',
  styleUrls: ['./headline.component.css']
})
export class HeadlineComponent implements OnInit {

  contentArray: string[] = [
    'in Noida',
    'at Microsoft',
    'in Sydney',
    'at Amazon',
    'in New York',
    'at Google'
  ];
  private subscription!: Subscription;
  mainConent: string = this.contentArray[0];

  ngOnInit() {
    this.subscription = interval(2000).subscribe(() => {
      this.updateRandomString();
    });
  }

  private updateRandomString() {
    const randomIndex = Math.floor(Math.random() * this.contentArray.length);
    this.mainConent = this.contentArray[randomIndex];
  }
}
