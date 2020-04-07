import { Component, OnInit, Input } from '@angular/core';
import { Config } from '../config';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  _dati: any = [];
  @Input()
  set dati(dati) {
    this._dati = dati;
    this.datiCache = this.copy(dati);
  };
  get dati() {
    return this._dati;
  };

  // options

  Config = Config;
  legend = !Config.isMobile;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Data';
  yAxisLabel = 'Persone';
  timeline = true;
  tipologiaChartSelezionata = "";
  // colorScheme = {
  //   domain: ['#388E3C', '#4CAF50', '#C8E6C9', '#000000', '#CDDC39', '#212121', '#757575','#BDBDBD']
  // };
  datiCache: any = [];



  ngOnInit(): void {

  }


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    if (typeof data === 'string' || data instanceof String) {
      const datiFiltrati =  this.copy(this.dati);
      var removeIndex = datiFiltrati.map(function (item) { return item.name; })
        .indexOf(data);
      if (datiFiltrati[removeIndex].series.length == 0)
        datiFiltrati[removeIndex].series = [...this.datiCache[removeIndex].series];
      else
        datiFiltrati[removeIndex].series = [];

      this._dati = datiFiltrati.slice();
    }
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  copy(aObject) {
    if (!aObject) {
      return aObject;
    }

    let v;
    let bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
      v = aObject[k];
      bObject[k] = (typeof v === "object") ? this.copy(v) : v;
    }

    return bObject;
  }




}
