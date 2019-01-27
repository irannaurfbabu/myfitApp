/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR HOME PAGE ##
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
import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

// import additional library
import { PersistenceService } from 'angular-persistence';
import * as _ from 'lodash';
import * as moment from 'moment';



// import services
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { StorageType } from "../../Service/Interfaces/storage-type.enum";

// Import ~ End _________________________________________________________________________________

//>>>>> @details : Component & Class Definition - Start #########################################

@Component({
  selector: 'app-me-gym-home',
  templateUrl: './me-gym-home.component.html',
  styleUrls: ['./me-gym-home.component.scss']
})
export class MeGymHomeComponent implements OnInit {

  //>>>>> @details - Class variable declaration ~ Start _________________________________________________________________

  columns: ITdDataTableColumn[] = [
    { name: 'customer_id', label: 'Customer Id', sortable: true, width: 250 },
    { name: 'full_name', label: 'Customer Name', sortable: true, width: 250 },
    { name: 'pack_name', label: 'Pack Name', sortable: true, width: 250 },
    { name: 'expiry_date', label: 'Expiry Date', sortable: true, width: 250 },
    { name: 'daysRemaining', label: 'Days Remaining', sortable: true, width: 250 },
  
  ];


  filteredData: any[];
  filteredTotal: number;

  searchBox: any = true;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;

  sortBy: string = 'full_name';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  eventPageSize: IPageChangeEvent;
  pageSize: number = 50;

  // public variables
  user_login_id: any = "";
  _popularPacks: any = [];
  _renewalPending : any = [];
  renewalDetails : any = [];
    _custAttendance: any = [];
  renewalArray : any = [];
  _empAttendance: any = [];
  _complaintCount : any = [];
  _monthlyCollection : any = [];
  collection : any;
  _monthlyExpense : any = [];
  _dueAmount : any = [];
  dueAmount : any = 0;
  expense : any;
  _activeCustomers : any = [];
  activeCustomers : any;
  _complaintDetails : any = [];
  numTotal : any;
  numRegistered : any ;
  percentRegistered : any;
  numAssigned  : any;
  percentAssigned : any;
  numInprogress: any;
  percentInprogress: any;
  numCancelled : any;
  percentCancelled : any;
  numClosed : any;
  percentClosed : any;
  expiring_date : any;
  _expiringCustomers : any = [];
  count : number = 0;
  custCount : number = 0;

  // flags
  showExpenseTrendLoader: boolean = false;
  showNoExpenseTrendData: boolean = false;

  showCollectionTrendLoader: boolean = false;
  showNoCollectionTrendData: boolean = false;

  public customerLabel: any = [];
  public employeeLabel: any = [];

  customerData: any = [];
  employeeData: any = [];


  // bar chart variables ----------------------------------------------------------------
  public lineChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public lineChartType: string = 'line';
  public lineChartLegend: boolean = true;

  public expenseBarChartLabels: string[] = [];
  public expenseBarChartData: any[] = [
    {
      data: [],
      label: 'Expense'
    }
  ];

  public collectionBarChartLabels: string[] = [];
  public collectionBarChartData: any[] = [
    {
      data: [],
      label: 'Collection'
    }
  ];

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [], label: "Customers" }
  ];

  // Pie
  public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: string = 'pie';

  // Doughnut
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType: string = 'doughnut';

  // pie-grid
  // pie-grid - options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  single = [
    {
      "name": "Registered",
      "value": 15
    },
    {
      "name": "Assigned",
      "value": 10
    },
    {
      "name": "Inprogress",
      "value": 15
    },
    {
      "name": "Closed",
      "value": 35
    },
    {
      "name": "Cancelled",
      "value": 20
    }
  ];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // Private Local Variables
  private _userProfile: any = [];
  private _expenseTrend: any = [];
  private _collectionTrend: any = [];
  private getUserProfileAPI_Input: any = {
    records: [
      {
        user_login_id: null
      }
    ]
  };
  private getExpenseAPI_Input: any = {
    records: [
      {
        owner_id: null
      }
    ]
  };
  private getCustomerExpiryAPI_Input: any = {
    records: [
      {
        owner_id: null,
        expiry_date: null
      }
    ]
  };
  // private getAttendenceAPI_Input: any = {
  //   records: [
  //     {
  //       owner_id: null
  //     }
  //   ]
  // };

  ownerDetails: any;


  //>>>>> @details - Class variable declaration ~ End _________________________________________________________________


  //>>>>> @details : Constructor ###############################################################
  // Constructor ~ Start ________________________________________________________________________
  constructor(
    private persistenceService: PersistenceService,
    public callHttpPost: MeCallHttpPostService,
    private _dataTableService : TdDataTableService
  ) {


  }
  // Constructor ~ End ________________________________________________________________________

  //>>>>> @details : ngOnInit ###############################################################
  // ngOnInit ~ Start ______________________________________________________________________
  ngOnInit() {

    // intialize flags
    this.showExpenseTrendLoader = true;
    this.showNoExpenseTrendData = false;

    console.log('----------cust attendence ----------', this._custAttendance)

    this.collection = 0;
    this.expense = 0;
    this.activeCustomers = 0;


    // fetch login id from cache
    this.user_login_id = this.persistenceService.get('userLoginID', StorageType.SESSION);

    console.log("--- User Login ID ---");
    console.log(this.user_login_id);

    // set get request input value
    this.getUserProfileAPI_Input.records[0].user_login_id = this.user_login_id;
    console.log(
      "%c ---------------------------- ***** User Profile API INPUT ***** ---------------------------- ",
      "background: #5e35b1;color: white; font-weight: bold;");
    console.log(this.getUserProfileAPI_Input);

    // this.ownerDetails = this.persistenceService.get('ownerDetails', StorageType.SESSION)

    // console.log('***********ownerid*************', this.ownerDetails.owner_id);
    // this.getAttendenceAPI_Input.records[0].owner_id = this.ownerDetails.owner_id;
    // console.log('***********getAttendenceAPI_Input*************', JSON.stringify(this.getAttendenceAPI_Input));

    


    // this.callHttpPost.makeRequest_getAttendance(this.getAttendenceAPI_Input).subscribe(
    //   (response) => {

    //     console.log(
    //       "%c ---------------------------- *****  get Attendenct API RESPONSE ***** ---------------------------- ",
    //       "background: #ADF11A;color: black; font-weight: bold;");
    //     console.log(response);
    //     this._custAttendance = response.attendanceList

    //     let cusLabels: any = [];
    //     let cusData: any = [];

    //     if (this._custAttendance.length > 0) {
    //       _.forEach(this._custAttendance, function (value) {
    //         cusLabels.push(moment(value.date).format('MMM DD'))
    //         cusData.push(value.present)

    //       })

    //       this.customerLabel = cusLabels
    //       this.customerData = cusData
    //     }
    //     this.callHttpPost.makeRequest_getEmpAttendance(this.getAttendenceAPI_Input).subscribe(
    //       (response) => {

    //         console.log(
    //           "%c ---------------------------- *****  get Employee API RESPONSE ***** ---------------------------- ",
    //           "background: #ADF11A;color: black; font-weight: bold;");
    //         console.log(response);
    //         this._empAttendance = response.empAttendanceList

    //         let empLabels: any = []
    //         let empData: any = []
    //         if (this._empAttendance.length > 0) {
    //           _.forEach(this._empAttendance, function (value) {
    //             empLabels.push(moment(value.date).format('MMM DD'))
    //             empData.push(value.present)
    //           })

    //           this.employeeData = empData
    //           this.employeeLabel = empLabels
    //         }

    //         console.log('------employeelabel-----------------', this.employeeLabel)
    //         console.log('------customerlabel-----------------', this.customerLabel)
    //         console.log('------employeedata------------------', this.employeeData)
    //         console.log('------customerdata-------------------', this.customerData)

    //         if (this.customerLabel.length > this.employeeLabel.length) {
    //           this.barChartLabels = this.customerLabel
    //         } else {
    //           this.barChartLabels = this.employeeLabel
    //         }
    //         this.barChartData[0].data = this.customerData
    //         this.barChartData[1].data = this.employeeData
    //       }
    //     )

    //   }
    // )





    // make api call to fetch user profile data  
    this.callHttpPost.makeRequest_getUserProfile(this.getUserProfileAPI_Input)
      .subscribe(
        (response) => {

          console.log(
            "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
            "background: #ADF11A;color: black; font-weight: bold;");
          console.log(response);

          this._userProfile = response;

          if (this._userProfile.ownerDetails && this._userProfile.userDetails) {

            console.log(
              "%c ---------------------------- *****  PROFILE DETAILS ***** ---------------------------- ",
              "background: #FFF59D;color: black; font-weight: bold;");
            console.log(this._userProfile.ownerDetails);
            console.log(this._userProfile.userDetails);

            // Save the Input format in cache for use in other Components & Service - Using PersistenceService Service.
            this.persistenceService.set("ownerDetails", this._userProfile.ownerDetails, { type: StorageType.SESSION });
            this.persistenceService.set("userDetails", this._userProfile.userDetails, { type: StorageType.SESSION });

            this.getExpenseAPI_Input.records[0].owner_id = this._userProfile.ownerDetails.owner_id;
            this.getCustomerExpiryAPI_Input.records[0].owner_id = this._userProfile.ownerDetails.owner_id;



          }

          this.callHttpPost.makeRequest_getRenewalDetails(this.getExpenseAPI_Input).subscribe(
            (response) => {
              console.log(
                "%c ---------------------------- *****  Renewal details API RESPONSE ***** ---------------------------- ",
                "background: #ADF11A;color: black; font-weight: bold;");
              console.log(response);

              this.renewalDetails = response.renewalDetails;
              this.filteredData = this.renewalDetails;
              this.filteredTotal = this.renewalDetails.length;
              this.filter();
            }
          )

          this.callHttpPost.makeRequest_getComplaintNumber(this.getExpenseAPI_Input).subscribe(
            (response) => {
              console.log(
                "%c ---------------------------- *****  COMPLAINT NUMBER API RESPONSE ***** ---------------------------- ",
                "background: #ADF11A;color: black; font-weight: bold;");
              console.log(response);
              this._complaintCount = response.complaintCount;
              
              this._complaintCount.forEach(object => {
                this.count += object.count;
              });

              console.log('********count value is:*********', this.count);

              let registered : any ;
              registered = this._complaintCount.filter(
                (object: any) => {
                  return object.complaint_status == 'REGISTERED' 
                }
              )
              if (registered.length == 0){
                this.numRegistered = 0;
                this.percentRegistered = 0;
              }else {
                this.numRegistered = registered[0].count;
                this.percentRegistered = Math.round((this.numRegistered / this.count) * 100);
                console.log('********percentage registered***********', this.percentRegistered);
              }
              

              let assigned : any ;
              assigned = this._complaintCount.filter(
                (object: any) => {
                  return object.complaint_status == 'ASSIGNED' 
                }
              )
              if (assigned.length == 0){
                this.numAssigned = 0;
                this.percentAssigned = 0;
              }else {
                this.numAssigned = assigned[0].count;
                this.percentAssigned = Math.round((this.numAssigned / this.count) * 100);
              }
              

              let Inprogress : any ;
              Inprogress = this._complaintCount.filter(
                (object: any) => {
                  return object.complaint_status == 'IN-PROGRESS' 
                }
              )
              if (Inprogress.length == 0){
                this.numInprogress = 0;
                this.percentInprogress = 0;
              }else {
                this.numInprogress = Inprogress[0].count;
                console.log('in progress =============', this.numInprogress)
                this.percentInprogress = Math.round((this.numInprogress / this.count) * 100);
              }

              let cancelled : any ;
              cancelled = this._complaintCount.filter(
                (object: any) => {
                  return object.complaint_status == 'CANCELLED' 
                }
              )
              if (cancelled.length == 0){
                this.numCancelled = 0;
                this.percentCancelled = 0;
              }else {
                this.numCancelled = cancelled[0].count;
                this.percentCancelled = Math.round((this.numCancelled / this.count) * 100);
                
              }


              let closed : any ;
              closed = this._complaintCount.filter(
                (object: any) => {
                  return object.complaint_status == 'CLOSED' 
                }
              )
              if (closed.length == 0){
                this.numClosed = 0;
                this.percentClosed = 0;
              }else {
                this.numClosed = closed[0].count;
                this.percentClosed = Math.round((this.numClosed / this.count) * 100);
              }

            }
          )

          this.callHttpPost.makeRequest_getRenewalPending(this.getExpenseAPI_Input).subscribe(
            (response) => {
              console.log(
                "%c ---------------------------- *****  Renewal Pending API RESPONSE ***** ---------------------------- ",
                "background: #ADF11A;color: black; font-weight: bold;");
              console.log(response);
              this._renewalPending = response.renewalPending;

              let renewalLabel : any = [];
              let renewalData : any = [];
              let array : any = [];

              _.forEach(this._renewalPending, function(value){
                
                if (renewalLabel.length < 5){
                  renewalLabel.push(moment(value.pack_expiry_date).format('DD-MMM'));
                  renewalData.push(value.total);
                  array.push(value);
              
                }
                
                
                
              });
              this.renewalArray = array;
              this.barChartLabels = renewalLabel;
              this.barChartData[0].data = renewalData;
              console.log("-------- RenewalLabels & RenewalData --------");
                  console.log(this.barChartLabels);
                  console.log(this.barChartData[0].data);

              
            

              console.log("==========_RenewalPending============", this._renewalPending)
            
              }
          )

          // this.callHttpPost.makeRequest_getComplaintDetails(this.getExpenseAPI_Input).subscribe(
          //   (response) => {
          //     console.log(
          //       "%c ---------------------------- *****  Complaint Details API RESPONSE ***** ---------------------------- ",
          //       "background: #ADF11A;color: black; font-weight: bold;");
          //     console.log(response);

          //     this._complaintDetails = response.complaintDetails
              
          //   }
          // )

          // ******************* Expense Trend *************************

          this.callHttpPost.makeRequest_getThisMonthCollection(this.getExpenseAPI_Input).subscribe(
            (response) => {
              console.log(
                "%c ---------------------------- *****  Monthly Collection API RESPONSE ***** ---------------------------- ",
                "background: #ADF11A;color: black; font-weight: bold;");
              console.log(response);
              this._monthlyCollection = response.monthlyCollection;
              this.collection = this._monthlyCollection[0].collection;
            }
          )
      
          this.callHttpPost.makeRequest_getThisMonthExpense(this.getExpenseAPI_Input).subscribe(
            (response) => {
              console.log(
                "%c ---------------------------- *****  Monthly Expense API RESPONSE ***** ---------------------------- ",
                "background: #ADF11A;color: black; font-weight: bold;");
              console.log(response);
              this._monthlyExpense = response.monthlyExpense;
              this.expense = this._monthlyExpense[0].expense;
            }
          )

          this.callHttpPost.makeRequest_getDueAmount(this.getExpenseAPI_Input).subscribe(
            (response) => {
              console.log(
                "%c ---------------------------- *****  Monthly Due Amount RESPONSE ***** ---------------------------- ",
                "background: #ADF11A;color: black; font-weight: bold;");
              console.log(response);
              this._dueAmount = response.dueAmount;
              this.dueAmount = this._dueAmount[0].due;
            }
          )
      
          this.callHttpPost.makeRequest_getActiveCustomers(this.getExpenseAPI_Input).subscribe(
            (response) => {
              console.log(
                "%c ---------------------------- *****  Active Customers API RESPONSE ***** ---------------------------- ",
                "background: #ADF11A;color: black; font-weight: bold;");
              console.log(response);
              this._activeCustomers = response.activeCustomers;
              this._activeCustomers.forEach(object => {
                this.custCount += object.count;
                
              });
              // this.activeCustomers = this._activeCustomers.filter(
              //   (object) => {
              //     return object.active == 'Y'
              //   }
              // )[0].count
            
            }
          )

          // set get request input value

          // make api call to fetch user profile data  
          this.callHttpPost.makeRequest_getDailyExpenseTrend(this.getExpenseAPI_Input)
            .subscribe(
              (response) => {

                console.log(
                  "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
                  "background: #ADF11A;color: black; font-weight: bold;");
                console.log(response);

                // assign to local variable
                this._expenseTrend = response.ExpenseTrend;

                if (this._expenseTrend.length > 0) {


                  // declare variables to extract values 
                  let expenseLabels: any = [];
                  let expenseData: any = [];

                  console.log("-------- Values --------");
                  _.forEach(this._expenseTrend, function (value) {

                    console.log(value);
                    expenseLabels.push(value.expense_date);
                    expenseData.push(value.total_amount);

                  });

                  console.log("-------- expenseLabels & expenseData --------");
                  console.log(expenseLabels);
                  console.log(expenseData);

                  console.log("-------- expense Before --------");
                  console.log(this.expenseBarChartLabels);
                  console.log(this.expenseBarChartData);

                  // assign to chart variables
                  this.expenseBarChartLabels = expenseLabels.reverse();
                  this.expenseBarChartData[0].data = expenseData.reverse();

                  console.log("-------- expense After --------");
                  console.log(this.expenseBarChartLabels);
                  console.log(this.expenseBarChartData);


                  //hide progress bar
                  this.showExpenseTrendLoader = false;


                }
                else {

                  //hide progress bar
                  this.showExpenseTrendLoader = false;
                  this.showNoExpenseTrendData = true;

                  console.log(
                    "%c ---------------------------- *****  EXPENSE TREND - NO RESPONSE ***** ---------------------------- ",
                    "background: #e57373 ;color: white; font-weight: bold;"
                  );

                }

                this.callHttpPost.makeRequest_getPopularPacks(this.getExpenseAPI_Input).subscribe(
                  (response) => {
                    console.log(
                      "%c ---------------------------- *****  TOP PACKS API RESPONSE ***** ---------------------------- ",
                      "background: #ADF11A;color: black; font-weight: bold;");

                    this._popularPacks = response.popularPackList;
                    console.log(this._popularPacks);

                  }
                )

              });


          // ******************* Expense Trend *************************

          // ******************* Collection Trend *************************
          // make api call to fetch user profile data  
          this.callHttpPost.makeRequest_getDailyCollectionTrend(this.getExpenseAPI_Input)
            .subscribe(
              (response) => {

                console.log(
                  "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
                  "background: #ADF11A;color: black; font-weight: bold;");
                console.log(response);

                // assign to local variable
                this._collectionTrend = response.CollectionTrend;

                if (this._collectionTrend.length > 0) {


                  // declare variables to extract values 
                  let collectionLabels: any = [];
                  let collectionData: any = [];

                  console.log("-------- Values --------");
                  _.forEach(this._collectionTrend, function (value) {

                    console.log(value);
                    collectionLabels.push(value.expense_date);
                    collectionData.push(value.total_amount);

                  });

                  console.log("-------- collectionLabels & collectionData --------");
                  console.log(collectionLabels);
                  console.log(collectionData);

                  console.log("-------- collection Before --------");
                  console.log(this.collectionBarChartLabels);
                  console.log(this.collectionBarChartData);

                  // assign to chart variables
                  this.collectionBarChartLabels = collectionLabels.reverse();
                  this.collectionBarChartData[0].data = collectionData.reverse();

                  console.log("-------- collection After --------");
                  console.log(this.collectionBarChartLabels);
                  console.log(this.collectionBarChartData);


                  //hide progress bar
                  this.showExpenseTrendLoader = false;


                }
                else {

                  //hide progress bar
                  this.showExpenseTrendLoader = false;
                  this.showNoExpenseTrendData = true;

                  console.log(
                    "%c ---------------------------- *****  Collection Trend TREND - NO RESPONSE ***** ---------------------------- ",
                    "background: #e57373 ;color: white; font-weight: bold;"
                  );

                }

              });



          // ******************* Collection Trend *************************






        });













  }
  // ngOnInit ~ End ________________________________________________________________________

  public getCustomers(expiryDate : any) {
    console.log(moment(expiryDate).format());

    this.getCustomerExpiryAPI_Input.records[0].expiry_date = expiryDate;
    console.log('*******Api Input********', this.getCustomerExpiryAPI_Input);

    this.callHttpPost.makeRequest_getExpiringCustomers(this.getCustomerExpiryAPI_Input).subscribe(
      (response) => {
        this._expiringCustomers = response.customerExpiring;
        console.log('***********API RESPONSE**************', this._expiringCustomers);
      }
    )
  }

  public randomize(): void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    console.log(data);
    // let clone = JSON.parse(JSON.stringify(this.barChartData));
    // clone[0].data = data;
    // this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
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
    let newData: any[] = this.renewalDetails;
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
// ###################################  Component & Class Definition - End ###################################