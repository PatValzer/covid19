import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { DatePipe } from '@angular/common';
import { Mondo, World } from '../mondo';
import * as _ from 'lodash';
import { TipologiaDiReportRegioni } from '../tipologia-di-report.-regioni.enum';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss'],
})
export class WorldComponent implements OnInit {
  datiMondoScaricati: World[][];
  datiMondo = [];
  stati: string[];
  tipologiaReportSelezionata: TipologiaDiReportRegioni = TipologiaDiReportRegioni.DECEDUTI;
  statiSelezionati = new FormControl();


  constructor(public getDataService: GetDataService,
    public datepipe: DatePipe) { }

  statiSelected(statoSelezionato) {
    if (statoSelezionato.value != null) {
      this.caricaDatiGrafico(statoSelezionato.value);
    }
  }

  ngOnInit(): void {
    this.getDataService.getDatiWorld().subscribe(datiMondo => {
      //console.log(datiMondo);
      this.stati = Object.keys(datiMondo);
      //console.log(this.stati);
      this.datiMondoScaricati = datiMondo;
      debugger;

      // this.stati = [
      //   ...new Set(
      //     this.datiMondoScaricati.map(s => {
      //       return s.countriesAndTerritories;
      //     }),
      //   ),
      // ]
      this.caricaDatiGrafico();
    });
  }
  caricaDatiGrafico(stato: string = null) {
    if (stato == null || stato.length == 0) {
      this.datiMondo = this.stati
        .map(stato => {
          return {
            name: stato,
            series: this.recuperaDatiPerStato(stato),
          };
        })
        .sort(this.compareStato);
    }
    else {
      // const datiStato = this.datiMondoScaricati.filter(s => s.countriesAndTerritories == stato).sort(this.compareStatoByDate);
      // const datiDaTracciare = ['deceduti', 'casi'];
      // this.datiMondo = datiDaTracciare
      //   .map(dato => {
      //     return {
      //       name: dato,
      //       series: this.recuperaDatiPerStatoSelezionato(dato, datiStato),
      //     };
      //   });
    }
  }
  recuperaDatiPerStatoSelezionato(dato: string, datiStato: World[]): any {

    return datiStato
      .map(z => {
        return {
          name: this.datepipe.transform(z.date, 'dd MMMM'),
          value: this.calcolaValoreGiornalieroPerStatoSelezionato(z, dato),
        };
      });
  }
  calcolaValoreGiornalieroPerStatoSelezionato(z: World, dato: string): any {
    switch (dato) {
      case 'deceduti':
       return z.deaths;
        //return this.getMortiTotali(moment(z.dateRep, 'DD/MM/YYYY').toDate(), z.countriesAndTerritories, z.deaths);
      case 'casi':
       return z.confirmed;
       // return this.getCasiTotali(moment(z.dateRep, 'DD/MM/YYYY').toDate(), z.countriesAndTerritories, z.cases);
    }

  }
  compareStato(a, b): any {
    if (a.name == 'Italy') return -1;
    if (a.name > b.name) { return 1; }
    if (b.name > a.name) { return -1; }
    return 0;
  }

  compareStatoByDate(a, b): any {
    if (moment(a.dateRep, 'DD/MM/YYYY').toDate() > moment(b.dateRep, 'DD/MM/YYYY').toDate()) { return 1; }
    if (moment(b.dateRep, 'DD/MM/YYYY').toDate() > moment(a.dateRep, 'DD/MM/YYYY').toDate()) { return -1; }
    return 0;
  }
  // compareStatoByDate(a, b): any {
  //   if (a.Month > b.Month) { return 1; }
  //   if (b.Month > a.Month) { return -1; }
  //   if (b.Month == a.Month) {
  //     if (a.Day > b.Day) { return 1; }
  //     if (b.Day > a.Day) { return -1; }
  //   }
  //   return 0;
  // }
  recuperaDatiPerStato(stato: string): any {

    return this.datiMondoScaricati[stato]
      .sort(this.compareStatoByDate)
      .map(z => {
        return {
          name: this.datepipe.transform(z.date, 'dd MMMM'),
          // value: this.getMortiTotali(new Date(z.Year, z.Month - 1, z.Day, 0, 0, 0, 0), z.Country, z.Deaths)
          value: this.getValue(z),
          // value: z.Deaths,
        };
      });
  }

  getValue(rilevazioneGiornalieraStato: World) {
    switch (this.tipologiaReportSelezionata) {
      case TipologiaDiReportRegioni.DECEDUTI:
        return rilevazioneGiornalieraStato.deaths;

      case TipologiaDiReportRegioni.TOTALE:
        return rilevazioneGiornalieraStato.confirmed;

    }
  }


  getMortiTotali(data: Date, stato: string, mortiGiornalieri: number) {
    // return _.sumBy(this.datiMondoScaricati.filter(s => s.countriesAndTerritories == stato && moment(s.dateRep, 'DD/MM/YYYY').toDate() < data), z => z.deaths) + mortiGiornalieri;
  }

  getCasiTotali(data: Date, stato: string, casiGiornalieri: number) {
    // return _.sumBy(this.datiMondoScaricati.filter(s => s.countriesAndTerritories == stato && moment(s.dateRep, 'DD/MM/YYYY').toDate() < data), z => z.cases) + casiGiornalieri;
  }

}
