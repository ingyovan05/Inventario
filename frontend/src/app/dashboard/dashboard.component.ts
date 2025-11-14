import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="card" style="margin-bottom:16px;">
      <h2>Resumen</h2>
      <div style="display:flex; gap:16px; flex-wrap: wrap; row-gap: 8px;">
        <div><b>Ventas:</b> {{summary?.sales?.sales_count || 0}}</div>
        <div><b>Total ventas:</b> {{summary?.sales?.total_sales || 0}}</div>
        <div><b>Artículos:</b> {{summary?.inventory?.products || 0}}</div>
        <div><b>Unidades:</b> {{summary?.inventory?.units || 0}}</div>
        <div><b>Valor inventario:</b> {{summary?.inventory?.stock_value || 0}}</div>
      </div>
    </div>
    <div class="card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <h3>Top productos</h3>
      </div>
      <canvas baseChart 
        [data]="barChartData"
        [options]="barChartOptions"
        [type]="'bar'">
      </canvas>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  api = inject(ApiService);
  summary: any;

  barChartOptions: ChartOptions<'bar'> = { responsive: true };
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [ { data: [], label: 'Unidades vendidas' } ]
  };

  ngOnInit(): void {
    this.api.summary({}).subscribe((s) => (this.summary = s));
    this.api.topProducts({ limit: 10 }).subscribe((rows) => {
      this.barChartData = {
        labels: rows.map((r: any) => r.name),
        datasets: [ { data: rows.map((r: any) => r.qty), label: 'Unidades vendidas' } ]
      };
    });
  }
}

