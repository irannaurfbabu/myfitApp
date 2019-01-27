import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';

import { MeCallHttpPostService } from './../../Service/me-call-http-post.service'
import { PersistenceService } from 'angular-persistence';
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";

// const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);
@Component({
  selector: 'app-me-gym-manage-complaints',
  templateUrl: './me-gym-manage-complaints.component.html',
  styleUrls: ['./me-gym-manage-complaints.component.scss']
})
export class MeGymManageComplaintsComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'complaint_id',  label: 'Complaint Id', sortable: true, width: 100 },
    { name: 'customer_id',  label: 'Customer Id', sortable: true, width: 150 },
    { name: 'customer_name',  label: 'Customer Name', sortable: true, width: 150 },
    { name: 'complain_title', label: 'Complaint Title', filter: true, sortable: false },
    { name: 'complaint_description', label: 'Description', hidden: false },
    { name: 'complaint_status', label: 'Status', sortable: true, width: 150 },
    { name: 'complaint_date', label: 'Date'},
    { name: 'customer_number', label: 'Action', sortable: true, width: 150 },
  ];

  data: any[] = []; // see json data

  filteredData: any[];
  filteredTotal: number;

  _complaintsList : any = [];
  _ownerDetails  : any;

  searchBox: any = true;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;

  sortBy: string = 'customer_name';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  eventPageSize: IPageChangeEvent;
  pageSize: number = 50;
  private getResponseAPI_Input : any = {
    records : [
      {
      owner_id : null
      
    }]
  }

  constructor(private _dataTableService: TdDataTableService,
              private callHttpPost : MeCallHttpPostService,
            private persistenceService : PersistenceService) {}


  ngOnInit() {
    

    this.data =  [];
    this.filter();

    this._ownerDetails = this.persistenceService.get("ownerDetails", StorageType.SESSION);
        console.log('*********ownerId*********', this._ownerDetails.owner_id)
    this.getResponseAPI_Input.records[0].owner_id = this._ownerDetails.owner_id;
    console.log(JSON.stringify(this.getResponseAPI_Input))

    this.callHttpPost.makeRequest_getComplaints(this.getResponseAPI_Input).subscribe(
      (response) => {
        this._complaintsList = response.complaintList;
        console.log('***********Response***************',response);
        console.log('***********complaintList**************', this._complaintsList);
        
        this.filteredData = this._complaintsList;
        this.filteredTotal = this._complaintsList.length;
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
    let newData: any[] = this._complaintsList;
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

}
