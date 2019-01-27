/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR EDIT EMPLOYEE ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   12-JUN-2018 |   CREATED_BY  |   THAPAS
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Ability to edit employee. 
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

import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

// Import Additional Libraries
import swal from "sweetalert2";
import * as _ from 'lodash';
import { PersistenceService } from 'angular-persistence';

// Import Services
import { MeValidateFormFieldsService } from '../../Service/me-validate-form-fields.service';
import { MeCallHttpPostService } from '../../Service/me-call-http-post.service';
import { MeDisplayDropdownListService } from '../../Service/me-display-dropdown-list.service';
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";


// Import ~ End _________________________________________________________________________________


@Component({
  selector: 'app-me-gym-edit-employee',
  templateUrl: './me-gym-edit-employee.component.html',
  styleUrls: ['./me-gym-edit-employee.component.scss']
})

export class MeGymEditEmployeeComponent implements OnInit {

//>>>>> @details - Class variable declaration ~ Start ___________________________________________

  // Form Group 
  editEmployee : FormGroup

  //-- Create List of Fields
  employee_id  : AbstractControl
  first_name   : AbstractControl
  last_name    : AbstractControl
  gender       : AbstractControl
  phone        : AbstractControl
  email        : AbstractControl
  address      : AbstractControl
  city         : AbstractControl
  area         : AbstractControl
  pincode      : AbstractControl
  job_role     : AbstractControl
  joining_date : AbstractControl
  end_date     : AbstractControl
  alt_name     : AbstractControl
  alt_address  : AbstractControl
  alt_phone    : AbstractControl
  econtact_name: AbstractControl
  econtact_number: AbstractControl
  econtact_address: AbstractControl
  relationship : AbstractControl
  birth_date   : AbstractControl
  enable_access: AbstractControl
  login_id     : AbstractControl
  password     : AbstractControl
  status      : AbstractControl

  //flags
  showCredentials : boolean = false;
  isEnabled       : boolean = false;
  isDisabled      : boolean = false;
  isActive        : boolean = false;
  isInactive      : boolean = false;

  // Public Local Variables
  _genderSelect: any = [];
  _roleSelect: any = [];
  _relationshipType: any = [];
  minDate = new Date(2017, 0, 1);
  maxDate = new Date();
 
  // Private Local Variables
  private userDetails : any = "";
  private ownerDetails : any = "";
  private formJSONValue: any     = {};
  private _employeeList    : any = [];
  private employee_id_param: any = 0;
  private currentDate  = new Date().toString();
  private getResponseAPI_Input : any = {
    records : [{
      owner_id : null,
      employee_id  : null
    }]
  }
  private postRequestObject: any = {
    
    records: [
      {
        employee_details : {
          employee_id  : null,
          first_name   : null,
          last_name    : null,
          gender       : null,
          phone        : null,
          email        : null,
          address      : null,
          city         : null,
          area         : null,
          pincode      : null,
          owner_id     : null,
          active       : null,
          dmlType      : 'U',
          recordType   : 'N',
          created_by_id: null,
          created_by   : null,
          comments     : null,
      },
      employee_meta : {
        job_role    : null,
        joining_date: null,
        end_date    : null,
        alt_name    : null,
        alt_address : null,
        alt_phone   : null,
        birth_date  : null,
        econtact_name: null,
        econtact_number: null,
        econtact_address: null,
        relationship: null,
        login_id    : null,
        password    : null
      }
      }
    ]
  };
 //>>>>> @details - Class variable declaration ~ End ___________________________________________
 //>>>>>  @details :  constructor ###############################################################

//  ~ Start - constructor _______________________________________________________________________

constructor(
          fb             : FormBuilder,
  private validateFields : MeValidateFormFieldsService,
  private callHttpPost   : MeCallHttpPostService,
  private displayDropDown: MeDisplayDropdownListService,
  private persistenceService: PersistenceService,
  public  router         : Router,
  public  route          : ActivatedRoute
){

// assign fields and validators to form group
  this.editEmployee = fb.group({
    first_name   : [null, Validators.required],
    last_name    : [''],
    gender       : [null, Validators.required],
    phone        : [null, Validators.required],
    email        : [''],
    address      : [''],
    city         : [''],
    area         : [''],
    pincode      : [''],
    job_role     : [null, Validators.required],
    joining_date : [null, Validators.required],
    alt_address  : [''],
    alt_phone    : [''],
    alt_name     : [''],
    birth_date   : [''],
    relationship : [''],
    econtact_name: [''],
    econtact_number: [''],
    econtact_address: [''],
    enable_access: [null, Validators.required],
    login_id     : [''],
    password     : [''],
    status       : [null],
    employee_id  : ['']
  });

  // map form fields and controls
  this.employee_id        =   this.editEmployee.controls["employee_id"];
  this.first_name         =   this.editEmployee.controls["first_name"];
  this.last_name          =   this.editEmployee.controls["last_name"];
  this.gender             =   this.editEmployee.controls["gender"];
  this.phone              =   this.editEmployee.controls["phone"];
  this.email              =   this.editEmployee.controls["email"];
  this.address            =   this.editEmployee.controls["address"];
  this.city               =   this.editEmployee.controls["city"];
  this.area               =   this.editEmployee.controls["area"];
  this.pincode            =   this.editEmployee.controls["pincode"];
  this.job_role           =   this.editEmployee.controls["job_role"];
  this.joining_date       =   this.editEmployee.controls["joining_date"];
  this.end_date           =   this.editEmployee.controls["end_date"];
  this.alt_address        =   this.editEmployee.controls["alt_address"];
  this.alt_phone          =   this.editEmployee.controls["alt_phone"];
  this.alt_name           =   this.editEmployee.controls["alt_name"];
  this.enable_access      =   this.editEmployee.controls["enable_access"];
  this.relationship          =   this.editEmployee.controls["relationship"];
  this.econtact_name          =   this.editEmployee.controls["econtact_name"];
  this.econtact_number          =   this.editEmployee.controls["econtact_number"];
  this.econtact_address          =   this.editEmployee.controls["econtact_address"];
  this.birth_date         =   this.editEmployee.controls["birth_date"];
  this.login_id           =   this.editEmployee.controls["login_id"];
  this.password           =   this.editEmployee.controls["password"];
  this.status             =   this.editEmployee.controls["status"];
    

 }
//  ~ End - constructor _____________________________________________________________________ 

 
//>>>>>  @details :  ngOnInit ###############################################################
//  ~ Start - ngOnInit _______________________________________________________________________   
ngOnInit() {

  this._genderSelect = this.displayDropDown.getGenderDropDown();
  this._roleSelect   = this.displayDropDown.getEmployeeDropDown();
  this._relationshipType = this.displayDropDown.getRelationshipType();

   // set variables
   this.userDetails =  this.persistenceService.get('userDetails', StorageType.SESSION);
   this.ownerDetails =  this.persistenceService.get('ownerDetails', StorageType.SESSION);

   console.log("--Cache Values--");
   console.log(this.userDetails);
   console.log(this.ownerDetails);

  // assign drop down values
  this.employee_id_param = +this.route.snapshot.params["id"];
  console.log("---- --- --- Display ID Received ---- --- ---");
  console.log(this.employee_id_param);


  // set the flag
  this.showCredentials = false;
  this.isEnabled       = false;
  this.isDisabled      = true;

  // set the value
  this.editEmployee.controls["enable_access"].setValue(false);


  // assign values to input object
  this.getResponseAPI_Input.records[0].owner_id = this.ownerDetails.owner_id;
  this.getResponseAPI_Input.records[0].employee_id = this.employee_id_param;
  console.log(
    "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
    "background: #5e35b1;color: white; font-weight: bold;"
  );
  console.log( this.getResponseAPI_Input);  

  // make api request to get pack data
  this.callHttpPost.makeRequest_getEmployee(this.getResponseAPI_Input).subscribe(
    (response) => {
      
      // show progress bar
     
      // assign to local variable
      this._employeeList = response.employeeList;
     
      console.log('***************Edit Employee Api resonse******************', this._employeeList);

      if(this._employeeList.length > 0){

      // assign values to form variables
      this.editEmployee.controls["first_name"].setValue(this._employeeList[0].first_name);
      this.editEmployee.controls["last_name"].setValue(this._employeeList[0].last_name);
      this.editEmployee.controls["gender"].setValue(this._employeeList[0].gender);
      this.editEmployee.controls["address"].setValue(this._employeeList[0].address);
      this.editEmployee.controls["email"].setValue(this._employeeList[0].email);
      this.editEmployee.controls["phone"].setValue(this._employeeList[0].phone);
      this.editEmployee.controls["area"].setValue(this._employeeList[0].area);
      this.editEmployee.controls["city"].setValue(this._employeeList[0].city);
      this.editEmployee.controls["pincode"].setValue(this._employeeList[0].pincode);
      this.editEmployee.controls["employee_id"].setValue(this._employeeList[0].employee_id);
      
      // other info  
      this.editEmployee.controls["job_role"].setValue(this._employeeList[0].job_role);
      this.editEmployee.controls["joining_date"].setValue(this._employeeList[0].joining_date);
      this.editEmployee.controls["alt_name"].setValue(this._employeeList[0].alt_name);
      this.editEmployee.controls["alt_phone"].setValue(this._employeeList[0].alt_phone);
      this.editEmployee.controls["relationship"].setValue(this._employeeList[0].relationship);
      this.editEmployee.controls["econtact_name"].setValue(this._employeeList[0].econtact_name);
      this.editEmployee.controls["econtact_number"].setValue(this._employeeList[0].econtact_number);
      this.editEmployee.controls["econtact_address"].setValue(this._employeeList[0].econtact_address);
      this.editEmployee.controls["birth_date"].setValue(this._employeeList[0].birth_date);
      this.editEmployee.controls["alt_phone"].setValue(this._employeeList[0].alt_phone);
      this.editEmployee.controls["enable_access"].setValue(this._employeeList[0].enable_access);  
     

      // set access values 
      if(this._employeeList[0].enable_access) {

          this.isEnabled       = true ;
          this.isDisabled      = false ;
          this.showCredentials = true;

          //
          this.editEmployee.controls["login_id"].setValue(this._employeeList[0].login_id);
          this.editEmployee.controls["password"].setValue(this._employeeList[0].password);
          

      }
      else if(!this._employeeList[0].enable_access){

        this.isEnabled   = false ;
        this.isDisabled = true ;
        this.showCredentials = false;


      }
      
    //  set pack status and switch value
      if (this._employeeList[0].active === "Y") {
        this.editEmployee.controls["status"].setValue(true);
        this.isActive   = true;
        this.isInactive = false;
      }
      else if(this._employeeList[0].active === "N") {
        this.editEmployee.controls["status"].setValue(false);
        this.isActive   = false;
        this.isInactive = true;
      }

       

      }

    });


}

//  ~ End - ngOnInit _______________________________________________________________________


//>>>>>  @details :  onSubmit ###############################################################
//  ~ Start - onSubmit _______________________________________________________________________
onSubmit(value : string): void {

  /* @details - Check for fields validity
       ++ Check the createArea validity
         ** If the form state is invalid call validateAllFormFields service
         ** If the form state is valid call http service
  */
    console.log(this.editEmployee);

    if (this.editEmployee.valid) {
        
     console.log("Submitted Values: ", value);

     console.log(
       "%c Form Submitted Values ***** -------------------------------------------------------------------------- ",
       "background: #689f38;font-weight: bold;color: white; "
     );
     console.log(value);

     console.log(
       "%c Employee Object Before ***** -------------------------------------------------------------------------- ",
       "background: #7cb342;font-weight: bold;color: white; "
     );
     console.log('Post Object before assign',this.postRequestObject);

     //create JSON
     this.formJSONValue = JSON.parse(JSON.stringify(value));
     console.log("--------------- JSON Value ---------------");
     console.log(this.formJSONValue);

     // Assign Values from values to post request object
      this.postRequestObject.records[0].employee_details.employee_id = this.formJSONValue.employee_id;
      this.postRequestObject.records[0].employee_details.first_name  = _.capitalize(this.formJSONValue.first_name);
      this.postRequestObject.records[0].employee_details.last_name   = _.capitalize(this.formJSONValue.last_name);
      this.postRequestObject.records[0].employee_details.gender      = this.formJSONValue.gender;
      this.postRequestObject.records[0].employee_details.phone       = this.formJSONValue.phone;
      this.postRequestObject.records[0].employee_details.email       = this.formJSONValue.email;
      this.postRequestObject.records[0].employee_details.address     = this.formJSONValue.address;
      this.postRequestObject.records[0].employee_details.city        = _.capitalize(this.formJSONValue.city);
      this.postRequestObject.records[0].employee_details.area        = _.capitalize(this.formJSONValue.area);
      this.postRequestObject.records[0].employee_details.pincode     = this.formJSONValue.pincode;
      this.postRequestObject.records[0].employee_meta.job_role       = this.formJSONValue.job_role;
      this.postRequestObject.records[0].employee_meta.joining_date   = this.formJSONValue.joining_date;
      this.postRequestObject.records[0].employee_meta.alt_name       = this.formJSONValue.alt_name;
      this.postRequestObject.records[0].employee_meta.alt_phone      = this.formJSONValue.alt_phone;
      this.postRequestObject.records[0].employee_meta.birth_date  = this.formJSONValue.birth_date;
      this.postRequestObject.records[0].employee_meta.econtact_address  = this.formJSONValue.econtact_address;
      this.postRequestObject.records[0].employee_meta.econtact_name  = this.formJSONValue.econtact_name;
      this.postRequestObject.records[0].employee_meta.econtact_number  = this.formJSONValue.econtact_number;
      this.postRequestObject.records[0].employee_meta.relationship  = this.formJSONValue.relationship;
      this.postRequestObject.records[0].employee_meta.enable_access  = this.formJSONValue.enable_access;
      this.postRequestObject.records[0].employee_meta.login_id       = this.formJSONValue.login_id;
      this.postRequestObject.records[0].employee_meta.password       = this.formJSONValue.password;
    
     // assign additional values
     this.postRequestObject.records[0].employee_details.owner_id        = this.ownerDetails.owner_id;
     this.postRequestObject.records[0].employee_details.created_by      = this.userDetails.user_name;
     this.postRequestObject.records[0].employee_details.created_by_id   = this.userDetails.user_id;
     this.postRequestObject.records[0].employee_details.comments        = this.userDetails.user_name + " created " +  this.formJSONValue.first_name + ' on ' + this.currentDate; 

     // set the status values
     if(this.formJSONValue.status) {
      this.postRequestObject.records[0].employee_details.active  = 'Y' ;
      this.postRequestObject.records[0].employee_details.dmlType = 'U' ;
    }
    else if(!this.formJSONValue.status) {
     this.postRequestObject.records[0].employee_details.active  = 'N' ;
     this.postRequestObject.records[0].employee_details.dmlType = 'D';
    }

      console.log( 
       "%c Pack Object After ***** -------------------------------------------------------------------------- ",
       "background: #8bc34a;font-weight: bold;color: white; "
      );
      console.log(this.postRequestObject);

        //  call sweet alert - Start ________________________________________________________________________________________________________
     swal({
      title: 'Are you sure?',
       type: 'warning',
       text: 'Changes will be saved...',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, Proceed!',
       allowOutsideClick : false,
       allowEscapeKey : false,
       allowEnterKey : false,
       reverseButtons : true
       
   }).then((result) => {

   console.log(result);

   //  Check result of buttom click - start ----------------------------------------------------------------------
   if(result.value) {
                 
         console.log(result.value);

         swal({
           title: 'Processing...',
           titleText: 'Your record is being saved...',
           text: 'Please do not refresh this page or click back button',
           allowOutsideClick : false,
           allowEscapeKey : false,
           allowEnterKey : false,
           onOpen: () => {
             swal.showLoading()
             }
         });


          
         // make post reqest call to send area form data to DB
         //  ~ Start  --  post reqest call-------------------------------------------------------------------------
           this.callHttpPost
           .makeRequest_manageEmployee(this.postRequestObject)
           .subscribe(response => {
             // Log Response - Remove Later
             console.warn(
               "%c ___________________________ Manage Pack Post Response ___________________________",
               "background: #4dd0e1;color: black; font-weight: bold;"
             );

             console.log(response);

             // swal.close();

            // Check reponse for success or failure - start 
            if(response.p_out_mssg_flg = 'S') {
              
                 // swal ~ start -----
                     swal({
                       type: 'success',
                       title: 'Your work has been saved',
                       text: 'Click OK to proceed...',
                       allowOutsideClick : false,
                       allowEscapeKey : false,
                       allowEnterKey : false,
                       showConfirmButton: true
                       
                     }).then((result) => {

                       if(result.value) {
                         this.router.navigateByUrl('/manageemployees');

                       }

                 }) // swal ~ end -----

               }
               else if(response.p_out_mssg_flg = 'E') {

                 // swal ~ start -----
                 swal({
                   type: 'error',
                   title: 'Failed to process your work',
                   text: 'Click OK to proceed...',
                   allowOutsideClick : false,
                   allowEscapeKey : false,
                   allowEnterKey : false,
                   showConfirmButton: true
                   
                 }).then((result) => {

                   if(result.value) {
                     
                     swal.close();

                   }

                 }) // swal ~ end -----

              } // Check reponse for success or failure - start

           });

         //  ~ End  --  post reqest call-------------------------------------------------------------------------

   } //  Check result of buttom click - End ----------------------------------------------------------------------

 });  //  call sweet alert - End ___________________________________________________________________________________________________ 




      // this.callHttpPost.makeRequest_manageEmployee(this.postRequestObject).subscribe(
      //   response => {
      //     // Log Response - Remove Later
      //     console.warn(
      //       "%c ___________________________ Manage Employee Post Response ___________________________",
      //       "background: #4dd0e1;color: black; font-weight: bold;"
      //     );
      

      //     console.log(response);
      // }
      // )
      

  }else {
    this.validateFields.validateAllFormFields(this.editEmployee);
    // this.notification.ShowPreDefinedMessage('w','CMN-001');
  }

}

//  ~ End - onSubmit _______________________________________________________________________

//>>>>>  @details :  Local Functions ###############################################################
//  ~ Start - Local Functions _______________________________________________________________________

// function to set status active or inactive 
//  ~ Start -setStatus ________________________________________________________________________________________
enableAccess() {
console.log("-------------- Status Clicked --------------");

this.isEnabled   = !this.isEnabled ;
this.isDisabled = !this.isDisabled ;

this.showCredentials = !this.showCredentials;
 
}  //  ~ End -setStatus ________________________________________________________________________________________

//  ~ Start -enableStatus ________________________________________________________________________________________
enableStatus() {
  console.log("-------------- Status Clicked --------------");
  
  this.isActive   = !this.isActive ;
  this.isInactive = !this.isInactive ;
   
  }  //  ~ End -enableStatus ________________________________________________________________________________________
  

//  ~ End - Local Functions _______________________________________________________________________


}
