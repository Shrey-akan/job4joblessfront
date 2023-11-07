import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settinguser',
  templateUrl: './settinguser.component.html',
  styleUrls: ['./settinguser.component.css']
})
export class SettinguserComponent implements OnInit {
  
  

 
isOpen: boolean = false;
  active: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  handleActive(id: number) {
    this.active = id;
  }

  handleToggle() {
    this.isOpen = !this.isOpen;
  }

}
