/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR MANAGE EMPLOYEE ##
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

// import angular additional 
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';

// import additional library
import { PersistenceService } from 'angular-persistence';

// import services
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";

// const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

// Import ~ End _________________________________________________________________________________


//>>>>> @details : Component & Class Definition - Start #########################################
@Component({
  selector: 'app-me-gym-manage-employees',
  templateUrl: './me-gym-manage-employees.component.html',
  styleUrls: ['./me-gym-manage-employees.component.scss']
})
export class MeGymManageEmployeesComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'first_name',  label: 'First Name', sortable: true, width: 150 },
    { name: 'last_name', label: 'Last Name', filter: true, sortable: false },
    { name: 'phone', label: 'Contact Number', width: 200 },
    { name:  'job_role', label: 'Role', sortable: true, width: 150},
    { name: 'gender_desc', label: 'Gender', hidden: false },
    { name: 'email', label: 'Email', sortable: true, width: 250 },
    { name: 'active', label: 'Status' },
    { name: 'employee_id', label: 'Action', width: 100, sortable: false},
    
  ];

  // public variables
  showProgressBar: boolean = false;
  showNoRecords: boolean = false;
  _employeeList: any  = []; // see json data
  filteredData   : any = [];
  filteredTotal  : any;
  searchBox      : any    = true;
  searchTerm     : string = '';
  fromRow        : number = 1;
  currentPage    : number = 1;
  sortBy         : string                  = 'first_name';
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
    private _dataTableService : TdDataTableService,
    private persistenceService: PersistenceService,
    private callHttpPost      : MeCallHttpPostService
  ) {}

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
     this.getResponseAPI_Input.records[0].owner_id =  this.ownerDetails.owner_id;
     console.log(
       "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
       "background: #5e35b1;color: white; font-weight: bold;" );
     console.log( this.getResponseAPI_Input);

    // make api call to fetch data ~ Start -----------------------
    this.callHttpPost.makeRequest_getEmployee(this.getResponseAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- ***** Manage Employee API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);

        // assign to local variable
        this._employeeList = response.employeeList

                
        if(this._employeeList.length > 0){
          
          //hide progress bar
          this.showProgressBar = false;

          // assigning pdackDetails to table data
          this.filteredData = this._employeeList;
          this.filteredTotal = this._employeeList.length;
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

        
      }
    );
    // make api call to fetch data ~ End -----------------------
    
     

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

  // showAlert(event: any): void {
  //   let row: any = event.row;
  //   // .. do something with event.row
  // }

  filter(): void {
    let newData: any[] = this._employeeList;
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