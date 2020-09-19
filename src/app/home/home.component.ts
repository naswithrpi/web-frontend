import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from './response';
import { UserActivityModel } from './useractivity';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Enter IP:PORT
  IP_ADDRESS = '192.168.0.106:8080'

  response_html: Array<ResponseModel> = [];
  user_activity: Array<UserActivityModel> = [];
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
    var ip = 'http://' + this.IP_ADDRESS + '/getAllRootItems'
    let obs = this.http.get(ip);
    obs.subscribe((response) => {
      console.log(response)
      for (let responseObject in response) {
        this.response_html.push(response[responseObject]);
        //console.log(this.response_html[responseObject].filePath)
      }
      var temp = this.response_html[0].filePath
      var lastIndex = temp.lastIndexOf("/");
      temp = temp.substring(0, lastIndex + 1);
      console.log(temp)

      //this.updateCurrentPath(temp);
      this.home = temp
      this.currentPath = temp;
      console.log('home', this.home)
    });

    this.getSpaceUsage()
    this.getUserActivity()
  }

  getContents(path) {
    var ip = 'http://' + this.IP_ADDRESS + '/getContents'
    this.http.post(ip, path).subscribe((response) => {
      this.response_html = [];
      for (let responseObject in response) {
        this.response_html.push(response[responseObject]);
      }
      if (Object.keys(response).length) {
        this.updateCurrentPath(response[0].filePath);
      } else {
        console.log(path);
        this.updateCurrentPath(path + "/");
      }
    })
  }

  getBackPath() {
    if (this.currentPath != this.home) {
      let back = "";
      let pathArray = this.currentPath.split('/');
      console.log('Path array:', pathArray)
      for (let i = 0; i < pathArray.length - 2; i++) {
        console.log(pathArray[i]);
        back += pathArray[i] + "/";
      }
      console.log("back ", back);
      this.getContents(back);
    } else {
      console.log('Already on home')
    }
  }

  updateCurrentPath(path) {
    this.currentPath = '';
    console.log('Updating current path: ', path)
    let pathArray = path.split('/');
    for (let i = 0; i < pathArray.length - 1; i++) {
      this.currentPath += pathArray[i] + "/";
    }
    console.log("current ", this.currentPath);

    if (this.currentPath[this.currentPath.length - 1] != '/') {
      // Append / to currentPath
      this.currentPath += '/';
    }
  }

  refresh() {
    console.log('Refreshing')
    this.getContents(this.currentPath);
    this.getUserActivity()
  }

  delete(path) {
    var ip = 'http://' + this.IP_ADDRESS + '/delete'
    this.http.post(ip, path).subscribe((response) => {
      this.refresh();
      console.log(response);
    })
    this.updateUserActivity("Deleted", path);
    this.refresh();
  }

  getSpaceUsage() {
    this.getUsage = !this.getUsage;
    var ip = 'http://' + this.IP_ADDRESS + '/getSpaceUsage'
    this.http.get(ip).subscribe((response) => {
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
    var ip = 'http://' + this.IP_ADDRESS + '/createDirectory'
    this.http.post(ip, path).subscribe((response) => {
      console.log(response);
    })
    this.updateUserActivity("New directory created", this.dir_name);
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
    var ip = 'http://' + this.IP_ADDRESS + '/search'
    this.http.post(ip, search_obj).subscribe((response) => {
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

      var ip = 'http://' + this.IP_ADDRESS + '/uploadFile'
      this.http.post(ip, fileUpload).subscribe((response) => {
        console.log('Upload response', response);
        this.updateUserActivity("New file created", this.selectedFile.name);
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
    var ip = 'http://' + this.IP_ADDRESS + '/moveFile'
    this.http.post(ip, obj, {
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
    var ip = 'http://' + this.IP_ADDRESS + '/moveFolder'
    this.http.post(ip, obj).subscribe((response) => {
      console.log(response)
      this.refresh()
    })
  }

  onTextEntered(event) {
    console.log(event)
  }

  getUserActivity() {
    this.user_activity = []
    var ip = 'http://' + this.IP_ADDRESS + '/getUserActivity'
    let obs = this.http.get(ip);
    obs.subscribe((response) => {
      console.log(response)
      for (let responseObject in response) {
        this.user_activity.push(response[responseObject]);
        //console.log(this.user_activity[responseObject].username)
      }
    });
  }

  updateUserActivity(username: string, activity: string) {
    const obj = {
      'username': username,
      'activity': activity
    }
    var ip = 'http://' + this.IP_ADDRESS + '/updateUserActivity'
    this.http.post(ip, obj, {
      headers: {
        'content-type': 'application/json'
      }
    }).subscribe((response) => {
      console.log(response)
      this.refresh()
    })

  }
}
