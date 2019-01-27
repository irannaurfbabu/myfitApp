/*
____________________________________________________________________________________________________________
## COMPONENT FOR USER LOGIN PAGE ##
------------------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   24-JAN-2018 |   CREATED_BY  |   THAPAS
------------------------------------------------------------------------------------------------------------
## SERVICE FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------------------
|   ++ Component Definition for User Login Page
|   ++ Validates User Input  by making call to MeValidateFormFieldsService
|   ++ Authenticates User Login ID and Password by making call to MeUserProfileService
|   ++ Retrieves User Authentication Response
|       ** If the authentication is valid - make a call to User profile data
|       ** Set the Use Profile data in MeUserProfileService service for use in other Components
------------------------------------------------------------------------------------------------------------
## CHANGE LOG DETAILS 				##
------------------------------------------------------------------------------------------------------------
|   ++ 24-JAN-2018    v1.0     - Created the New Component.
|   ++
____________________________________________________________________________________________________________

*/

//>>>>> @details : Angular Core and Custom Imports  ##############################################
// Import ~ Start _________________________________________________________________________________

// Import Angular Core 
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, AbstractControl, Validators, FormGroup } from "@angular/forms";

import { NotificationsService } from 'angular2-notifications';
import { PersistenceService } from 'angular-persistence';

// Import Services
import { MeValidateFormFieldsService } from "../../Service/me-validate-form-fields.service";
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";

// Import ~ End _________________________________________________________________________________

//>>>>> @details : Component & Class Definition - Start #########################################
@Component({
  selector: 'app-me-gym-login',
  templateUrl: './me-gym-login.component.html',
  styleUrls: ['./me-gym-login.component.scss']
})
export class MeGymLoginComponent implements OnInit {

  //>>>>> @details - Class variable declaration ~ Start ___________________________________________

   //-- Create Form Group
   loginForm: FormGroup;

   //-- Create Form Fields variables
   user_login_id: AbstractControl;
   user_password: AbstractControl;
 
   // Class Variables
   showProgressBar: boolean = false;
   showLoginButton: boolean = true;

   // toast options
   public options = {
    position: ["top","right"],
    timeOut: 3000,
    lastOnBottom: true,
    animate : "fromLeft",
    
    }

   // Private Local Variables
   private messageTitle : string = "";
   private messageContent : string = "";
   private formJSONValue : any = {};
   private getResponseAPI_Input: any = {
    records: [
      {
        user_login_id: null,
        user_password: null
      }
    ]
   };


  //>>>>> @details - Class variable declaration ~ End ___________________________________________ 

  constructor(
    private fb                   : FormBuilder,
    private callHttpPost         : MeCallHttpPostService,
    private validateFields       : MeValidateFormFieldsService,
    private router               : Router,
    private _notificationsService: NotificationsService,
    private persistenceService   : PersistenceService
  ) {

     /*
       @details -  Intialize the form group with fields
          ++ The fields are set to default values - in below case to - null.
          ++ The fields are assigned validators
              ** Required Validator
      */

     this.loginForm = this.fb.group({
      user_login_id: [null, Validators.required],
      user_password: [null, Validators.required]
    });

    // Assign form controls to private variables
    // Controls are used in me-login.component.html for accessing values and checking functionalities
    this.user_login_id = this.loginForm.controls["user_login_id"];
    this.user_password = this.loginForm.controls["user_password"];

   } //  ~ End - constructor ____________________________________________________________________________________

//>>>>>  @details :  ngOnInit ###############################################################
//  ~ Start - ngOnInit _______________________________________________________________________  
  ngOnInit() {

     // set flags
     this.showLoginButton = true;
     this.showProgressBar = false;

  }

//  ~ End - ngOnInit _______________________________________________________________________  

//>>>>>  @details :  onSubmit ###############################################################
//  ~ Start - onSubmit _______________________________________________________________________
onSubmit(value: string): void {


      /* @details - Check for fields validity
                ++ Check the createArea validity
                ** If the form state is invalid call validateAllFormFields service
                ** If the form state is valid call http service
            */
           console.log(this.loginForm);

     if (this.loginForm.valid) {

         // set flags
         this.showLoginButton = false;
         this.showProgressBar = true ;  
      
        console.log("Submitted Values: ", value);


            //create JSON
        this.formJSONValue = JSON.parse(JSON.stringify(value));
        console.log("--------------- JSON Value ---------------");
        console.log(this.formJSONValue);

        // Assign Values from values to post request object
        this.getResponseAPI_Input.records[0].user_login_id          = this.formJSONValue.user_login_id;
        this.getResponseAPI_Input.records[0].user_password          = this.formJSONValue.user_password;
 

        console.log( 
          "%c Validate Object After ***** -------------------------------------------------------------------------- ",
          "background: #8bc34a;font-weight: bold;color: white; "
        );
        console.log(JSON.stringify(this.getResponseAPI_Input));



        // make post reqest call to send area form data to DB
         //  ~ Start  --  post reqest call-------------------------------------------------------------------------
           this.callHttpPost
           .makeRequest_validateUser(this.getResponseAPI_Input)
           .subscribe(response => {
             // Log Response - Remove Later
             console.warn(
               "%c ___________________________ Manage Pack Post Response ___________________________",
               "background: #4dd0e1;color: black; font-weight: bold;"
             );

             console.log(response);

             // Check if response variables have value
          if (response.p_out_mssg_flg && response.p_out_mssg) {
            // If the login is valid
            if (response.p_out_mssg_flg === "S") {
              
              this.showProgressBar = false;
               
   
              // Save the Input format in cache for use in other Components & Service - Using PersistenceService Service.
              this.persistenceService.set("userLoginID", this.formJSONValue.user_login_id,{type: StorageType.SESSION});

              // navigate to homepage
              this.router.navigateByUrl("/home");
 


            } else if (response.p_out_mssg_flg === "E") {

              // Set the Loader to true and hide the login button
              this.showLoginButton = true;
              this.showProgressBar = false;

              // set message
              this.messageTitle = "Error";
              this.messageContent = "Invalid Username or Password ";

              this._notificationsService.error(
                this.messageTitle,
                this.messageContent,
                this.options
            )

              // if the login is Invalid - Display message to the user
              // this.openSnackBar(response.p_out_mssg, "Okay");

              
               
            }
          }



            });

      }
      else {

          this.validateFields.validateAllFormFields(this.loginForm);

      }



}
//  ~ End - onSubmit _______________________________________________________________________





}
//>>>>> @details : Component & Class Definition - End #########################################