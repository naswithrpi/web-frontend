import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']

})
export class AuthComponent implements OnInit {

  IP_ADDRESS = '192.168.0.103:8080'

  signInForm = this.formBuilder.group({
    'username': [''],
    'password': ['']
  })
  signUpForm = this.formBuilder.group({
    'username': [''],
    'password': [''],
    'confirmPassword': ['']
  })
  formType: boolean = false;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  isAuthenticated() {
    var ip = 'http://' + this.IP_ADDRESS + '/auth'
    let obs = this.http.get(ip);
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

    var ip = 'http://' + this.IP_ADDRESS + '/login'

    return this.http.post(ip, credentials, config);
  }

  createPassword(username: String, password: String) {
    const credentials = {
      'username': username,
      'password': password
    }
    console.log('Credentials: ', credentials);
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    var ip = 'http://' + this.IP_ADDRESS + '/createPassword'

    return this.http.post(ip, credentials, config);
  }

  signIn() {
    this.login(this.signInForm.value['username'], this.signInForm.value['password']).subscribe((response) => {
      console.log(response)
      if (response) {
        console.log('User logged in successfully')
        this.router.navigateByUrl('/home')
      }
      else {
        console.log("Please enter correct credentials")
      }
    });
    this.signInForm.reset();
  }

  signUp() {
    console.log(this.signUpForm.value)
    this.createPassword(this.signUpForm.value['username'], this.signUpForm.value['password']).subscribe((response) => {
      if (response) {
        console.log('Password created successfully')
        this.router.navigateByUrl('/home')
      } else {
        console.log('Error creating password')
      }
      console.log(response)
    });
    this.signUpForm.reset();
  }
}
