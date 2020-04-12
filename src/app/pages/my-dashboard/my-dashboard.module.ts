import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { MyDashboardComponent } from './my-dashboard.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { StatusCardComponent } from '../dashboard/status-card/status-card.component';
import { TemperatureDraggerComponent } from '../dashboard/temperature/temperature-dragger/temperature-dragger.component';
import { ContactsComponent } from '../dashboard/contacts/contacts.component';
import { RoomSelectorComponent } from '../dashboard/rooms/room-selector/room-selector.component';
import { TemperatureComponent } from '../dashboard/temperature/temperature.component';
import { RoomsComponent } from '../dashboard/rooms/rooms.component';
import { KittenComponent } from '../dashboard/kitten/kitten.component';
import { SecurityCamerasComponent } from '../dashboard/security-cameras/security-cameras.component';
import { ElectricityComponent } from '../dashboard/electricity/electricity.component';
import { ElectricityChartComponent } from '../dashboard/electricity/electricity-chart/electricity-chart.component';
import { WeatherComponent } from '../dashboard/weather/weather.component';
import { PlayerComponent } from '../dashboard/rooms/player/player.component';
import { SolarComponent } from '../dashboard/solar/solar.component';
import { TrafficComponent } from '../dashboard/traffic/traffic.component';
import { TrafficChartComponent } from '../dashboard/traffic/traffic-chart.component';
import { GetDataService } from './get-data.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SelectComponent } from './select/select.component';
import { GraphComponent } from './graph/graph.component';
import { ItaliaComponent } from './italia/italia.component';
import { ChartsModule } from '../charts/charts.module';
import { ChartModule } from 'angular2-chartjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RegioniComponent } from './regioni/regioni.component';
import { ProvinceComponent } from './province/province.component';
import { MondoComponent } from './mondo/mondo.component';

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    DashboardModule,
    ChartsModule,
    ChartModule,
    NgxChartsModule,
    ReactiveFormsModule,

  ],
  declarations: [
    MyDashboardComponent,
    SelectComponent,
    GraphComponent,
    ItaliaComponent,
    RegioniComponent,
    ProvinceComponent,
    MondoComponent,
  ],
  providers: [
    GetDataService,
    HttpClient,
    DatePipe,

    //DeviceDetectorService
  ],
})
export class MyDashBoardModule { }
