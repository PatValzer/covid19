import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provincia } from './provincia';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Regione } from './regione';
import { map } from 'lodash';
import { Mondo } from './mondo';

@Injectable({
  providedIn: 'root',
})
export class GetDataService {
  private datiProvinceURl =
    'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json';

  private datiRegioniURl =
    'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json';

  private worlUrl =
    // "https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-2020-0";
    'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/';
  constructor(private http: HttpClient) { }

  public getDatiProvince(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(this.datiProvinceURl);
  }

  public getDatiRegioni(): Observable<Regione[]> {
    return this.http.get<Regione[]>(this.datiRegioniURl);
  }

  public getDatiMondo(): Observable<any> {
    return this.http.get<Mondo[]>('https://cors-anywhere.herokuapp.com/' + this.worlUrl);
    return this.exportCsv();
  }

  exportCsv(): Observable<any> {
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();
    return this.http.get(
      'https://cors-anywhere.herokuapp.com/' + this.worlUrl + (month + 1) + '-' + day + '.csv',
      {
        responseType: 'text',
      },
    );
  }
}
