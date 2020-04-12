import { Component, OnInit } from '@angular/core';
import { Provincia } from '../provincia';
import { TipologiaDiReport } from '../tipologia-di-report.enum';
import { FormControl } from '@angular/forms';
import { GetDataService } from '../get-data.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent implements OnInit {

  datiProvinceScaricati: Provincia[] = [];
  datiProvince: any = [];
  datiProvinceCache: any[];


  tipologiaReportSelezionata: TipologiaDiReport = TipologiaDiReport.TOTALE;


  regioniSelezionate = new FormControl();
  provinceSelezionate = new FormControl();


  regioni: string[];

  province: any[] = [];
  provinceCache: any[] = [];
  listaProvince = [];



  constructor(
    public getDataService: GetDataService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getDataService.getDatiProvince().subscribe(datiProvince => {
      this.datiProvinceScaricati = datiProvince;

      this.regioni = [
        ...new Set(
          datiProvince.map(s => {
            return s.denominazione_regione;
          })
        )
      ];
      this.province = [
        ...new Set(
          datiProvince.map(s => {
            const obj: any = {};
            obj.denominazione_provincia = s.denominazione_provincia;
            obj.codice_provincia = s.codice_provincia;
            return obj;
          })
        )
      ].sort(this.compareProvince);

      this.listaProvince = [
        ...new Set(
          this.province.map(s => {
            return s.denominazione_provincia;
          })
        )
      ];
      this.caricaDatiGrafico();
    });
  }

  private caricaDatiGrafico() {
    const provinceMappate = [
      ...new Set(
        this.province.map(x => {
          return x.codice_provincia;
        })
      )
    ];
    this.datiProvince = provinceMappate
      .map(p => {
        return {
          name: this.getNomeProvincia(p, this.datiProvinceScaricati),
          regione: this.getRegioneProvincia(p, this.datiProvinceScaricati),
          series: this.recuperaDatiPerProvincia(p, this.datiProvinceScaricati)
        };
      })
      .sort(this.compareProvince);
    this.datiProvinceCache = [...this.datiProvince];
    if (this.provinceSelezionate.value != null)
      if (this.provinceSelezionate.value.length > 0) {
        this.datiProvince = this.datiProvinceCache.filter(x => this.provinceSelezionate.value.includes(x.name));
      }


  }

  selezionaTipologiaReport() {
    this.caricaDatiGrafico();
  }

  getRegioneProvincia(codice_provincia, datiProvince: Provincia[]): any {
    return datiProvince.filter(s => s.codice_provincia == codice_provincia)[0]
      .denominazione_regione;
  }
  getNomeProvincia(codice_provincia, datiProvince: Provincia[]): any {
    return datiProvince.filter(s => s.codice_provincia == codice_provincia)[0]
      .denominazione_provincia;
  }

  compareProvince(a, b) {
    if (a.name > b.name) { return 1; }
    if (b.name > a.name) { return -1; }

    return 0;
  }

  recuperaDatiPerProvincia(codiceProvincia, datiProvince: Provincia[]): any[] {
    return datiProvince
      .filter(s => s.codice_provincia == codiceProvincia)
      .map(z => {
        return {
          name: this.datepipe.transform(z.data, 'dd MMMM'),
          value: this.calcolaValoreGiornalieroPerProvincia(z, datiProvince),
          totaleCasi: z.totale_casi,
          inPercentuale: this.calcolaIncrementoPercentuale(z, datiProvince)
        };
      });
  }

  calcolaValoreGiornalieroPerProvincia(datiProvincia, datiProvince) {
    switch (this.tipologiaReportSelezionata) {
      case TipologiaDiReport.PERCENTUALE:
        return this.calcolaIncrementoPercentuale(datiProvincia, datiProvince);
      case TipologiaDiReport.TOTALE:
        return datiProvincia.totale_casi;
    }

    // : z.
  }

  calcolaIncrementoPercentuale(
    datiProvinciaGiornalieri: Provincia,
    datiProvince
  ): any {
    const dataGiornaliera = new Date(datiProvinciaGiornalieri.data);
    dataGiornaliera.setDate(dataGiornaliera.getDate() - 1);
    const datiProvinciaGiornoPrecedente = datiProvince.filter(
      s =>
        s.codice_provincia == datiProvinciaGiornalieri.codice_provincia &&
        new Date(s.data).getDate() == dataGiornaliera.getDate() && new Date(s.data).getMonth() == dataGiornaliera.getMonth()
    );


    let totaleCasiFinoAlGiornoPrecedente = 0;
    if (datiProvinciaGiornoPrecedente.length > 0) {
      totaleCasiFinoAlGiornoPrecedente =
        datiProvinciaGiornoPrecedente[0].totale_casi;
    }
    else {
      return 0;
    }

    const casiOdierni =
      datiProvinciaGiornalieri.totale_casi - totaleCasiFinoAlGiornoPrecedente;
    if (totaleCasiFinoAlGiornoPrecedente == 0) {
      if (casiOdierni == 0) { return 0; } else { return 100; }
    }
    return Math.round((100 * casiOdierni) / totaleCasiFinoAlGiornoPrecedente);
  }



  regioniSelected(regioniSelezionate) {
    this.datiProvince = this.datiProvinceCache.filter(s =>
      this.regioniSelezionate.value.includes(s.regione)
    );
    this.province = [
      ...new Set(
        this.datiProvinceScaricati.filter(s => this.regioniSelezionate.value.includes(s.denominazione_regione)).map(s => {
          const obj: any = {};
          obj.denominazione_provincia = s.denominazione_provincia;
          obj.codice_provincia = s.codice_provincia;
          return obj;
        })
      )
    ].sort(this.compareProvince);

    this.listaProvince = [
      ...new Set(
        this.province.map(s => {
          return s.denominazione_provincia;
        })
      )
    ];
  }

  selectionProvinceChange(provinceSelezionate) {
    this.datiProvince = this.datiProvinceCache.filter(s =>
      this.provinceSelezionate.value.includes(s.name)
    );
  }

}
