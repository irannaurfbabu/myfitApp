/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR EDIT PACK ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   12-JUN-2018 |   CREATED_BY  |   THAPAS
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Ability to create pack. 
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

// Import Angular Core
import { Component, OnInit, NgZone } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  AbstractControl,
  Validators,
  FormGroup
} from "@angular/forms";

// Import Additional Libraries
import swal from "sweetalert2";
import { PersistenceService } from 'angular-persistence';

// Import Services
import { MeCalculatePackPriceService } from "../../Service/me-calculate-pack-price.service";
import { MeValidateFormFieldsService } from "../../Service/me-validate-form-fields.service";
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { MeDisplayDropdownListService } from "../../Service/me-display-dropdown-list.service";
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";

import * as _ from 'lodash';

// Import ~ End _________________________________________________________________________________

//>>>>> @details : Component & Class Definition - Start #########################################
@Component({
  selector: "app-me-gym-edit-pack",
  templateUrl: "./me-gym-edit-pack.component.html",
  styleUrls: ["./me-gym-edit-pack.component.scss"]
})
export class MeGymEditPackComponent implements OnInit {
  editPack: FormGroup;

  //-- Create List of Fields
  pack_id         : AbstractControl;
  pack_name         : AbstractControl;
  pack_type         : AbstractControl;
  pack_price        : AbstractControl;
  pack_price_type   : AbstractControl;
  pack_duration     : AbstractControl;
  pack_duration_type: AbstractControl;
  pack_status       : AbstractControl;

  // Public Local Variables
  showDuration: boolean = false;

  _packTypeSelect  : any = [];
  _packPriceType   : any = [];
  _packDurationType: any = [];

  displaybase_price: number = 0;
  displaycgst: number = 0;
  displaygst: number = 0;
  displaytotal_tax: number = 0;
  displaytotal: number = 0;

  displayigst      : number  = 0;
  gstAmount        : number  = 0;

  igstSelected     : boolean;
  gstSelected      : boolean;
  nonTaxable       : boolean;

  durationMessage: any = "Enter Duration.";
  duration_type_desc: any = "";

  displayCurrentPackName: any = "None";
  displayCurrentPackType: any = "None";
  displayCurrentStatus  : any = "None";
  displayCurrentDuration: any = "None";
  displayCurrenttotal   : any = 0;
  activeFlag            : boolean = false;  
  isActive              : boolean = false;  
  isInactive            : boolean = false;  

  displayCreatedBy : any = "None";
  displayCreatedOn : any = new Date();
  displayModifiedBy : any = "None";
  displayModifiedOn : any = new Date();

  // Private Local Variables
  private userDetails : any = "";
  private ownerDetails : any = "";
  private formJSONValue: any = {};
  private _packList    : any = [];
  private pack_id_param: any = 0;
  private currentDate = new Date().toString();
  private getResponseAPI_Input : any = {
    records : [{
      owner_id : null,
      pack_id  : null
    }]
  }
  private postRequestObject: any = {
    records: [
      {
        pack_id: null,
        pack_name: null,
        pack_type: null,
        pack_price_type: null,
        pack_price: null,
        base_price: null,
        pack_duration: null,
        pack_duration_type: null,
        duration_type_desc: null,
        cgst_amount: null,
        sgst_amount: null,
        total_tax: null,
        total_amount: null,
        gst_applied: null,
        owner_id: null,
        created_by_id: null,
        created_by: null,
        modified_by_id: null,
        modified_by: null,
        active: "Y",
        dmlType: "U",
        recordType: "N"
      }
    ]
  };
  //>>>>> @details - Class variable declaration ~ End ___________________________________________

  //>>>>>  @details :  constructor ###############################################################
  //  ~ Start - constructor _______________________________________________________________________
  constructor(
            fb                : FormBuilder,
    public  callHttpPost      : MeCallHttpPostService,
    private validateFields    : MeValidateFormFieldsService,
    public  calculatePrice    : MeCalculatePackPriceService,
    private displayDropDown   : MeDisplayDropdownListService,
    private persistenceService: PersistenceService,
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

    this.editPack = fb.group({
      pack_name         : [null, Validators.required],
      pack_type         : [null, Validators.required],
      pack_price        : [null, Validators.required],
      pack_price_type   : [null, Validators.required],
      pack_duration     : [null, Validators.required],
      pack_duration_type: [null, Validators.required],
      pack_status       : [null, Validators.required],
      pack_id       : [null]
    });

    // Assign form controls to private variables
    // Controls are used in me-create-area.component.html for accessing values and checking functionalities
    this.pack_id            = this.editPack.controls["pack_id"];
    this.pack_name          = this.editPack.controls["pack_name"];
    this.pack_type          = this.editPack.controls["pack_type"];
    this.pack_price         = this.editPack.controls["pack_price"];
    this.pack_price_type    = this.editPack.controls["pack_price_type"];
    this.pack_duration      = this.editPack.controls["pack_duration"];
    this.pack_duration_type = this.editPack.controls["pack_duration_type"];
    this.pack_status        = this.editPack.controls["pack_duration_type"];

    // Subscribe Pack Type Value Changes __________________________________________
    this.pack_name.valueChanges.subscribe((value: string) => {
      console.log(value);
      // if (value) {
      //   this.displayPackName = _.capitalize(value);
      // } else {
      //   this.displayPackName = "None";
      // }

    });

    // Subscribe Pack Type Value Changes __________________________________________
    this.pack_type.valueChanges.subscribe((value: string) => {
      console.log("------ Changed Value ------");
      console.log(value);
      if (value == "postpaid") {
        this.showDuration = false;
        // this.displayPackType = "Postpaid";
        // this.displayDuration = "Monthly";
      }
      if (value == "prepaid") {
        this.showDuration = true;
        // this.displayPackType = "Prepaid";
      }
    });

    // Subscribe Pack Price Value Changes __________________________________________
    this.pack_price_type.valueChanges.subscribe((value: string) => {
      console.log("------ Pack Price Type Changed Value ------");
      console.log(value);

      // Calculate the price pack details
      this.calculatePrice.calculatePackPrice(
        this.editPack.controls["pack_price"].value,
        this.editPack.controls["pack_price_type"].value
      );

      console.log(this.calculatePrice);

      // assign calculated values for display
      this.displaybase_price = this.calculatePrice.base_price;
      this.displaycgst = this.calculatePrice.cgst_amount;
      this.displaygst = this.calculatePrice.sgst_amount;
      this.displaytotal_tax = this.calculatePrice.total_tax;
      this.displaytotal = this.calculatePrice.total_amount;
      this.nonTaxable = this.calculatePrice.nonTaxable;
      this.gstSelected = this.calculatePrice.gstSelected;
      this.igstSelected = this.calculatePrice.igstSelected;
      this.gstAmount = this.calculatePrice.gstAmount;
      this.displayigst = this.calculatePrice.displayigst;
    });

    // Subscribe Pack Price Type Value Changes __________________________________________

    this.pack_price.valueChanges.subscribe((value: string) => {
      console.log("------ Pack Price Changed Value ------");
      console.log(value);

      if (value) {
        // Calculate the price pack details
        this.calculatePrice.calculatePackPrice(
          this.editPack.controls["pack_price"].value,
          this.editPack.controls["pack_price_type"].value
        );

        // console.log(this.calculatePrice)  ;

        // // assign calculated values for display
        this.displaybase_price = this.calculatePrice.base_price;
        this.displaycgst = this.calculatePrice.cgst_amount;
        this.displaygst = this.calculatePrice.sgst_amount;
        this.displaytotal_tax = this.calculatePrice.total_tax;
        this.displaytotal = this.calculatePrice.total_amount;
        this.nonTaxable = this.calculatePrice.nonTaxable;
        this.gstSelected = this.calculatePrice.gstSelected;
        this.igstSelected = this.calculatePrice.igstSelected;
        this.gstAmount = this.calculatePrice.gstAmount;
        this.displayigst = this.calculatePrice.displayigst;
      } else {
        // this.editPack.controls['pack_price'].setValue(0);

        this.displaybase_price = 0;
        this.displaycgst = 0;
        this.displaygst = 0;
        this.displaytotal_tax = 0;
        this.displaytotal = 0;
      }
    });

    // Subscribe Duration Type Value Changes __________________________________________
    this.pack_duration_type.valueChanges.subscribe((value: string) => {
      console.log("------- Duration type changes -------");
      console.log(value);

      if (value == "dd") {
        this.durationMessage = "Enter Days between 1-31 (required).";
        this.duration_type_desc = "days";
      }
      if (value == "mm") {
        this.durationMessage = "Enter months between 1-12 (required).";
        this.duration_type_desc = "months";
      }
      if (value == "yy") {
        this.durationMessage = "Enter year between 1-5 (required).";
        this.duration_type_desc = "years";
      }
    });

    // Subscribe Duration Type Value Changes __________________________________________
    this.pack_duration.valueChanges.subscribe((value: string) => {
      console.log("------- Duration changes -------");
      console.log(value);

      // let l_duration_type = this.editPack.controls["pack_duration_type"].value;

      // if (value) {
      //   console.log("l_duration_type", l_duration_type);

      //   if (l_duration_type == "dd") {
      //     this.displayDuration = value.toString() + " day(s)";
      //   } else if (l_duration_type == "mm") {
      //     this.displayDuration = value.toString() + " month(s)";
      //   } else if (l_duration_type == "yy") {
      //     this.displayDuration = value.toString() + " year(s)";
      //   } else {
      //     this.displayDuration = "None";
      //   }

      // } else {
      //   this.displayDuration = "None";
      // }


    });
  } //  ~ End - constructor ____________________________________________________________________________________

  //>>>>>  @details :  ngOnInit ###############################################################
  //  ~ Start - ngOnInit _______________________________________________________________________

  ngOnInit() {
    //Set Flags
    this.showDuration = false;

    // set variables
    this.userDetails =  this.persistenceService.get('userDetails', StorageType.SESSION);
    this.ownerDetails =  this.persistenceService.get('ownerDetails', StorageType.SESSION);

    console.log("--Cache Values--");
    console.log(this.userDetails);
    console.log(this.ownerDetails);

    // assign drop down values
    this.pack_id_param = +this.route.snapshot.params["id"];
    console.log("---- --- --- Display ID Received ---- --- ---");
    console.log(this.pack_id_param);

    // Set Drop Down Values
    this._packTypeSelect = this.displayDropDown.getPackType();
    this._packPriceType = this.displayDropDown.getPriceType();
    this._packDurationType = this.displayDropDown.getPackDurationType();

     
    // assign values to input object
    this.getResponseAPI_Input.records[0].owner_id = this.ownerDetails.owner_id;
    this.getResponseAPI_Input.records[0].pack_id = this.pack_id_param;
    console.log(
      "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
      "background: #5e35b1;color: white; font-weight: bold;"
    );
    console.log( this.getResponseAPI_Input);  

    // make api request to get pack data
    this.callHttpPost.makeRequest_getPack(this.getResponseAPI_Input).subscribe(
      (response) => {
        
        // show progress bar
       
        // assign to local variable
        this._packList = response.packList;
       
        console.log(this._packList);

        if(this._packList.length > 0){

        // assign values to form variables
        this.editPack.controls["pack_id"].setValue(this._packList[0].pack_id);
        this.editPack.controls["pack_name"].setValue(this._packList[0].pack_name);
        this.editPack.controls["pack_type"].setValue(this._packList[0].pack_type);
        this.editPack.controls["pack_price_type"].setValue(this._packList[0].pack_price_type);
        this.editPack.controls["pack_duration_type"].setValue(this._packList[0].pack_duration_type);
        this.editPack.controls["pack_duration"].setValue(this._packList[0].pack_duration);
        this.editPack.controls["pack_price"].setValue(this._packList[0].total_amount);
        // this.editPack.controls["pack_status"].setValue(this._packList[0].active);
        
        // set pack status and switch value
        if (this._packList[0].active === "Y") {
          this.editPack.controls["pack_status"].setValue(true);
          this.isActive   = true;
          this.isInactive = false;
        }
        else if(this._packList[0].active === "N") {
          this.editPack.controls["pack_status"].setValue(false);
          this.isActive   = false;
          this.isInactive = true;
        }

        
        // assign display variables
        this.displayCurrentPackName = this._packList[0].pack_name;
        this.displayCurrentPackType = _.capitalize(this._packList[0].pack_type);
        this.displayCurrentDuration = this._packList[0].pack_duration === 'postpaid' ? "Monthly": "None";
        this.displayCurrenttotal    = this._packList[0].total_amount;
        this.displayCurrentStatus   = this._packList[0].pack_status;
        this.activeFlag             = this._packList[0].active === 'Y' ? true: false;


        }

      });


  }

  //>>>>>  @details :  onSubmit ###############################################################
  //  ~ Start - onSubmit _______________________________________________________________________
  onSubmit(value: string): void {
    /* @details - Check for fields validity
        ++ Check the createArea validity
        ** If the form state is invalid call validateAllFormFields service
        ** If the form state is valid call http service
    */
    console.log(this.editPack);

    if (this.editPack.valid) {
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
      this.postRequestObject.records[0].pack_id          = this.formJSONValue.pack_id;
      this.postRequestObject.records[0].pack_name          = this.formJSONValue.pack_name;
      this.postRequestObject.records[0].pack_type          = this.formJSONValue.pack_type;
      this.postRequestObject.records[0].pack_price         = this.formJSONValue.pack_price;
      this.postRequestObject.records[0].pack_price_type    = this.formJSONValue.pack_price_type;
      this.postRequestObject.records[0].pack_duration      = this.formJSONValue.pack_duration;
      this.postRequestObject.records[0].pack_duration_type = this.formJSONValue.pack_duration_type;
      // this.postRequestObject.records[0].duration_type_desc = this.duration_type_desc;
      // this.postRequestObject.records[0].duration_type_desc = this.formJSONValue;
      this.postRequestObject.records[0].base_price   = this.calculatePrice.base_price;
      this.postRequestObject.records[0].cgst_amount  = this.calculatePrice.cgst_amount;
      this.postRequestObject.records[0].sgst_amount  = this.calculatePrice.sgst_amount;
      this.postRequestObject.records[0].total_tax    = this.calculatePrice.total_tax;
      this.postRequestObject.records[0].total_amount = this.calculatePrice.total_amount;

      // assign additional values
      this.postRequestObject.records[0].owner_id      = this.ownerDetails.owner_id;
      this.postRequestObject.records[0].created_by    = this.userDetails.user_name;
      this.postRequestObject.records[0].created_by_id = this.userDetails.user_id;
      this.postRequestObject.records[0].comments =  this.userDetails.user_name + " modified " +  
        this.formJSONValue.pack_name + ". Pack price Rs. " + this.calculatePrice.total_amount + " on " + this.currentDate;


      if(  this.formJSONValue.pack_price_type === 'BPGST' || this.formJSONValue.pack_price_type === 'TPGST'  ) {
        this.postRequestObject.records[0].gst_applied = 'Y';
      }
      else {
        this.postRequestObject.records[0].gst_applied = 'N';
      }

      if(this.formJSONValue.pack_status) {
        this.postRequestObject.records[0].active  = 'Y' ;
        this.postRequestObject.records[0].dmlType = 'U' ;
      }
      else if(!this.formJSONValue.pack_status) {
        this.postRequestObject.records[0].active  = 'N' ;
        this.postRequestObject.records[0].dmlType = 'D';
      }

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
            .makeRequest_managePack(this.postRequestObject)
            .subscribe(response => {
              // Log Response - Remove Later
              console.warn(
                "%c ___________________________ Manage Pack Post Response ___________________________",
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
                    this.router.navigateByUrl("/managepack");
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
      this.validateFields.validateAllFormFields(this.editPack);
    }
  }
  //  ~ End - onSubmit _______________________________________________________________________



//>>>>>  @details :  Local Functions ###############################################################
//  ~ Start - Local Functions _______________________________________________________________________

// function to set status active or inactive 
//  ~ Start -setStatus ________________________________________________________________________________________
  setStatus() {
    console.log("-------------- Status Clicked --------------");
    this.isActive   = !this.isActive ;
    this.isInactive = !this.isInactive ;
     
  }  //  ~ End -setStatus ________________________________________________________________________________________

//  ~ End - Local Functions _______________________________________________________________________


}
//>>>>> @details : Component & Class Definition - End #########################################
