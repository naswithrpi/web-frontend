import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  isAuthenticated() {
    let obs = this.http.get('http://localhost:8080/auth');
    obs.subscribe((response) => {
      console.log(response)
    })
  }

  login(username: String, password: String) {
    const credentials = {
      'username': username,
      'password': password
    }
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    let obs = this.http.post('http://localhost:8080/login', credentials, config);
    obs.subscribe((response) => {
      console.log(response)
    });
  }

  createPassword(username: String, password: String) {
    const credentials = {
      'username': username,
      'password': password
    }
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    let obs = this.http.post('http://localhost:8080/createPassword', credentials, config);
    obs.subscribe((response) => {
      console.log(response)
    })
  }
}
