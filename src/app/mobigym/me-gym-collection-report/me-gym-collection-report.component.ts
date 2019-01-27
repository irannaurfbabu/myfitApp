import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';

import { MeCallHttpPostService } from './../../Service/me-call-http-post.service'
import { PersistenceService } from 'angular-persistence';
import { StorageType } from "../../Service/Interfaces/storage-type.enum";
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import * as moment from 'moment';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'app-me-gym-collection-report',
  templateUrl: './me-gym-collection-report.component.html',
  styleUrls: ['./me-gym-collection-report.component.scss']
})
export class MeGymCollectionReportComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'customer_id', label: 'Customer Id', sortable: true, width: 150 },
    { name: 'full_name', label: 'Customer Name', sortable: true, width: 250 },
    { name: 'opening_balance', label: 'Opening Balance', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'cgst_total', label: 'CGST', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'sgst_total', label: 'SGST', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'tax_total', label: 'TOTAL TAX', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'bill_amount', label: 'BILL AMOUNT', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'collection_amount_original', label: 'Original Collection Amount', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'collection_amount', label: 'Net Collection Amount', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'rebate_amount', label: 'Discount', sortable: true,},
    { name: 'received_amount', label: 'Received Amount', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'closing_balance', label: 'Closing Balance', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'user_name', label: 'Collected By', sortable: true, width: 250 },
    { name: 'received_date', label: 'Received Date' },
    { name: 'customer_number', label: 'Customer Number', sortable: true, width: 150 },
  ];


  filteredData: any[];
  filteredTotal: number;


  _ownerDetails: any;

  searchBox: any = true;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;

  sortBy: string = 'full_name';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  eventPageSize: IPageChangeEvent;
  pageSize: number = 50;
  private getResponseAPI_Input: any = {
    records: [
      {
        owner_id: null,
        fromDate: null,
        toDate: null

      }]
  }
  _collectionSummaryList: any = [];

  collectionReport: FormGroup;
  dateRange: AbstractControl;
  fromDate: AbstractControl;
  toDate: AbstractControl;
  custom : boolean = true;

  constructor(fb: FormBuilder,
    private _dataTableService: TdDataTableService,
    private callHttpPost: MeCallHttpPostService,
    private persistenceService: PersistenceService) {

    this.collectionReport = fb.group({
      dateRange: [null, Validators.required],
      fromDate: [null],
      toDate: [null]
    });

    this.dateRange = this.collectionReport.controls['dateRange'];
    this.fromDate = this.collectionReport.controls['fromDate'];
    this.toDate = this.collectionReport.controls['toDate'];
  }




  optionsSelect: Array<any>;

  ngOnInit() {

    this.optionsSelect = [
      { value: '1', label: 'Today' },
      { value: '2', label: 'Yesterday' },
      { value: '3', label: 'Last 7 Days' },
      { value: '4', label: 'This Month' },
      { value: '5', label: 'Custom' },
    ];

    this._ownerDetails = this.persistenceService.get("ownerDetails", StorageType.SESSION);
    console.log('*********ownerId*********', this._ownerDetails.owner_id)

    this.getResponseAPI_Input.records[0].owner_id = this._ownerDetails.owner_id;
    this.getResponseAPI_Input.records[0].fromDate = "2017-07-01";
    this.getResponseAPI_Input.records[0].toDate = moment();

    this.callHttpPost.makeRequest_getCollectionSummary(this.getResponseAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;"
        );
        console.log(response);

        this._collectionSummaryList = response.collectionSummary;

        this.filteredData = this._collectionSummaryList;
        this.filteredTotal = this._collectionSummaryList.length;
        this.filter();
      }
    )



    this.dateRange.valueChanges.subscribe(
      (value: string) => {
        if (value == '1') {
          this.custom = true;
          this.getResponseAPI_Input.records[0].fromDate = moment().subtract(moment().hour(), 'hour').format();
          this.getResponseAPI_Input.records[0].toDate = moment().format();
          this._collectionSummaryList = [];

          this.collectionReport.controls['fromDate'].setValue(null);
          this.collectionReport.controls['toDate'].setValue(null);
        } else if (value == '2') {
          this.custom = true;
          this.getResponseAPI_Input.records[0].fromDate = moment().subtract('1', 'day').subtract(moment().hour(), 'hour').format();
          this.getResponseAPI_Input.records[0].toDate = moment().subtract(moment().hour(), 'hour').format();
          this._collectionSummaryList = [];

          this.collectionReport.controls['fromDate'].setValue(null);
          this.collectionReport.controls['toDate'].setValue(null);
        } else if (value == '3') {
          this.custom = true;
          this.getResponseAPI_Input.records[0].fromDate = moment().subtract('7', 'days').format();
          this.getResponseAPI_Input.records[0].toDate = moment().format();
          this._collectionSummaryList = [];

          this.collectionReport.controls['fromDate'].setValue(null);
          this.collectionReport.controls['toDate'].setValue(null);
        } else if (value == '4') {
          this.custom = true;
          this.getResponseAPI_Input.records[0].fromDate = moment().subtract(moment().date(), 'days').format();
          this.getResponseAPI_Input.records[0].toDate = moment().format();
          this._collectionSummaryList = [];

          this.collectionReport.controls['fromDate'].setValue(null);
          this.collectionReport.controls['toDate'].setValue(null);
        } else if (value == '5') {
          this.custom = false;
          // this.getResponseAPI_Input.records[0].fromDate = moment(this.collectionReport.controls['fromDate'].value).format('LLL');
          // this.getResponseAPI_Input.records[0].toDate = moment(this.collectionReport.controls['toDate'].value).format('LLL');
          this._collectionSummaryList = [];

        }
      }
    )

    this.filter();

    

    console.log(JSON.stringify(this.getResponseAPI_Input));



    



  }

  onSubmit (value : any) {
     console.log(value) ;

     if(value.fromDate && value.toDate) {
      this.getResponseAPI_Input.records[0].fromDate = moment(value.fromDate).add('331', 'minute');
      this.getResponseAPI_Input.records[0].toDate = moment(value.toDate).add('331', 'minute');
     }

     console.log(
      "%c ---------------------------- *****  API input ***** ---------------------------- ",
      "background: #ADF11A;color: black; font-weight: bold;"
    );
    console.log(JSON.stringify(this.getResponseAPI_Input));

     this.callHttpPost.makeRequest_getCollectionSummary(this.getResponseAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;"
        );
        console.log(response);

        this._collectionSummaryList = response.collectionSummary;

        this.filteredData = this._collectionSummaryList;
        this.filteredTotal = this._collectionSummaryList.length;
        this.filter();
      }
    )


     

  }
  // Local Functions
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  // showAlert(event: any): void {
  //   let row: any = event.row;
  //   // .. do something with event.row
  // }

  filter(): void {
    let newData: any[] = this._collectionSummaryList;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  changePageSize(event: IPageChangeEvent): void {
    this.eventPageSize = event;
  }

  exportReport() {

    console.log('Export Report is clicked but nothing is happening');

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      useBom: true,
      noDownload: false,
      headers: ["Bill Id", "Customer number", "Customer Id", "Full Name", "Phone", "Opening Balance", "CGST", "SGST", "Total Tax",
       "Bill Amount", "Original Collection Amt", "Net Collection Amt","Recieved Amount", "Outstanding Amt", "Closing Balance", "Bill date", "Owner Id", "Collected By" ]
    };

    new Angular5Csv(this._collectionSummaryList, 'Collection Report', options);
  }

}
