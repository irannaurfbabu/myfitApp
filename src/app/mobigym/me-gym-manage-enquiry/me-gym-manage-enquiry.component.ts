import { RouterModule,NavigationExtras,Router } from "@angular/router";
import { Component, OnInit } from '@angular/core';

// import angular additional 
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';

// import additional library
import { PersistenceService } from 'angular-persistence';

// import services
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";


const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'app-me-gym-manage-enquiry',
  templateUrl: './me-gym-manage-enquiry.component.html',
  styleUrls: ['./me-gym-manage-enquiry.component.scss']
})
export class MeGymManageEnquiryComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'full_name',  label: 'Full name', width: 200 },
    { name: 'email', label: 'Email', width: { min: 150, max: 250 }},
    { name: 'phone', label: 'Phone', width: 150},
    { name: 'activity', label: 'Activity', width: 150},
    { name: 'registered_by', label: 'Registered By', width: 150},
    { name: 'registered_on', label: 'Registered On', width: 150},
    { name: 'enquiry_status', label: 'Status', width: 100},
    { name: 'enquiry_id', label: 'Edit', width: 150},
  ];

  showProgressBar: boolean = false;
  showNoRecords: boolean = false;
  filteredData   : any = [];
  filteredTotal  : any;
  searchBox      : any    = true;
  searchTerm     : string = '';
  fromRow        : number = 1;
  currentPage    : number = 1;
  sortBy         : string                  = 'full_name';
  selectedRows   : any[]                   = [];
  sortOrder      : TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  eventPageSize  : IPageChangeEvent;
  pageSize       : number = 50;

  basicData : any = [];
  configWidthColumns : ITdDataTableColumn[];
  getAPIResponseObject : any = {
    "records" : [{
      "owner_id" : null,
      "enquiry_id" : null
    }]
  }
  _ownerDetails : any;

  constructor(private callHttpPost : MeCallHttpPostService,
  private persistenceService : PersistenceService,
  private router                  : Router,
  private _dataTableService : TdDataTableService,
) { }

  ngOnInit() {

    this.showProgressBar = true; // show progress bar
    this.showNoRecords = false; //  

    
  
    this.basicData = [];
    this._ownerDetails = this.persistenceService.get("ownerDetails", StorageType.SESSION)
    this.getAPIResponseObject.records[0].owner_id = this._ownerDetails.owner_id;


    this.callHttpPost.makeRequest_getEnquiry(this.getAPIResponseObject).subscribe(
      (response) => {
        this.basicData = response.enquiry;

        if (this.basicData.length > 0){
          //hide progress bar
          this.showProgressBar = false;

          // assigning pdackDetails to table data
          this.filteredData = this.basicData;
          this.filteredTotal = this.basicData.length;
          this.filter();
        } else {
          this.showProgressBar = false;
          this.showNoRecords = true;

          console.log(
            "%c ---------------------------- *****  NO RESPONSE ***** ---------------------------- ",
            "background: #e57373 ;color: white; font-weight: bold;"
           );
        }
        console.log('*********API RESPONSE************', response);

      }

    )
    
  }



  CustomerLink(value){
    console.log('CustomerLink');
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "id": value,
          "Source": "manageenquiry"
      }
  };
  console.log('navigationExtras',navigationExtras);
  
  this.router.navigate(["createcustomer"], navigationExtras);
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
  let newData: any[] = this.basicData;
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
