import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';

import { MeCallHttpPostService } from './../../Service/me-call-http-post.service'
import { PersistenceService } from 'angular-persistence';
import { StorageType } from "../../Service/Interfaces/storage-type.enum";
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import * as moment from 'moment';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';

// const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'app-me-gym-inactive-customers',
  templateUrl: './me-gym-inactive-customers.component.html',
  styleUrls: ['./me-gym-inactive-customers.component.scss']
})
export class MeGymInactiveCustomersComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'full_name', label: 'Customer Name', sortable: true, width: 200 },
    { name: 'email', label: 'Email', sortable: true, width: 200  },
    { name: 'phone', label: 'Phone', sortable: true, width: 150  },
    { name: 'pack_expiry_date', label: 'Expiry Date', sortable: true, width: 150  },
    { name: 'daysAgo', label: 'Expired', sortable: true, width: 200  },
    { name: 'customer_number', label: 'Action', sortable: true, width: 100},
    
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
        from_date: null,
        to_date: null

      }]
  }
  _inactiveCustomersList: any = [];

  inactiveCustomers: FormGroup;
  dateRange: AbstractControl;
  fromDate: AbstractControl;
  toDate: AbstractControl;
  custom: boolean = true;


  constructor(fb: FormBuilder,
    private _dataTableService: TdDataTableService,
    private callHttpPost: MeCallHttpPostService,
    private persistenceService: PersistenceService) {

    this.inactiveCustomers = fb.group({
      dateRange: [null, Validators.required],
      fromDate: [null],
      toDate: [null]
    });

    this.dateRange = this.inactiveCustomers.controls['dateRange'];
    this.fromDate = this.inactiveCustomers.controls['fromDate'];
    this.toDate = this.inactiveCustomers.controls['toDate'];
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
    this.getResponseAPI_Input.records[0].from_date = "2017-07-01";
    this.getResponseAPI_Input.records[0].to_date = moment();

    this.callHttpPost.makeRequest_getInactiveCustomers(this.getResponseAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;"
        );
        console.log(response);

        this._inactiveCustomersList = response.inactiveCustomers;

        this.filteredData = this._inactiveCustomersList;
        this.filteredTotal = this._inactiveCustomersList.length;
        this.filter();
      }
    )




    this.dateRange.valueChanges.subscribe(
      (value: string) => {
        if (value == '1') {
          this.custom = true;
          this.getResponseAPI_Input.records[0].from_date = moment().subtract(moment().hour(), 'hour').format();
          this.getResponseAPI_Input.records[0].to_date = moment().format();
          this._inactiveCustomersList = [];

          this.inactiveCustomers.controls['fromDate'].setValue(null);
          this.inactiveCustomers.controls['toDate'].setValue(null);
        } else if (value == '2') {
          this.custom = true;
          this.getResponseAPI_Input.records[0].from_date = moment().subtract('1', 'day').subtract(moment().hour(), 'hour').format();
          this.getResponseAPI_Input.records[0].to_date = moment().subtract(moment().hour(), 'hour').format();
          this._inactiveCustomersList = [];

          this.inactiveCustomers.controls['fromDate'].setValue(null);
          this.inactiveCustomers.controls['toDate'].setValue(null);
        } else if (value == '3') {
          this.custom = true;
          this.getResponseAPI_Input.records[0].from_date = moment().subtract('7', 'days').format();
          this.getResponseAPI_Input.records[0].to_date = moment().format();
          this._inactiveCustomersList = [];

          this.inactiveCustomers.controls['fromDate'].setValue(null);
          this.inactiveCustomers.controls['toDate'].setValue(null);
        } else if (value == '4') {
          this.custom = true;
          this.getResponseAPI_Input.records[0].from_date = moment().subtract(moment().date(), 'days').format();
          this.getResponseAPI_Input.records[0].to_date = moment().format();
          this._inactiveCustomersList = [];

          this.inactiveCustomers.controls['fromDate'].setValue(null);
          this.inactiveCustomers.controls['toDate'].setValue(null);
        } else if (value == '5') {
          this.custom = false;
          // this.getResponseAPI_Input.records[0].fromDate = moment(this.collectionReport.controls['fromDate'].value).format('LLL');
          // this.getResponseAPI_Input.records[0].toDate = moment(this.collectionReport.controls['toDate'].value).format('LLL');
          this._inactiveCustomersList = [];

        }
      }
    )

    this.filter();

    

    console.log(JSON.stringify(this.getResponseAPI_Input));







  }


  onSubmit(value: any) {

    if(value.fromDate && value.toDate) {
      this.getResponseAPI_Input.records[0].from_date = moment(value.fromDate).add('331', 'minute');
      this.getResponseAPI_Input.records[0].to_date = moment(value.toDate).add('331', 'minute');
     }

     console.log(
      "%c ---------------------------- *****  API input ***** ---------------------------- ",
      "background: #ADF11A;color: black; font-weight: bold;"
    );
    console.log(JSON.stringify(this.getResponseAPI_Input));

     this.callHttpPost.makeRequest_getInactiveCustomers(this.getResponseAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;"
        );
        console.log(response);

        this._inactiveCustomersList = response.inactiveCustomers;

        this.filteredData = this._inactiveCustomersList;
        this.filteredTotal = this._inactiveCustomersList.length;
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
    let newData: any[] = this._inactiveCustomersList;
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
      headers: ["Customer number", "Expiry Date", "Days Since Expiry", "Full Name", "Phone", "Email"]
    };

    new Angular5Csv(this._inactiveCustomersList, 'Inactive Customer Report', options);
  }

}
