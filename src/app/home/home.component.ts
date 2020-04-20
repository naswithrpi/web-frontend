import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  response_html: Array<Object> = [];
  home: String = 'C:\\Users\\Ajay\\Documents\\nasrpi-test';
  back: String = '';
  space_usage_details: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    let obs = this.http.get('http://localhost:8080/getAllRootItems');
    obs.subscribe((response) => {
      for (let responseObject in response) {
        this.response_html.push(response[responseObject]);
        console.log(this.response_html[responseObject].filePath)
      }
    });
  }

  getContents(path) {
    console.log("success");

    this.getBackPath(path);

    this.http.post('http://localhost:8080/getContents', path).subscribe((response) => {
      this.response_html = [];
      for (let responseObject in response) {
        this.response_html.push(response[responseObject]);
        console.log(this.response_html[responseObject].filePath)
      }
    })
  }

  getBackPath(path) {
    this.back = "";
    let pathArray = path.split('\\');
    for (let i = 0; i < pathArray.length - 1; i++) {
      console.log(pathArray[i]);
      this.back += pathArray[i] + "\\";
    }
    console.log(this.back);
  }

  delete(path) {
    this.http.post('http://localhost:8080/delete', path).subscribe((response) => {
      console.log(response);
    }
    )
  }

  getSpaceUsage() {
    this.http.get('http://localhost:8080/getSpaceUsage').subscribe((response) => {
      this.space_usage_details = response;
      console.log(this.space_usage_details);
    })
  }
}
