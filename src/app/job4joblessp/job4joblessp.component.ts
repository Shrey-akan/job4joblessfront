import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-job4joblessp',
  templateUrl: './job4joblessp.component.html',
  styleUrls: ['./job4joblessp.component.css']
})
export class Job4joblesspComponent {
  postId!: number;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.postId = +params['id'];
    });
  }
}
