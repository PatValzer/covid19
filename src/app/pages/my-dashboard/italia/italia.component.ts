import { Component, OnInit } from '@angular/core';
import { Regione } from '../regione';
import { GetDataService } from '../get-data.service';
import { DatePipe } from '@angular/common';
import * as _ from "lodash";
import { TipologiaDiReportRegioni } from '../tipologia-di-report.-regioni.enum';

@Component({
  selector: 'app-italia',
  templateUrl: './italia.component.html',
  styleUrls: ['./italia.component.scss']
})
export class ItaliaComponent implements OnInit {

  datiRegioniScaricati: Regione[] = [];
  datiItalia: any = [];
  datiItaliaCache: any[];

  tipologiaReportSelezionata;
  constructor(public getDataService: GetDataService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.getDataService.getDatiRegioni().subscribe(datiRegioni => {

      this.datiRegioniScaricati = datiRegioni;
      this.caricaDatiGrafico();
    });
  }

  caricaDatiGrafico(tipologiaDiReportRegioni = null) {
    console.log(tipologiaDiReportRegioni);
    const datiRaggruppati = _.chain(this.datiRegioniScaricati).groupBy("data").map((value, key) => ({ data: key, datiRegioniGiornalieri: value })).value();
    var datiDaTracciare = ["deceduti", "positivi", "totale", "ricoverati", "terapia intensiva", "ospedalizzati", "isolamento", "dimessi", "tamponi"]
    if (tipologiaDiReportRegioni != null) {
      var datiDaTracciareTemp = [];
      tipologiaDiReportRegioni.forEach(element => {
        //datiDaTracciareTemp.push(this.getEnumKeyByEnumValue(TipologiaDiReportRegioni, element));
      });
    }
    this.datiItalia = datiDaTracciare
      .map(dato => {
        return {
          name: dato,
          series: this.recuperaDatiGiornalieri(dato, datiRaggruppati)
        };
      })
  }

  getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
  }
  recuperaDatiGiornalieri(dato, datiRaggruppati): any {
    return datiRaggruppati
      .map(z => {
        return {
          name: this.datepipe.transform(z.data, 'dd MMMM'),
          value: this.calcolaValoreGiornaliero(z.datiRegioniGiornalieri, dato),
        };
      });
  }
  calcolaValoreGiornaliero(datiRegioniGiornalieri: Regione[], dato: any) {
    switch (dato) {
      case "deceduti":
        return _.sumBy(datiRegioniGiornalieri, z => z.deceduti)
      case "positivi":
        return _.sumBy(datiRegioniGiornalieri, z => z.totale_positivi)
      case "totale":
        return _.sumBy(datiRegioniGiornalieri, z => z.totale_casi);
      case "ricoverati":
        return _.sumBy(datiRegioniGiornalieri, z => z.ricoverati_con_sintomi);
      case "terapia intensiva":
        return _.sumBy(datiRegioniGiornalieri, z => z.terapia_intensiva);
      case "ospedalizzati":
        return _.sumBy(datiRegioniGiornalieri, z => z.totale_ospedalizzati);
      case "isolamento":
        return _.sumBy(datiRegioniGiornalieri, z => z.isolamento_domiciliare);
      case "dimessi":
        return _.sumBy(datiRegioniGiornalieri, z => z.dimessi_guariti);
      case "tamponi":
        return _.sumBy(datiRegioniGiornalieri, z => z.tamponi);
      default:
        return 0;
    }
  }

}
