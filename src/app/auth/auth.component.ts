import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

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

    return this.http.post('http://localhost:8080/login', credentials, config);
  }

  createPassword(username: String, password: String) {
    const credentials = {
      'username': username,
      'password': password
    }
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post('http://localhost:8080/createPassword', credentials, config);
  }

  signIn() {
    // Accept input from FORMS

    this.login('nasrpi', 'password').subscribe((response) => {
      console.log(response)
      if (response) {
        console.log('User logged in successfully')
        this.router.navigateByUrl('/home')
      }
      else {
        console.log("Please enter correct credentials")
      }
    });
  }

  signUp() {
    // Accept input from FORMS

    this.createPassword('nasrpi', 'password').subscribe((response) => {
      if (response) {
        console.log('Password created successfully')
        this.router.navigateByUrl('/home')
      } else {
        console.log('Error creating password')
      }
      console.log(response)
    })
  }
}
