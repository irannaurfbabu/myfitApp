/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR COLLECT PAYMENT ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   21-JUN-2018 |   CREATED_BY  |   PRIYANK
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Ability to collect payment and renew subscription. 
|    
|      
|   
------------------------------------------------------------------------------------------------
## CHANGE LOG DETAILS 				##
------------------------------------------------------------------------------------------------
|   ++ 21-JUN-2018    v1.0     - Created the New Component.
|   ++
------------------------------------------------------------------------------------------------
*/
// Import ~ Start _________________________________________________________________________________

// Import Angular Core 
import { Component, OnInit, NgZone } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, AbstractControl, Validators, FormGroup } from "@angular/forms";

// Import Additional Libraries 
import { PersistenceService } from 'angular-persistence';
import swal from "sweetalert2";
import * as moment from 'moment';
// import * as _ from 'lodash'; 

// Import Services
import { MeCalculatePackPriceService } from "../../Service/me-calculate-pack-price.service";
import { MeValidateFormFieldsService } from "../../Service/me-validate-form-fields.service";
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
// import { MeDisplayDropdownListService } from '../../Service/me-display-dropdown-list.service';
import { StorageType } from "../../Service/Interfaces/storage-type.enum";
import { MeCalculateSubscriptionPriceService } from '../../Service/me-calculate-subscription-price.service';
import { ToastService } from 'ng-uikit-pro-standard';



// Import ~ End _________________________________________________________________________________

@Component({
  selector: 'app-me-gym-collect-payment',
  templateUrl: './me-gym-collect-payment.component.html',
  styleUrls: ['./me-gym-collect-payment.component.scss']
})
export class MeGymCollectPaymentComponent implements OnInit {


  //>>>>> @details - Class variable declaration ~ Start _______________________________________

  // Form Group
  addBalancRvrsl: FormGroup;

  // form columns
  amount: AbstractControl
  remarks: AbstractControl
  renewal_date: AbstractControl

  // public variables
  displayCustomerName: string = "None";
  displayCustomerID: string = "None";
  displayPhone: string = "None";
  displayAddress: string = "None";
  displayCustomerStatus: string = "None";
  displayWarning: boolean = false;
  displayExpiry: string = '';
  packExpiryDate: any = '';
  activationDate: any = '';
  oldPackExpiryDate: any = '';
  pack_duration: any = '';
  pack_duration_type: any = '';
  duration: string = '';
  currentDate: any = '';
  renewalDate: any = '';
  renewalAmount: any = 0;
  lessAmount : boolean;
  showRenewal : any;


  displayOldAvlBalance: any = 0;
  displayRecievedAmount: any = 0;
  displayOutstandingBalance: any = 0;
  displayRemarks: any = '';
  badgeColor: any = '';

  availableBalance: any = 0;
  total_amount: any = 0;


  isActive: boolean = false;
  isInactive: boolean = false;
  minDate = moment();
  expiringIn : any = '';

  // Private Local Variables
  private _customerDetailsObj: any = "";
  private _customerBalanceObj: any = "";
  public _customerPacksObj: any = "";

  private userDetails: any = "";
  private ownerDetails: any = "";
  private customer_number_param: any = "";
  private formJSONValue: any = {};
  private smsPostRequestObject: any = {
    "cust_details": [{
    "tran_amount": null,
    "expiry_date": null,
    "company_name": null,
    "NAME": null,
    "mobile_number": "9599555792"
    }],
    "count_details": [{
    "cust_count": "1"
    }],
    "sms_details": [{
    "system": "mobifit",
    "msg_id": "2",
    "temp_id": "1"
    }]
    }
  private postRequestObject: any = {
    "records": [
      {
        "payment_details": {
          "created_by": null,
          "created_on": null,
          "modified_by": null,
          "modified_on": null,
          "payment_date": null,
          "payment_mode": null,
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
        },
        "pack_details": {
          "pack_id": null,
          "pack_activation_date": null,
          "pack_expiry_date": null
        }
      }
    ]
  }

  private getCustomerDetailsAPI_Input: any = {
    records: [{
      owner_id: null,
      customer_number: null
    }]
  }




  //>>>>> @details - Class variable declaration ~ End ________________________________________ 

  //>>>>>  @details :  constructor ############################################################
  //  ~ Start - constructor ___________________________________________________________________
  constructor(
    fb: FormBuilder,
    public callHttpPost: MeCallHttpPostService,
    private validateFields: MeValidateFormFieldsService,
    public calculatePrice: MeCalculatePackPriceService,
    public calculateSubPrice: MeCalculateSubscriptionPriceService,
    private persistenceService: PersistenceService,
    public zone: NgZone,
    public router: Router,
    public route: ActivatedRoute,
    public toast: ToastService
  ) {

    /*
@details -  Intialize the form group with fields
++ The fields are set to default values - in below case to - null.
++ The fields are assigned validators
** Required Validator
*/
    this.addBalancRvrsl = fb.group({
      amount: [null, Validators.required],
      remarks: [null],
      renewal_date: [null]
    });

    // Assign form controls to private variables
    // Controls are used in me-create-area.component.html for accessing values and checking functionalities
    this.amount = this.addBalancRvrsl.controls["amount"];
    this.remarks = this.addBalancRvrsl.controls["remarks"];
    this.renewal_date = this.addBalancRvrsl.controls["renewal_date"];







  } //  ~ End - constructor __________________________________________________________________



  //>>>>>  @details :  ngOnInit ###############################################################
  //  ~ Start - ngOnInit ______________________________________________________________________
  ngOnInit() {

    this.currentDate = moment();
    this.displayRemarks = 'N/A';
    this.badgeColor = 'grey';



    // assign drop down values
    this.customer_number_param = +this.route.snapshot.params["id"];
    console.log("---- --- --- Customer Number Received ---- --- ---");
    console.log(this.customer_number_param);

    // set variables
    this.userDetails = this.persistenceService.get('userDetails', StorageType.SESSION);
    this.ownerDetails = this.persistenceService.get('ownerDetails', StorageType.SESSION);

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
    console.log(this.getCustomerDetailsAPI_Input);


    // make api call to fetch data  
    this.callHttpPost.makeRequest_getCustomerList(this.getCustomerDetailsAPI_Input)
      .subscribe(
        (response) => {

          console.log(
            "%c ---------------------------- ***** Customer Details API RESPONSE ***** ---------------------------- ",
            "background: #ADF11A;color: black; font-weight: bold;");
          console.log(response);

          this._customerDetailsObj = response.customerList;

          if (this._customerDetailsObj.length > 0) {

            this.smsPostRequestObject.cust_details[0].NAME = this._customerDetailsObj[0].full_name;
            this.smsPostRequestObject.cust_details[0].mobile_number = this._customerDetailsObj[0].phone;
            


            this.displayCustomerName = this._customerDetailsObj[0].full_name;
            this.displayCustomerID = this._customerDetailsObj[0].customer_id;
            this.displayPhone = this._customerDetailsObj[0].phone;
            this.displayAddress = this._customerDetailsObj[0].address;

            if (this._customerDetailsObj[0].active == 'Y') {
              this.displayCustomerStatus = "Active";
              this.isActive = true;
              this.isInactive = false;
            }
            else if (this._customerDetailsObj[0].active == 'N') {
              this.displayCustomerStatus = "Inactive";
              this.isActive = false;
              this.isInactive = true;
            }
            else {
              this.displayCustomerStatus = "None";
              this.isActive = false;
              this.isInactive = false;
            }


          }


        });



    


    // make api call to fetch data
    this.callHttpPost.makeRequest_getCustomerPacks(this.getCustomerDetailsAPI_Input)
      .subscribe(
        (response) => {

          console.log(
            "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
            "background: #ADF11A;color: black; font-weight: bold;");
          console.log(response);

          this._customerPacksObj = response.packsSubscribed
          console.log('***************Customer Packs******************', this._customerPacksObj)
          this.calculateSubPrice.calculateTotalPrice(this._customerPacksObj)
          this.pack_duration_type = this._customerPacksObj[0].pack_duration_type;
          this.pack_duration = this._customerPacksObj[0].pack_duration;
          this.total_amount = this.calculateSubPrice.total_amount;
          this.oldPackExpiryDate = this._customerPacksObj[0].pack_expiry_date;
          this.activationDate = this._customerPacksObj[0].pack_activation_date;
          
          this.expiringIn = this._customerPacksObj[0].expiringIn;
          if (this.expiringIn <= 0) {
            this.expiringIn = 'Expired';
          } else {
            this.expiringIn += ' Days';
          }

          // console.log('*******type of Old Pack Expiry Date**********', typeof (this._customerPacksObj[0].pack_expiry_date))

          console.log('**********oldPackExpiry date ************',moment(this.oldPackExpiryDate) );
          console.log('**********current date ************',moment() );


          if ((moment(this.oldPackExpiryDate) > moment())) {
            console.log('**************renewal date is not current date**********************');
            this.renewalDate = moment(this.oldPackExpiryDate).add('1', 'day');
            this.packExpiryDate = this.calculatePackExpiryDate(this.renewalDate, this.pack_duration_type, this.pack_duration);
          }
          else {
            this.renewalDate = moment();
            console.log('**************renewal date is equal to current date *****************');
            this.packExpiryDate = this.calculatePackExpiryDate(this.renewalDate, this.pack_duration_type, this.pack_duration);
          }

          // make api call to fetch data  
          this.callHttpPost.makeRequest_getCustomerBalance(this.getCustomerDetailsAPI_Input)
          .subscribe(
            (response) => {

              console.log(
                "%c ---------------------------- ***** CUSTOMER BALANCE API RESPONSE ***** ---------------------------- ",
                "background: #ADF11A;color: black; font-weight: bold;");
              console.log(response);

              this._customerBalanceObj = response.customerBalance;

              if (this._customerBalanceObj.length > 0) {
                this.displayOldAvlBalance = this._customerBalanceObj[0].available_balance;
                this.availableBalance = this._customerBalanceObj[0].available_balance;

                this.renewalAmount = this.total_amount - this.displayOldAvlBalance;
                if (this.renewalAmount < 0) {
                  this.showRenewal = 0;
                } else {
                  this.showRenewal = this.renewalAmount;
                }
              }


            });

        }
      )


    //subscribe for add balance value channge
    this.amount.valueChanges.subscribe((value: number) => {
      console.log(
        "%c ------------------  Event Change amount ------------------",
        "background: green; color: white; display: block;"
      );
      console.log("Amount Value:", value);

      if (value ) {
        this.displayWarning = false;
        this.displayRecievedAmount = value;

        this.displayOutstandingBalance = value - this.renewalAmount;

        if (this.displayOutstandingBalance > 0) {
          this.displayRemarks = 'Excess Amount';
          this.badgeColor = 'orange';
          this.lessAmount = false;
        } else if (this.displayOutstandingBalance < 0) {
          this.displayRemarks = 'Less Amount';
          this.lessAmount = true;
          this.badgeColor = 'red';
        } else if (this.displayOutstandingBalance == 0) {
          this.displayRemarks = 'No Outstanding';
          this.badgeColor = 'green';
          this.lessAmount = false;
        } else {
          this.displayRemarks = 'N/A';
          this.badgeColor = 'grey';
        
        }

      }
      else {
        this.displayOutstandingBalance = value - (this.total_amount - this.displayOldAvlBalance);
        this.displayRemarks = 'N/A';
        this.badgeColor = 'grey';
        this.displayRecievedAmount = "0";
        this.displayWarning = true;
      }


    });








  } //  ~ End - ngOnInit ____________________________________________________________________

  //>>>>>  @details :  onSubmit ###############################################################
  //  ~ Start - onSubmit _______________________________________________________________________
  onSubmit(value: string): void {

    if (this.addBalancRvrsl.valid) {
      console.log("Submitted Values: ", value);

      if(!this.lessAmount) {

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
      this.postRequestObject.records[0].customer_details.customer_number = this._customerDetailsObj[0].customer_number;
      this.postRequestObject.records[0].customer_details.customer_id = this._customerDetailsObj[0].customer_id;
      this.postRequestObject.records[0].customer_details.user_id = this.userDetails.user_id;
      this.postRequestObject.records[0].customer_details.user_name = this.userDetails.user_name;
      this.postRequestObject.records[0].customer_details.avl_balance = this.displayOldAvlBalance;
      this.postRequestObject.records[0].customer_details.owner_id = this.ownerDetails.owner_id;
      this.postRequestObject.records[0].customer_details.comments =
        this.userDetails.user_name + " collectec advance amount of Rs.  " +
        this.formJSONValue.amount + " on " + this.currentDate;

      this.postRequestObject.records[0].payment_details.payment_amount = this.formJSONValue.amount;
      this.postRequestObject.records[0].payment_details.payment_remarks = this.formJSONValue.remarks;
      this.postRequestObject.records[0].payment_details.payment_type = 'RNWL';
      this.postRequestObject.records[0].payment_details.payment_action = 'RNWL';
      this.postRequestObject.records[0].payment_details.payment_mode = 'CASH';
      this.postRequestObject.records[0].payment_details.payment_date = moment();
      this.postRequestObject.records[0].payment_details.created_by = this.userDetails.user_name;
      this.postRequestObject.records[0].payment_details.created_by_id = this.userDetails.user_id;

      this.postRequestObject.records[0].pack_details.pack_id = this._customerPacksObj[0].pack_id;
      this.postRequestObject.records[0].pack_details.pack_activation_date = this.renewalDate;
      this.postRequestObject.records[0].pack_details.pack_expiry_date = this.packExpiryDate;

      this.smsPostRequestObject.cust_details[0].company_name = this.ownerDetails.owner_company_name;
      this.smsPostRequestObject.cust_details[0].tran_amount = parseFloat(this.formJSONValue.amount);
      this.smsPostRequestObject.cust_details[0].expiry_date = moment(this.packExpiryDate).format("Do MMM YYYY");

      console.log(
        "%c SMS Post Object After ***** -------------------------------------------------------------------------- ",
        "background: #8bc34a;font-weight: bold;color: white; "
      );
      console.log(JSON.stringify(this.smsPostRequestObject));
      



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

                this.callHttpPost.makeRequest_smsConfirmation(this.smsPostRequestObject).subscribe(
                  (response) => {
                    // Log Response - Remove Later
                    console.warn(
                      "%c ___________________________ SMS Post Response ___________________________",
                      "background: #4dd0e1;color: black; font-weight: bold;"
                  );
                console.log(response);

                  }
                )
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
    } else {
      this.toast.warning('Entered Amount is Less than Renewal Amount');
    } 

    }
    else {
      this.validateFields.validateAllFormFields(this.addBalancRvrsl);
    }

  }

  calculatePackExpiryDate(startDate: any, durationType: any, durationval: any) {
    // Calculating Expiry date of the pack
    let duratn: any;
    let packExpirydate: any;

    if (durationType == 'dd') {
      duratn = 'days'
      return packExpirydate = moment(startDate).add(durationval, duratn)
    } else if (durationType == 'mm') {
      duratn = 'months'
      return packExpirydate = moment(startDate).add(durationval, duratn)
    } else {
      duratn = 'year'
      return packExpirydate = moment(startDate).add(durationval, duratn)
    }

  }

}
//>>>>> @details : Component & Class Definition - End #########################################