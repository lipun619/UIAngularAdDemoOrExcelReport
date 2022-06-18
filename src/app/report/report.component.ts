import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AzureAdDemoService } from '../azure-ad-demo.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  pdfUrl?: SafeResourceUrl;
  reportStatus?: string;
  constructor(private azureAdDemoService: AzureAdDemoService,
    private domSanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private dataService: DataService) { }

  ngOnInit(): void {
  }

  getReport() {
    this.azureAdDemoService.getReport().subscribe(response => {
      var urlCreator = window.URL || window.webkitURL;
      this.pdfUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(urlCreator.createObjectURL(response));
    }, (error: HttpErrorResponse) => {
      if (error.status == 401 || error.status == 403) {
        this.snackBar.open('You are unauthorized');
      }
    }
    );
  }

  getReportStatus() {
    this.azureAdDemoService.getReportStatus().subscribe(response => {
      this.reportStatus = response.status;
    });
  }

  downloadReport() {
    let httpMethodName = 'DownloadReport/DownloadReport'
    this.dataService
      .postReportExcelData(httpMethodName)
      .subscribe((data) => {
        this.dataService.downloadFile(data);
      });
  }
}
