import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private http: HttpClient) { }


  sendRequest(name: string, phone: string, type: string, service?: string) {
    if (name && phone && service && type) {
      this.http.post<DefaultResponseType>(environment.api + 'requests', {
        name: name,
        phone: phone,
        service: service,
        type: type,
      });
    } else if (name && phone && type) {
      this.http.post<DefaultResponseType>(environment.api + 'requests', {
        name: name,
        phone: phone,
        type: type,
      });
    }
  }
}
