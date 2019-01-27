/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR MANAGE EXPENSE ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   12-JUN-2018 |   CREATED_BY  |   THAPAS
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Retrieve expense details for the owner. 
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
import { Component, OnInit } from "@angular/core";

// import angular additional
import {
  TdDataTableService,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent,
  ITdDataTableColumn
} from "@covalent/core/data-table";
import { IPageChangeEvent } from "@covalent/core/paging";

// import services
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { PersistenceService } from 'angular-persistence';
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

// Import ~ End _________________________________________________________________________________

//>>>>> @details : Component & Class Definition - Start #########################################

@Component({
  selector: "app-me-gym-manage-expense",
  templateUrl: "./me-gym-manage-expense.component.html",
  styleUrls: ["./me-gym-manage-expense.component.scss"]
})
export class MeGymManageExpenseComponent implements OnInit {
	
		
  //>>>>> @details - Class variable declaration ~ Start ___________________________________________

  columns: ITdDataTableColumn[] = [
    { name: "category", label: "Expense Category", sortable: true, width: 150  },
    { name: "subcategory", label: "Sub-Category", filter: true, sortable: true,width: 150 },
    { name: "expense_date", label: "Expense Date",filter: true, sortable: true,width: 150 },
    { name: "base_price", label: "Base Price", numeric: true, format: DECIMAL_FORMAT },
    { name: "cgst_amount", label: "CGST", numeric: true, format: DECIMAL_FORMAT },
    { name: "sgst_amount", label: "SGST", numeric: true,  format: DECIMAL_FORMAT },
    { name: "total_tax", label: "Total Tax", numeric: true, format: DECIMAL_FORMAT },
    { name: "total_amount", label: "Total Amount", numeric: true, format: DECIMAL_FORMAT  },
    { name: "expense_id", label: "Action", numeric: true, format: DECIMAL_FORMAT  }
  ];

  // public variables
  showProgressBar: boolean = false;
  showNoRecords: boolean = false;
  _expenseList   : any = [];
  filteredData   : any = [];
  filteredTotal  : any;
  searchBox      : any = true;
  searchTerm     : string = "";
  fromRow        : number = 1;
  currentPage    : number = 1;
  sortBy         : string = "expense_date";
  selectedRows   : any[] = [];
  sortOrder      : TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  eventPageSize  : IPageChangeEvent;
  pageSize       : number = 50;
  _ownerDetails  : any;

  // private variables
  private getResponseAPI_Input : any = {
    records : [{
      owner_id : null,
      expense_id  : null
    }]
  }

  //>>>>> @details - Class variable declaration ~ End ___________________________________________

  // filteredData: any[] = this._expenseList;
  // filteredTotal: number = this._expenseList.length;

  //>>>>> @details : Constructor ###############################################################
  // Constructor ~ Start ________________________________________________________________________
  constructor(
    private _dataTableService: TdDataTableService,
    public  callHttpPost     : MeCallHttpPostService,
    private manageExpensePersistenceService    : PersistenceService
  ) {}
  // Constructor ~ End ________________________________________________________________________

  //>>>>> @details : ngOnInit ###############################################################
  // ngOnInit ~ Start ________________________________________________________________________
  ngOnInit() {
    // set flags
    this.showProgressBar = true; // show progress bar
    this.showNoRecords = false; //  

    this._ownerDetails = this.manageExpensePersistenceService.get("ownerDetails", StorageType.SESSION);
        console.log('*********ownerId*********', this._ownerDetails.owner_id)
  
    // assign values to input object
    this.getResponseAPI_Input.records[0].owner_id = this._ownerDetails.owner_id;
    console.log(
      "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
      "background: #5e35b1;color: white; font-weight: bold;" );
    console.log( this.getResponseAPI_Input);


    this.callHttpPost
      .makeRequest_getExpense( this.getResponseAPI_Input)
      .subscribe(response => {
       
        console.log(
          "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);

        // assign to local variable
        this._expenseList = response.expenseList;
        
        if(this._expenseList.length > 0){
          
          //hide progress bar
          this.showProgressBar = false;

          // assigning pdackDetails to table data
          this.filteredData = this._expenseList;
          this.filteredTotal = this._expenseList.length;
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



         // hide progress bar
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
    let newData: any[] = this._expenseList;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return (
          (column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false)
        );
      })
      .map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(
      newData,
      this.searchTerm,
      true,
      excludedColumns
    );
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(
      newData,
      this.sortBy,
      this.sortOrder
    );
    newData = this._dataTableService.pageData(
      newData,
      this.fromRow,
      this.currentPage * this.pageSize
    );
    this.filteredData = newData;
  }

  changePageSize(event: IPageChangeEvent): void {
    this.eventPageSize = event;
  }
//  Local Functions ~ End ________________________________________________________________________  
  
}
// ###################################  Component & Class Definition - End ###################################
