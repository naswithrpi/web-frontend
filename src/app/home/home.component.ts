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
  currentPath: string = '';
  space_usage_details: any;
  dir_name: string = '';
  getUsage: boolean = false;
  search_key: string = '';
  createDirectoryFlag: boolean = false;
  selectedFile: File = null;

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
      console.log('Path array:', pathArray)
      for (let i = 0; i < pathArray.length - 2; i++) {
        console.log(pathArray[i]);
        back += pathArray[i] + "\\";
      }
      console.log("back ", back);
      this.getContents(back);
    } else {
      console.log('Already on home')
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
    console.log('Refreshing')
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

  getDirectoryName() {
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

  onFileSelected(event) {
    console.log(event.target.files)
    this.selectedFile = <File>event.target.files[0]
    this.onUpload()
  }

  onUpload() {
    if (this.selectedFile != null) {
      console.log(this.selectedFile)

      const fileUpload = new FormData();
      fileUpload.append('file', this.selectedFile);
      fileUpload.append('path', this.currentPath);

      this.http.post('http://localhost:8080/uploadFile', fileUpload).subscribe((response) => {
        console.log(response);
        this.refresh()
      });
    } else {
      console.log('Please select a file.')
    }
  }

  moveFile(source: string, destination: string) {
    const obj = {
      'source': source,
      'destination': destination
    }
    this.http.post('http://localhost:8080/moveFile', obj, {
      headers: {
        'content-type': 'application/json'
      }
    }).subscribe((response) => {
      console.log(response)
      this.refresh()
    })
  }

  moveFolder(source: string, destination: string) {
    const obj = {
      'source': source,
      'destination': destination
    }
    this.http.post('http://localhost:8080/moveFolder', obj).subscribe((response) => {
      console.log(response)
      this.refresh()
    })
  }

  onTextEntered(event) {
    console.log(event)
  }
}
