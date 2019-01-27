/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR COLLECT ADVANCE OR MAKE REVERSAL ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   21-JUN-2018 |   CREATED_BY  |   THAPAS
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Ability to add balance. 
|   ++ Ability to add reversal. 
|      
|   
------------------------------------------------------------------------------------------------
## CHANGE LOG DETAILS 				##
------------------------------------------------------------------------------------------------
|   ++ 21-JUN-2018    v1.0     - Created the New Component.
|   ++
------------------------------------------------------------------------------------------------
*/

//>>>>> @details : Angular Core and Custom Imports  ##############################################
// Import ~ Start _________________________________________________________________________________

// Import Angular Core 
import { Component, OnInit, NgZone } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, AbstractControl, Validators, FormGroup } from "@angular/forms";

// Import Additional Libraries 
import { PersistenceService } from 'angular-persistence';
import swal from "sweetalert2";
import { MeDisplayDropdownListService } from '../../Service/me-display-dropdown-list.service';
// import * as _ from 'lodash'; 

// Import Services
import { MeCalculatePackPriceService } from "../../Service/me-calculate-pack-price.service";
import { MeValidateFormFieldsService } from "../../Service/me-validate-form-fields.service";
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
// import { MeDisplayDropdownListService } from '../../Service/me-display-dropdown-list.service';
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";



// Import ~ End _________________________________________________________________________________

//>>>>> @details : Component & Class Definition - Start #########################################
@Component({
  selector: 'app-me-gym-add-balan-rvrsl',
  templateUrl: './me-gym-add-balan-rvrsl.component.html',
  styleUrls: ['./me-gym-add-balan-rvrsl.component.scss']
})
export class MeGymAddBalanRvrslComponent implements OnInit {


//>>>>> @details - Class variable declaration ~ Start _______________________________________

// Form Group
addBalancRvrsl: FormGroup;

// form columns
amount : AbstractControl
remarks : AbstractControl
due_date : AbstractControl
payment_mode : AbstractControl

// public variables
displayCustomerName   : string = "None";
displayCustomerID     : string = "None";
displayPhone          : string = "None";
displayAddress        : string = "None";
displayCustomerStatus : string = "None";

displayOldAvlBalance : any = "0";
displayAdvaneAmount : any = "0";
displayNewAvlBalance : any = "0";
displayDueDate      : any ;

availableBalance     : any  = "";
_paymentMode : any = [];


isActive   : boolean = false;
isInactive : boolean = false;
isDisabled : boolean = false;

// Private Local Variables
private _customerDetailsObj : any = "";
private _customerBalanceObj : any = "";


private userDetails : any = "";
private ownerDetails : any = "";
private customer_number_param : any = "";
private formJSONValue : any = {};
private currentDate  = new Date().toString();
private postRequestObject : any = {
  "records": [
    {
      "payment_details": {
        "created_by": null,
        "created_on": null,
        "modified_by": null,
        "modified_on": null,
        "payment_date": null,
        "payment_mode": "CASH",
        "due_date"    : null,
        "due_amount"  : null,
        "payment_type": null,
        "created_by_id": null,
        "modified_by_id": null,
        "payment_action": null,
        "payment_amount": null,
        "payment_remarks": null
      },
      "customer_details": {
        "user_id": null,
        "owner_id": null,
        "customer_id": null,
        "customer_number": null
      }
    }
  ]
}

private getCustomerDetailsAPI_Input : any = {
  records : [{
    owner_id       : null,
    customer_number: null
  }]
}



 //>>>>> @details - Class variable declaration ~ End ________________________________________ 

//>>>>>  @details :  constructor ############################################################
//  ~ Start - constructor ___________________________________________________________________
  constructor(
     fb                : FormBuilder,
    public  callHttpPost      : MeCallHttpPostService,
    private validateFields    : MeValidateFormFieldsService,
    public  calculatePrice    : MeCalculatePackPriceService,
    private persistenceService: PersistenceService,
    private displayDropDown   : MeDisplayDropdownListService,
    public  zone              : NgZone,
    public  router            : Router,
    public  route             : ActivatedRoute
  ) { 

        /*
@details -  Intialize the form group with fields
++ The fields are set to default values - in below case to - null.
++ The fields are assigned validators
** Required Validator
*/
this.addBalancRvrsl = fb.group({ 
  amount         : [null, Validators.required],
  remarks         : [null],
  due_date        : ['',] ,
  payment_mode     : ['']
});

// Assign form controls to private variables
// Controls are used in me-create-area.component.html for accessing values and checking functionalities
this.amount     = this.addBalancRvrsl.controls["amount"];
this.remarks    = this.addBalancRvrsl.controls["remarks"];
this.due_date    = this.addBalancRvrsl.controls["due_date"];
this.payment_mode    = this.addBalancRvrsl.controls["payment_mode"];


    //subscribe for add balance value channge
    this.amount.valueChanges.subscribe((value: string) => {
      console.log(
        "%c ------------------  Event Change amount ------------------",
        "background: green; color: white; display: block;" 
      );
      console.log("Amount Value:", value);
      
      if(value)   {
        this.displayAdvaneAmount = value;
        this.displayNewAvlBalance = parseFloat(this.availableBalance) + parseFloat(value);
        if(this.displayNewAvlBalance < 0){
          this.isDisabled = false;
        }else {
          this.isDisabled = true;
          this.addBalancRvrsl.controls['due_date'].setValue('');
        }
      }
      else {
        this.displayNewAvlBalance = "0";
        this.displayAdvaneAmount = "0";
        this.addBalancRvrsl.controls['due_date'].setValue('');
        this.isDisabled = true;
      }
 

    });




 } //  ~ End - constructor __________________________________________________________________



//>>>>>  @details :  ngOnInit ###############################################################
//  ~ Start - ngOnInit ______________________________________________________________________
  ngOnInit() {

  // assign drop down values
  this.customer_number_param = +this.route.snapshot.params["id"];
  console.log("---- --- --- Customer Number Received ---- --- ---");
  console.log(this.customer_number_param);  

  this._paymentMode                       = this.displayDropDown.getPaymentMode()

  // set variables
  this.userDetails =  this.persistenceService.get('userDetails', StorageType.SESSION);
  this.ownerDetails =  this.persistenceService.get('ownerDetails', StorageType.SESSION);

  console.log("--Cache Values--");
  console.log(this.userDetails);
  console.log(this.ownerDetails);


  // assign values to input object
  this.getCustomerDetailsAPI_Input.records[0].owner_id = this.ownerDetails.owner_id;
  this.getCustomerDetailsAPI_Input.records[0].customer_number = this.customer_number_param;
  console.log(
    "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
    "background: #5e35b1;color: white; font-weight: bold;"
  );
  console.log( this.getCustomerDetailsAPI_Input);    

  // make api call to fetch data  
  this.callHttpPost.makeRequest_getCustomerList(this.getCustomerDetailsAPI_Input)
  .subscribe(
    (response) => {
      
      console.log(
        "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
        "background: #ADF11A;color: black; font-weight: bold;");
      console.log(response);
      
      this._customerDetailsObj = response.customerList;

      if( this._customerDetailsObj.length > 0 ){

       

        this.displayCustomerName = this._customerDetailsObj[0].full_name;
        this.displayCustomerID = this._customerDetailsObj[0].customer_id;
        this.displayPhone = this._customerDetailsObj[0].phone;
        this.displayAddress = this._customerDetailsObj[0].address;

        if(this._customerDetailsObj[0].active == 'Y'){
          this.displayCustomerStatus = "Active";
          this.isActive = true;
          this.isInactive = false;
        }
        else if(this._customerDetailsObj[0].active == 'N')
        {
          this.displayCustomerStatus = "Inactive";
          this.isActive = false;
          this.isInactive = true;
        }
        else{
          this.displayCustomerStatus = "None";
          this.isActive = false;
          this.isInactive = false;
        }
          

      }
        

    });


    // make api call to fetch data  
  this.callHttpPost.makeRequest_getCustomerBalance(this.getCustomerDetailsAPI_Input)
  .subscribe(
    (response) => {
      
      console.log(
        "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
        "background: #ADF11A;color: black; font-weight: bold;");
      console.log(response);
      
      this._customerBalanceObj  = response.customerBalance;

      if(this._customerBalanceObj.length > 0  ) {
        this.displayOldAvlBalance = this._customerBalanceObj[0].available_balance;
        this.availableBalance = this._customerBalanceObj[0].available_balance;
        this.displayDueDate = this._customerBalanceObj[0].due_date;
      }


    });

    


  } //  ~ End - ngOnInit ____________________________________________________________________

 //>>>>>  @details :  onSubmit ###############################################################
  //  ~ Start - onSubmit _______________________________________________________________________
  onSubmit(value: string): void {

    if (this.addBalancRvrsl.valid) {
      console.log("Submitted Values: ", value);

      console.log(
        "%c Form Submitted Values ***** -------------------------------------------------------------------------- ",
        "background: #689f38;font-weight: bold;color: white; "
      );
      console.log(value);

      console.log(
        "%c Pack Object Before ***** -------------------------------------------------------------------------- ",
        "background: #7cb342;font-weight: bold;color: white; "
      );
      console.log("postobj before assign", this.postRequestObject);

      //create JSON
      this.formJSONValue = JSON.parse(JSON.stringify(value));
      console.log("--------------- JSON Value ---------------");
      console.log(this.formJSONValue);

        // Assign Values from values to post request object
        this.postRequestObject.records[0].customer_details.customer_number =       this._customerDetailsObj[0].customer_number;
        this.postRequestObject.records[0].customer_details.customer_id     =       this._customerDetailsObj[0].customer_id;
        this.postRequestObject.records[0].customer_details.user_id         =       this.userDetails.user_id;
        this.postRequestObject.records[0].customer_details.user_name       =       this.userDetails.user_name;
        this.postRequestObject.records[0].customer_details.owner_id        =       this.ownerDetails.owner_id;
        this.postRequestObject.records[0].customer_details.comments        = 
                        this.userDetails.user_name + " collectec advance amount of Rs.  " +
                              this.formJSONValue.amount    + " on " + this.currentDate; 

        this.postRequestObject.records[0].payment_details.payment_amount   =       this.formJSONValue.amount;
        this.postRequestObject.records[0].payment_details.payment_remarks  =       this.formJSONValue.remarks;
        this.postRequestObject.records[0].payment_details.due_date         =       this.formJSONValue.due_date;
        this.postRequestObject.records[0].payment_details.due_amount       =       (this.displayNewAvlBalance * -1);
        this.postRequestObject.records[0].payment_details.payment_type     =       'DUE';
        this.postRequestObject.records[0].payment_details.payment_action   =       'DUE';
        this.postRequestObject.records[0].payment_details.payment_mode     =       this.formJSONValue.payment_mode;
        this.postRequestObject.records[0].payment_details.created_by       =       this.userDetails.user_name;
        this.postRequestObject.records[0].payment_details.created_by_id    =       this.userDetails.user_id;

        console.log(
          "%c Pack Object After ***** -------------------------------------------------------------------------- ",
          "background: #8bc34a;font-weight: bold;color: white; "
        );
        console.log(JSON.stringify(this.postRequestObject));  

      //  call sweet alert - Start ________________________________________________________________________________________________________
      swal({
        title: "Are you sure?",
        type: "warning",
        text: "Changes will be saved...",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Proceed!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        reverseButtons: true
      }).then(result => {
        console.log(result);

        //  Check result of buttom click - start ----------------------------------------------------------------------
        if (result.value) {
          console.log(result.value);

          swal({
            title: "Processing...",
            titleText: "Your record is being saved...",
            text: "Please do not refresh this page or click back button",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            onOpen: () => {
              swal.showLoading();
            }
          });

          // make post reqest call to send area form data to DB
          //  ~ Start  --  post reqest call-------------------------------------------------------------------------
          this.callHttpPost
            .makeRequest_managePayments(this.postRequestObject)
            .subscribe(response => {
              // Log Response - Remove Later
              console.warn(
                "%c ___________________________ Collect Advance Post Response ___________________________",
                "background: #4dd0e1;color: black; font-weight: bold;"
              );

              console.log(response);

              // swal.close();

              // Check reponse for success or failure - start
              if ((response.p_out_mssg_flg = "S")) {
                // swal ~ start -----
                swal({
                  type: "success",
                  title: "Your work has been saved",
                  text: "Click OK to proceed...",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                  showConfirmButton: true
                }).then(result => {
                  if (result.value) {
                    this.router.navigateByUrl("/managecustomer");
                  }
                }); // swal ~ end -----
              } else if ((response.p_out_mssg_flg = "E")) {
                // swal ~ start -----
                swal({
                  type: "error",
                  title: "Failed to process your work",
                  text: "Click OK to proceed...",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                  showConfirmButton: true
                }).then(result => {
                  if (result.value) {
                    swal.close();
                  }
                }); // swal ~ end -----
              } // Check reponse for success or failure - start
            });

          //  ~ End  --  post reqest call-------------------------------------------------------------------------
        } //  Check result of buttom click - End ----------------------------------------------------------------------
      }); //  call sweet alert - End ___________________________________________________________________________________________________  

    }
    else {
      this.validateFields.validateAllFormFields(this.addBalancRvrsl);
    }   

  }

}
//>>>>> @details : Component & Class Definition - End #########################################