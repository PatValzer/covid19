import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { DatePipe } from '@angular/common';
import { Regione } from '../regione';
import { TipologiaDiReportRegioni } from '../tipologia-di-report.-regioni.enum';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-regioni',
  templateUrl: './regioni.component.html',
  styleUrls: ['./regioni.component.scss'],
})
export class RegioniComponent implements OnInit {

  datiRegioniScaricati: Regione[] = [];
  datiRegioni: any = [];
  datiRegioniCache: any[];
  tipologiaReportSelezionata: TipologiaDiReportRegioni = TipologiaDiReportRegioni.DECEDUTI;
  regioniSelezionate = new FormControl();
  regioni: string[];

  constructor(
    public getDataService: GetDataService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {

    this.getDataService.getDatiRegioni().subscribe(datiRegioni => {

      this.datiRegioniScaricati = datiRegioni;

      this.regioni = [
        ...new Set(
          this.datiRegioniScaricati.map(s => {
            return s.denominazione_regione;
          }),
        ),
      ];

      this.caricaDatiGrafico();

    });
  }


  caricaDatiGrafico() {
    this.datiRegioni = this.regioni
      .map(regione => {
        return {
          name: regione,
          series: this.recuperaDatiPerRegione(regione),
        };
      })
      .sort(this.compareRegione);

    this.datiRegioniCache = [...this.datiRegioni];
  }

  recuperaDatiPerRegione(regione: string): any {
    return this.datiRegioniScaricati
      .filter(s => s.denominazione_regione == regione)
      .map(z => {
        return {
          name: this.datepipe.transform(z.data, 'dd MMMM'),
          value: this.calcolaValoreGiornalieroPerRegione(z),
        };
      });
  }
  calcolaValoreGiornalieroPerRegione(regione: Regione): any {
    switch (this.tipologiaReportSelezionata) {
      case TipologiaDiReportRegioni.DECEDUTI:
        return regione.deceduti;
      case TipologiaDiReportRegioni.TOTALE:
        return regione.totale_casi;
      case TipologiaDiReportRegioni.RICOVERATI:
        return regione.ricoverati_con_sintomi;
      case TipologiaDiReportRegioni.TERAPIA_INTENSIVA:
        return regione.terapia_intensiva;
      case TipologiaDiReportRegioni.OSPEDALIZZATI:
        return regione.totale_ospedalizzati;
      case TipologiaDiReportRegioni.ISOLAMENTO_DOMICILIARE:
        return regione.isolamento_domiciliare;
      case TipologiaDiReportRegioni.ATTUALMENTE_POSITIVI:
        return regione.totale_positivi;
      case TipologiaDiReportRegioni.NUOVI_POSITIVI:
        return regione.nuovi_positivi;
      case TipologiaDiReportRegioni.DIMESSI:
        return regione.dimessi_guariti;
      case TipologiaDiReportRegioni.TAMPONI:
        return regione.tamponi;
    }

  }

  compareRegione(a, b): any {
    if (a.name > b.name) { return 1; }
    if (b.name > a.name) { return -1; }
    return 0;
  }

  regioniSelected(regioniSelezionate) {

    if (regioniSelezionate.value != null) {
      this.caricaGraficoRegioneSelezionata(regioniSelezionate.value);
    }

  }
  caricaGraficoRegioneSelezionata(regione) {
    const datiRegioneSelezionata = this.datiRegioniScaricati.filter(s => s.denominazione_regione == regione);
    // tslint:disable-next-line: max-line-length
    const datiDaTracciare = ['deceduti', 'positivi', 'totale', 'ricoverati', 'terapia intensiva', 'ospedalizzati', 'isolamento',  'dimessi', 'tamponi'];
    this.datiRegioni = datiDaTracciare
      .map(dato => {
        return {
          name: dato,
          series: this.recuperaDatiPerRegioneSelezionata(dato, datiRegioneSelezionata),
        };
      });
  }

  recuperaDatiPerRegioneSelezionata(dato: string, datiRegioneSelezionata: Regione[]): any {

    return datiRegioneSelezionata
      .map(z => {
        return {
          name: this.datepipe.transform(z.data, 'dd MMMM'),
          value: this.calcolaValoreGiornalieroPerRegioneSelezionata(z, dato),
        };
      });

  }
  calcolaValoreGiornalieroPerRegioneSelezionata(z: Regione, dato: string): any {
    switch (dato) {
      case 'deceduti':
        return z.deceduti;
      case 'positivi':
        return z.totale_positivi;
      case 'totale':
        return z.totale_casi;
      case 'ricoverati':
        return z.ricoverati_con_sintomi;
      case 'terapia intensiva':
        return z.terapia_intensiva;
      case 'ospedalizzati':
        return z.totale_ospedalizzati;
      case 'isolamento':
        return z.isolamento_domiciliare;
      case 'dimessi':
        return z.dimessi_guariti;
      case 'tamponi':
        return z.tamponi;
    }
  }

    // seleziona(data): void {
    //   alert();
    //   console.log('REgioni', JSON.parse(JSON.stringify(data)));
    // }


}
