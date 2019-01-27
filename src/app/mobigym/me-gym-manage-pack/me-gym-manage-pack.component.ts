/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR MANAGE PACK ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   12-JUN-2018 |   CREATED_BY  |   THAPAS
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Retrieve packs details for the owner. 
|      
|   
------------------------------------------------------------------------------------------------
## CHANGE LOG DETAILS 				##
------------------------------------------------------------------------------------------------
|   ++ 12-JUN-2018    v1.0     - Created the New Component.
|   ++
------------------------------------------------------------------------------------------------
*/

//>>>>> @details : Angular Core and Custom Imports  ##############################################
// Import ~ Start _________________________________________________________________________________
// import angular core 
import { Component, OnInit } from '@angular/core';

// import additional library
import { TdDataTableService, 
      TdDataTableSortingOrder, 
      ITdDataTableSortChangeEvent, 
      ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';
import { PersistenceService } from 'angular-persistence';

// import services
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";
import * as _ from 'lodash';

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

// Import ~ End _________________________________________________________________________________

//>>>>> @details : Component & Class Definition - Start #########################################

@Component({
  selector: 'app-me-gym-manage-pack',
  templateUrl: './me-gym-manage-pack.component.html',
  styleUrls: ['./me-gym-manage-pack.component.scss']
})
export class MeGymManagePackComponent implements OnInit {
         
//>>>>> @details - Class variable declaration ~ Start ___________________________________________
  columns: ITdDataTableColumn[] = [
    { name: 'pack_name',  label: 'Plan Name', sortable: true, width: 250 },
    { name: 'pack_duration',  label: 'Pack Duration', sortable: true, width: 200 },
    { name: 'base_price', label: 'Base Amount', filter: true, sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'sgst_amount', label: 'SGST',sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'cgst_amount', label: 'CGST', sortable: true,numeric: true, format: DECIMAL_FORMAT  },
    { name: 'total_tax', label: 'Total Tax',sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'total_amount', label: 'Total Amount', sortable: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'active', label: 'Status' },
    { name: 'pack_id', label: 'Action', sortable: false},
  ];

  // public variables
  showProgressBar: boolean = false; 
  showNoRecords: boolean = false;
  _packList      : any[] = [];  
  filteredData   : any = [];
  filteredTotal  : any;
  searchBox      : any    = true;
  searchTerm     : string = '';
  fromRow        : number = 1;
  currentPage    : number = 1;
  sortBy         : string                  = 'pack_name';
  selectedRows   : any[]                   = [];
  sortOrder      : TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  eventPageSize  : IPageChangeEvent;
  pageSize       : number = 50;

 // private variables
 private userDetails : any = "";
 private ownerDetails : any = "";
  private getResponseAPI_Input : any = {
    records : [{
      owner_id : null,
      expense_id  : null
    }]
  }

//>>>>> @details - Class variable declaration ~ End ___________________________________________

//>>>>> @details : Constructor ###############################################################
// Constructor ~ Start ________________________________________________________________________ 
constructor(
    private _dataTableService: TdDataTableService,
    private persistenceService   : PersistenceService,
    public  callHttpPost     : MeCallHttpPostService
  
  ) {



    }
// Constructor ~ End ________________________________________________________________________ 

//>>>>> @details : Constructor ###############################################################
// ngOnInit ~ Start ________________________________________________________________________
ngOnInit() {

    // set flags 
    this.showProgressBar = true; // show progress bar
    this.showNoRecords = false; //  

    // set variables
    this.userDetails =  this.persistenceService.get('userDetails', StorageType.SESSION);
    this.ownerDetails =  this.persistenceService.get('ownerDetails', StorageType.SESSION);

    console.log("--Cache Values--");
    console.log(this.userDetails);
    console.log(this.ownerDetails);
   
     // assign values to input object
     this.getResponseAPI_Input.records[0].owner_id = this.ownerDetails.owner_id;
     console.log(
       "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
       "background: #5e35b1;color: white; font-weight: bold;" );
     console.log( this.getResponseAPI_Input);
    
    // make api call to fetch data  
    this.callHttpPost.makeRequest_getPack(this.getResponseAPI_Input)
    .subscribe(
      (response) => {
        
        console.log(
          "%c ---------------------------- ***** Manage Pack API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);
         
         // assign to local variable
         this._packList = response.packList;

           
        if(this._packList.length > 0){
          
          //hide progress bar
          this.showProgressBar = false;
          _.forEach(this._packList, function(value) {
            value.duration = value.pack_duration + " " + value.pack_duration_desc;
          })

          // assigning pdackDetails to table data
          this.filteredData = this._packList;
          this.filteredTotal = this._packList.length;
          this.filter();
        } 
        else {

          this.showProgressBar = false;
          this.showNoRecords = true;

          console.log(
            "%c ---------------------------- *****  NO RESPONSE ***** ---------------------------- ",
            "background: #e57373 ;color: white; font-weight: bold;"
           );
         
        }

      });
  }
// ngOnInit ~ End ________________________________________________________________________

//>>>>> @details : // Local Functions ###############################################################
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

  filter(): void {
    let newData: any[] = this._packList;
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
    
//  Local Functions ~ End ________________________________________________________________________

}
// ###################################  Component & Class Definition - End ###################################