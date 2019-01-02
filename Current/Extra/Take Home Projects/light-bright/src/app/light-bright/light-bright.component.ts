import { Component, OnInit } from '@angular/core';
import { light } from "../Models/light";

@Component({
  selector: 'app-light-bright',
  templateUrl: './light-bright.component.html',
  styleUrls: ['./light-bright.component.css']
})
export class LightBrightComponent implements OnInit {
  columns:any;
  rows:any;

  constructor() {
    this.columns = [];
    this.rows = [];

    for(let i=0; i<27; i++){
      let temp:light = {
        active: false,
        color: '#000'
      }
      
      this.columns.push(i);
    }

    for(let i=0; i<19; i++){
      this.rows.push(i);
    }
   }

  ngOnInit() {
  }

}
