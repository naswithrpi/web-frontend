import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  response_html : Array<Object> = [];
  constructor( private http : HttpClient) { }

  ngOnInit() {
    let obs = this.http.get('http://localhost:8080/getAllRootItems');
    obs.subscribe((response) => {
      for(let responseObject in response){
        this.response_html.push(response[responseObject]);
        console.log(this.response_html[responseObject].filePath)
      }
    });
  }

  getContents(path){
    console.log("success");
    this.http.post('http://localhost:8080/getContents', path).subscribe((response) => {
      this.response_html = [];
      for(let responseObject in response){
        this.response_html.push(response[responseObject]);
        console.log(this.response_html[responseObject].filePath)
      }
    })
  }

}
