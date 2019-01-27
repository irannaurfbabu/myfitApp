/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR MANAGE CUSTOMER ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   12-JUN-2018 |   CREATED_BY  |   THAPAS
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Retrieve packs details for the customer. 
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
import  swal  from 'sweetalert2';


const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

// Import ~ End _________________________________________________________________________________

//>>>>> @details : Component & Class Definition - Start #########################################
@Component({
  selector: 'app-me-gym-manage-customer',
  templateUrl: './me-gym-manage-customer.component.html',
  styleUrls: ['./me-gym-manage-customer.component.scss']
})
export class MeGymManageCustomerComponent implements OnInit {
//>>>>> @details - Class variable declaration ~ Start ___________________________________________
  columns: ITdDataTableColumn[] = [
    { name: 'customer_id',  label: 'CustomerId', sortable: true, width: 200 },
    { name: 'full_name',  label: 'Name', sortable: true, width: 200 },
    { name: 'active_packs', label: 'Active Packs', sortable: true, width: 150 },
    { name: 'phone', label: 'Phone', sortable: true, width: 250 },
    { name: 'Bal', label: 'Available Balance', sortable: true, width: 200, format: DECIMAL_FORMAT },
    { name: 'active', label: 'Status', width: 100 },
    { name: 'customer_number', label: 'Action', sortable: true, width: 200 },
  ];


   // public variables
   showProgressBar: boolean = false; 
   showNoRecords: boolean = false;
   _customerList  : any[] = [];  
   filteredData   : any = [];
   filteredTotal  : any;
   searchBox      : any    = true;
   searchTerm     : string = '';
   fromRow        : number = 1;
   currentPage    : number = 1;
   sortBy         : string = 'customer_id';
   selectedRows   : any[]  = [];
   sortOrder      : TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
   eventPageSize  : IPageChangeEvent;
   pageSize       : number = 50;

  // private variables
  private userDetails : any = "";
  private ownerDetails : any = "";
  private getResponseAPI_Input : any = {
    records : [{
      owner_id : null,
      customer_number : null
    }]
  }
  _activePacks : any = [];
  _paymentHistory : any = [];
 

//>>>>> @details - Class variable declaration ~ End ___________________________________________

//>>>>> @details : Constructor ###############################################################
// Constructor ~ Start ________________________________________________________________________ 
  constructor(
    private _dataTableService : TdDataTableService,
    private persistenceService: PersistenceService,
    public  callHttpPost      : MeCallHttpPostService
  ) {


  }

// Constructor ~ End ________________________________________________________________________ 


//>>>>> @details : ngOnInit ###############################################################
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
    this.callHttpPost.makeRequest_getCustomerDetails(this.getResponseAPI_Input)
    .subscribe(
      (response) => {
        
        console.log(
          "%c ---------------------------- ***** Get Customer Details API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);
         
         // assign to local variable
         this._customerList = response.customerDetails;

           
        if(this._customerList.length > 0){
          
          //hide progress bar
          this.showProgressBar = false;

          // assigning pdackDetails to table data
          this.filteredData = this._customerList;
          this.filteredTotal = this._customerList.length;
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


//>>>>> @details : // Local Functions ####################################################
//  Local Functions ~ Start ______________________________________________________________

getActivePacks(customer_number : any) {
  console.log('Get Active Packs clicked with customer number: ', customer_number);

  this.getResponseAPI_Input.records[0].owner_id = this.ownerDetails.owner_id;
  this.getResponseAPI_Input.records[0].customer_number = customer_number;

  this.callHttpPost.makeRequest_getCustomerPacks(this.getResponseAPI_Input).subscribe(
    (response) => {
      this._activePacks = response.packsSubscribed
      this._activePacks = this._activePacks.filter(
        (object) => {
          return object.expiringIn >= 0;
        }
      )
    }

  )
}

extendService() {
  console.log('Extention of Service is taking place');
  
}

getPaymentHistory(customer_number : any) {

  this.getResponseAPI_Input.records[0].owner_id = this.ownerDetails.owner_id;
  this.getResponseAPI_Input.records[0].customer_number = customer_number;
  this.callHttpPost.makeRequest_getPaymentHistory(this.getResponseAPI_Input).subscribe(
    (response) => {
      this._paymentHistory = response.paymentDetails;
      console.log('************PaymentHistory************', this._paymentHistory)
    }
  )

  console.log('Get Payment History Clicked with customer number value: ', customer_number);


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


  filter(): void {
    let newData: any[] = this._customerList;
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