import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  response_html: Array<Object> = [];
  home: String;
  currentPath: String = '';
  space_usage_details: any;
  dir_name: string = '';
  getUsage: boolean = false;
  search_key: string = '';
  createDirectoryFlag: boolean = false;
  public innerWidth: any;
  public innerHeight: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    let obs = this.http.get('http://localhost:8080/getAllRootItems');
    obs.subscribe((response) => {
      for (let responseObject in response) {
        this.response_html.push(response[responseObject]);
        // console.log(this.response_html[responseObject].filePath)
      }
      this.updateCurrentPath(response[0].filePath);
      this.home = this.currentPath;
    });
    //to get the width and height of the browser window
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    console.log(this.innerWidth, this.innerHeight);
  }

  getContents(path) {
    this.http.post('http://localhost:8080/getContents', path).subscribe((response) => {
      this.response_html = [];
      for (let responseObject in response) {
        this.response_html.push(response[responseObject]);
      }
      if (Object.keys(response).length) {
        this.updateCurrentPath(response[0].filePath);
      } else {
        console.log(path);
        this.updateCurrentPath(path);
      }
    })
  }

  getBackPath() {
    if (this.currentPath != this.home) {
      let back = "";
      let pathArray = this.currentPath.split('\\');
      for (let i = 0; i < pathArray.length - 2; i++) {
        console.log(pathArray[i]);
        back += pathArray[i] + "\\";
      }
      // console.log("back " , back);
      this.getContents(back);
    }

  }

  updateCurrentPath(path) {
    this.currentPath = '';
    let pathArray = path.split('\\');
    for (let i = 0; i < pathArray.length - 1; i++) {
      this.currentPath += pathArray[i] + "\\";
    }
    console.log("current ", this.currentPath);
  }

  refresh() {
    this.getContents(this.currentPath);
  }

  delete(path) {
    this.http.post('http://localhost:8080/delete', path).subscribe((response) => {
      this.refresh();
      console.log(response);
    })
    this.refresh();
  }

  getSpaceUsage() {
    this.getUsage = !this.getUsage;
    this.http.get('http://localhost:8080/getSpaceUsage').subscribe((response) => {
      this.space_usage_details = response;
      console.log(this.space_usage_details);
    })
  }

  getDirectoryName(){
    this.createDirectoryFlag = true;
  }

  createDirectory() {
    let path = this.currentPath;
    path = path.split('\\').join('\\\\');
    path = path.concat(this.dir_name);
    console.log('create: ', path);
    this.http.post('http://localhost:8080/createDirectory', path).subscribe((response) => {
      console.log(response);
    })
    this.refresh();
    this.createDirectoryFlag = false;
  }

  search() {
    let path = this.currentPath;
    path = path.split('\\').join('\\\\');
    const search_obj = {
      'currentPath': path,
      'searchKey': this.search_key
    }
    console.log(search_obj);
    this.http.post('http://localhost:8080/search', search_obj).subscribe((response) => {
      console.log(response);
    });
  }
}
