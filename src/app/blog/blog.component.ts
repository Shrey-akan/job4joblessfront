import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  postId!: string | number;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
    });
  }
}
