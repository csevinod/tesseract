import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ipost } from './ipost';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private dataUrl="assets/data.json";

  constructor(private http: HttpClient) { }

  getData(){
    return this.http.get<Ipost[]>(this.dataUrl);
 }
}
