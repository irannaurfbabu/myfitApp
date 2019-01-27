/*
____________________________________________________________________________________________________________
## POST SERVICE FOR VARIOUS DATA STORE & DATA SERVICES ##
------------------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   17-MAY-2018 |   CREATED_BY  |   PRIYANK
------------------------------------------------------------------------------------------------------------
## SERVICE FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------------------
|   ++ HTTP Service to post Pack Data
------------------------------------------------------------------------------------------------------------
## CHANGE LOG DETAILS 				##
------------------------------------------------------------------------------------------------------------
|   ++ 17-MAY-2018    v1.0     - Created the New Service.
|   ++
____________________________________________________________________________________________________________

*/

// -- @details : Built and Custom Imports  #################################################################
//  ~ Start  -----------------------------------------------------------------------------------------------
// Import Angular Core Libraries/Functionalities

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/observable";
import { map } from "rxjs/operators";

// -------------------  Injectable & Class Definition - Start ------------------------------------------------

@Injectable()
export class MeCallHttpPostService {

  // Request Variables
  private headers = new Headers();
  private options = new RequestOptions({ headers: this.headers });

  API_URL : string = "https://80zmgji780.execute-api.ap-south-1.amazonaws.com/prod/mobifit-"

 //  ~ End  --------------------------------------------------------------------------------------------------


  // --  @details :  constructor #################################################################################
  //  ~ Start  ---------------------------------------------------------------------------------------------------

  constructor(private http : Http) { 
    this.headers.set("Content-Type", "application/json");
    this.headers.set("x-api-key", "wm0zlsgXu5aklsjN4sLnq8PI4vQuQhcB8fZ1h3IJ");
  
  }
 //  ~ End  -----------------------------------------------------------------------------------------------------


 // --  @details :  HTTP Post Function for Pack List for a Owner #############################################
 // makeRequest_ManagePack() -- Start ---------------------------------------------------------------------------

  makeRequest_managePack(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + "managePack", JSON.stringify(input_record), this.options)
    .pipe(map(response =>  response.json()));
  } 
    
  makeRequest_getPack(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + "getpack", JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_manageEmployee(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'manageEmployee', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getEmployee(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getEmployee', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_manageExpense(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'manageExpense', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getExpense(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getExpense', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }
   

  makeRequest_validateUser(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getUserValidate', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }
   
  makeRequest_getCustomerList(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getCustomerList', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }
   
  makeRequest_getUserProfile(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getUserProfileList', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }
   
  makeRequest_getDailyExpenseTrend(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getDailyExpenseTrend', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getDailyCollectionTrend(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getDailyCollectionTrend', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }
   
   
  makeRequest_getCustomerBalance(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getCustomerBalance', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }
   
  makeRequest_managePayments(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'managePayments', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_manageCustomer(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'manageCustomer', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }
   
     
  makeRequest_getCustomerPacks(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getCustomerpacks', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getAttendance(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getAttendance', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getEmpAttendance(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getEmpAttendance', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getPopularPacks(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getPopularPacks', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_manageComplaints(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'manageComplaints', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getComplaints(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getComplaints', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getComplaintDetails(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getComplaintDetails', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getComplainTitles(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getComplainTitles', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getThisMonthCollection(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getThisMonthCollection', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getThisMonthExpense(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getThisMonthlyExpense', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getActiveCustomers(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getActiveCustomers', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getCollectionSummary(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getCollectionSummary', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getRenewalPending(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getRenewalPending', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getCustomerDetails(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getCustomerDetails', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getRenewalDetails(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getRenewalDetails', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getExpiringCustomers(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getExpiringCustomers', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getEnquiry(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getEnquiry', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getComplaintNumber(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getComplaintNumber', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_manageEnquiry(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'manageEnquiry', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_smsConfirmation(input_record: any) : Observable<any> {
    return this.http.post('https://gxk7f7615b.execute-api.us-west-2.amazonaws.com/production/transactionSms', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getEnquiryFollowup(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getEnquiryFollowup', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getInactiveCustomers(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getInactiveCustomers', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getNewCustomerReport(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getNewCustomerReport', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getDueReport(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getDueReport', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getEnquiryNum(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getEnquiryNum', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getPaymentHistory(input_record: any) : Observable<any> {
    return this.http.post('https://80zmgji780.execute-api.ap-south-1.amazonaws.com/prod/mobifit_getPaymentHistory', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }

  makeRequest_getDueAmount(input_record: any) : Observable<any> {
    return this.http.post(this.API_URL + 'getDueAmount', JSON.stringify(input_record), this.options)
    .pipe(map(response => response.json()));
  }
  


}
