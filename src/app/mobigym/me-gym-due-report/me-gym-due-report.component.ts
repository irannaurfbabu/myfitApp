import { AbstractControl, FormBuilder } from '@angular/forms';

import { Component, OnInit } from '@angular/core';

// import angular additional 
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';

// import additional library
import { PersistenceService } from 'angular-persistence';

// import services
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";
import { FormGroup } from '../../../../node_modules/@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-me-gym-due-report',
  templateUrl: './me-gym-due-report.component.html',
  styleUrls: ['./me-gym-due-report.component.scss']
})
export class MeGymDueReportComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'customer_id',  label: 'Customer Id', sortable: true, width: 200 },
    { name: 'full_name',  label: 'Full Name', sortable: true, width: 200 },
    { name: 'phone', label: 'Contact Number', width: 200 },
    { name:  'due_amount', label: 'Due Amount', sortable: true, width: 150},
    { name: 'due_date', label: 'Due Date', hidden: false, width: 200 },
    { name: 'days', label: 'Days Left', hidden: false, width: 200 },
    { name: 'customer_number', label: 'Collect Due', sortable: true, width: 100 },
    // { name: 'active', label: 'Status' },
    // { name: 'employee_id', label: 'Action', width: 100, sortable: false},
    
  ];

  // public variables
  showProgressBar: boolean = false;
  showNoRecords: boolean = false;
  _dueCustomers: any  = []; // see json data
  filteredData   : any = [];
  filteredTotal  : any;

  searchBox      : any    = true;
  searchTerm     : string = '';
  fromRow        : number = 1;
  currentPage    : number = 1;
  sortBy         : string                  = 'days';
  selectedRows   : any[]                   = [];
  sortOrder      : TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  eventPageSize  : IPageChangeEvent;
  pageSize       : number = 50;


  dueReport : FormGroup;
  fromDate: AbstractControl;
  toDate: AbstractControl;
  dateRange: AbstractControl;

  optionsSelect : any;
  custom : boolean;
 
  // private variables
  private userDetails : any = "";
  private ownerDetails : any = "";
  private getResponseAPI_Input: any = {
    records: [
      {
        owner_id: null,
        from_date: null,
        to_date: null

      }]
  }

  constructor(
    private _dataTableService : TdDataTableService,
    private persistenceService: PersistenceService,
    private callHttpPost      : MeCallHttpPostService,
    private fb : FormBuilder
  ) {

    this.dueReport = fb.group({
      dateRange : [''],
      fromDate : [''],
      toDate : ['']
    })

    this.dateRange = this.dueReport.controls['dateRange'];
    this.fromDate  = this.dueReport.controls['fromDate'];
    this.toDate    = this.dueReport.controls['toDate']


    // set flags 
    this.showProgressBar = true; // show progress bar
    this.showNoRecords = false; //  

    this.optionsSelect = [
      { value: '1', label: 'Today' },
      { value: '2', label: 'Tomorrow' },
      { value: '3', label: 'Next 7 Days' },
      { value: '4', label: 'This Month' },
      { value: '5', label: 'Custom' },
    ];

    // set variables
    this.userDetails =  this.persistenceService.get('userDetails', StorageType.SESSION);
    this.ownerDetails =  this.persistenceService.get('ownerDetails', StorageType.SESSION);

    console.log("--Cache Values--");
    console.log(this.userDetails);
    console.log(this.ownerDetails);
   
     // assign values to input object
     this.getResponseAPI_Input.records[0].owner_id =  this.ownerDetails.owner_id;
     this.getResponseAPI_Input.records[0].to_date  = moment().add('1', 'year');
     this.getResponseAPI_Input.records[0].from_date = moment().subtract('1', 'year');

     console.log(
       "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
       "background: #5e35b1;color: white; font-weight: bold;" );
     console.log( this.getResponseAPI_Input);

     // make api call to fetch data ~ Start -----------------------
    this.callHttpPost.makeRequest_getDueReport(this.getResponseAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- ***** Manage Employee API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);

        // assign to local variable
        this._dueCustomers = response.dueReport

                
        if(this._dueCustomers.length > 0){
          
          //hide progress bar
          this.showProgressBar = false;

          // assigning pdackDetails to table data
          this.filteredData = this._dueCustomers;
          this.filteredTotal = this._dueCustomers.length;
          this.filter();
        } 
        else {

          this.showProgressBar = false;
          this.showNoRecords = true;
          this._dueCustomers = [];

          console.log(
            "%c ---------------------------- *****  NO RESPONSE ***** ---------------------------- ",
            "background: #e57373 ;color: white; font-weight: bold;"
          );
        
        }

        
      }
    );
  }

  ngOnInit() {
    
    
      
      // make api call to fetch data ~ End -----------------------
      this.dateRange.valueChanges.subscribe(
        (value: string) => {
          if (value == '1') {
            this.custom = true;
            this.getResponseAPI_Input.records[0].from_date = moment().subtract(moment().hour(), 'hour').format();
            this.getResponseAPI_Input.records[0].to_date = moment().add('1', 'day').subtract(moment().hour(), 'hour').format();
            this._dueCustomers = [];
  
            this.dueReport.controls['fromDate'].setValue(null);
            this.dueReport.controls['toDate'].setValue(null);
          } else if (value == '2') {
            this.custom = true;
            this.getResponseAPI_Input.records[0].from_date = moment().add('1', 'day').subtract(moment().hour(), 'hour').format();
            this.getResponseAPI_Input.records[0].to_date = moment().add('2', 'day').subtract(moment().hour(), 'hour').format();
            this._dueCustomers = [];
  
            this.dueReport.controls['fromDate'].setValue(null);
            this.dueReport.controls['toDate'].setValue(null);
          } else if (value == '3') {
            this.custom = true;
            this.getResponseAPI_Input.records[0].from_date = moment().format();
            this.getResponseAPI_Input.records[0].to_date = moment().add('7', 'days').format();
            this._dueCustomers = [];
  
            this.dueReport.controls['fromDate'].setValue(null);
            this.dueReport.controls['toDate'].setValue(null);
          } else if (value == '4') {
            this.custom = true;
            this.getResponseAPI_Input.records[0].from_date = moment().subtract(moment().date() , 'days').add('1', 'day').format();
            this.getResponseAPI_Input.records[0].to_date = moment().subtract(moment().date() , 'days').add('1', 'month').add('1', 'day').format();
            this._dueCustomers = [];
  
            this.dueReport.controls['fromDate'].setValue(null);
            this.dueReport.controls['toDate'].setValue(null);
          } else if (value == '5') {
            this.custom = false;
            // this.getResponseAPI_Input.records[0].fromDate = moment(this.collectionReport.controls['fromDate'].value).format('LLL');
            // this.getResponseAPI_Input.records[0].toDate = moment(this.collectionReport.controls['toDate'].value).format('LLL');
            this._dueCustomers = [];
  
          }
        }
      )
      this.filter();

  }
  onSubmit(value: any) {

    if (value.fromDate && value.toDate) {
      this.getResponseAPI_Input.records[0].from_date = moment(value.fromDate).add('331', 'minute');
      this.getResponseAPI_Input.records[0].to_date = moment(value.toDate).add('331', 'minute');
    }

    console.log(
      "%c ---------------------------- *****  API input ***** ---------------------------- ",
      "background: #ADF11A;color: black; font-weight: bold;"
    );
    console.log(JSON.stringify(this.getResponseAPI_Input));

    // make api call to fetch data ~ Start -----------------------
    this.callHttpPost.makeRequest_getDueReport(this.getResponseAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- ***** Manage Employee API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);

        // assign to local variable
        this._dueCustomers = response.dueReport

                
        if(this._dueCustomers.length > 0){
          
          //hide progress bar
          this.showProgressBar = false;
          this.showNoRecords = false;

          // assigning pdackDetails to table data
          this.filteredData = this._dueCustomers;
          this.filteredTotal = this._dueCustomers.length;
          this.filter();
        } 
        else {

          this.showProgressBar = false;
          this.showNoRecords = true;
          this._dueCustomers = [];

          console.log(
            "%c ---------------------------- *****  NO RESPONSE ***** ---------------------------- ",
            "background: #e57373 ;color: white; font-weight: bold;"
          );
        
        }

        
      }
    );


  }

  //  Local Functions ~ Start ________________________________________________________________________  
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
    let newData: any[] = this._dueCustomers;
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
    console.log('export clicked')
  }

}
