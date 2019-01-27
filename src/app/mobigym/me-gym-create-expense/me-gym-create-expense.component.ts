/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR CREATE EXPENSE ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   12-JUN-2018 |   CREATED_BY  |   THAPAS
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Ability to add expense. 
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
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  AbstractControl,
  Validators,
  FormGroup
} from "@angular/forms";

// Import Additional Libraries
import { PersistenceService } from 'angular-persistence';
import swal from "sweetalert2";
import * as _ from 'lodash';
import * as moment from 'moment';

// Import Services
import { MeCalculatePackPriceService } from "../../Service/me-calculate-pack-price.service";
import { MeValidateFormFieldsService } from "../../Service/me-validate-form-fields.service";
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { MeDisplayDropdownListService } from "../../Service/me-display-dropdown-list.service";
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";


// Import ~ End _________________________________________________________________________________

//>>>>> @details : Component & Class Definition - Start #########################################
@Component({
  selector: "app-me-gym-create-expense",
  templateUrl: "./me-gym-create-expense.component.html",
  styleUrls: ["./me-gym-create-expense.component.scss"]
})
export class MeGymCreateExpenseComponent implements OnInit {
  //>>>>> @details - Class variable declaration ~ Start ___________________________________________

  // Form Group
  createExpense: FormGroup;

  //-- Create List of Fields
  expense_title: AbstractControl;
  expense_category: AbstractControl;
  expense_subcategory: AbstractControl;
  expense_description: AbstractControl;
  expense_date: AbstractControl;
  expense_price_type: AbstractControl;
  expense_amount: AbstractControl;

  // Public Local Variables
  _expenseCategorySelect: any = [];
  _expenseSubCategorySelect: any = [];
  _expensePriceTypeSelect: any = [];

  showDuration     : boolean = false;
  displaybase_price: number  = 0;
  displaycgst      : number  = 0;
  displaygst       : number  = 0;
  displaytotal_tax : number  = 0;
  displaytotal     : number  = 0;

  displayigst      : number  = 0;
  gstAmount        : number  = 0;
  igstAmount       : number  = 0;

  igstSelected     : boolean;
  gstSelected      : boolean;
  nonTaxable       : boolean;

  displayExpenseTitle   : any = "None";
  displayCategory       : any = "None";
  displaySubCategory    : any = "None";
  displayExpenseDate    : any = new Date();

  IsformValid  : any = "";
  ShowPackPrice: boolean = false;
  ShowPackName : boolean = false;
  checkValue   : any;

  // Private Local Variables
  private userDetails : any = "";
  private ownerDetails : any = "";
  private formJSONValue: any = {};
  private currentDate         = new Date().toString();
  private postRequestObject: any = {
    records: [
      {
        expense_title      : null,
        expense_description: null,
        expense_category_id: null,
        expense_category   : null,
        expense_subcategory: null,
        expense_date       : null,
        expense_price_type : null,
        expense_amount     : null,
        base_price         : null,
        cgst_amount        : null,
        sgst_amount        : null,
        total_tax          : null,
        total_amount       : null,
        gst_applied        : null,
        owner_id           : null,
        created_by_id      : null,
        created_by         : null,
        active             : "Y",
        dmlType            : "I",
        recordType         : "N"
      }
    ]
  };

  //>>>>> @details - Class variable declaration ~ End ___________________________________________

  //>>>>>  @details :  constructor ###############################################################
  //  ~ Start - constructor _______________________________________________________________________
  constructor(
            fb                : FormBuilder,
    public  calculatePrice    : MeCalculatePackPriceService,
    private validateFields    : MeValidateFormFieldsService,
    private callHttpPost      : MeCallHttpPostService,
    private displayDropDown   : MeDisplayDropdownListService,
    private persistenceService: PersistenceService,
    public  router            : Router,
  ) {
    // assign fields and validators to form group
    this.createExpense = fb.group({
      expense_title      : [''],
      expense_category   : [null, Validators.required],
      expense_subcategory   : [null, Validators.required],
      expense_date       : [null, Validators.required],
      expense_price_type : [null, Validators.required],
      expense_amount     : [null, Validators.required],
      expense_description: [null]
    });

    // map form fields and controls

    this.expense_title = this.createExpense.controls["expense_title"];
    this.expense_description = this.createExpense.controls["expense_description"];
    this.expense_category = this.createExpense.controls["expense_category"];
    this.expense_subcategory = this.createExpense.controls["expense_subcategory"];
    this.expense_price_type = this.createExpense.controls["expense_price_type"];
    this.expense_amount = this.createExpense.controls["expense_amount"];

    // Expense Title Value Changes __________________________________________
    // this.expense_title.valueChanges.subscribe((value: string) => {
    //   if (value) {
    //     this.displayExpenseTitle = _.capitalize(value);
    //   } else {
    //     this.displayExpenseTitle = "None";
    //   }
    // });


    // Expense Category Value Changes __________________________________________
    this.expense_category.valueChanges.subscribe((value: string) => {
      if (value) {
        // extra the object from array
        // let getCategoryObject: any = _.filter(
        //   this._expenseCategorySelect,
        //   function(obj) {
        //     return obj.value == value;
        //   }
        // );
        // console.log("---- getCategoryObject ----");
        // console.log(getCategoryObject);

        switch(value) {
          case 'Administration': {
            this._expenseSubCategorySelect = this.displayDropDown.getExpenseAdminSubCat();
            break;
          }
          case 'Salary': {
            this._expenseSubCategorySelect = this.displayDropDown.getExpenseSalarySubCat();
            break;
          }
          case 'Utility Bills': {
            this._expenseSubCategorySelect = this.displayDropDown.getExpenseUtilitySubCat();
            break;
          }
          case 'Purchase': {
            this._expenseSubCategorySelect = this.displayDropDown.getExpensePurchaseSubCat();
            break;
          }
          case 'Fitness Enablers': {
            this._expenseSubCategorySelect = this.displayDropDown.getExpenseFitEnbSubCat();
            break;
          }
          case 'Maintenance': {
            this._expenseSubCategorySelect = this.displayDropDown.getExpenseMaintSubCat();
            break;
          }
          case 'Medical': {
            this._expenseSubCategorySelect = this.displayDropDown.getExpenseMedicalSubCat();
            break;
          }
          case 'Others' : {
            this._expenseSubCategorySelect = this.displayDropDown.getExpenseOthersSubCat();
            break;
          }

        }

        this.displayCategory = value;
      } else {
        this.displayCategory = "None";
      }
    });

    this.expense_subcategory.valueChanges.subscribe((value: string) => {
      if (value) {
        this.displaySubCategory = value;
      } else {
        this.displaySubCategory = 'None';
      }
    });

     // Expense Date Value Changes __________________________________________
    //  this.expense_date.valueChanges.subscribe((value: string) => {
    //   if (value) {
    //     this.displayExpenseDate = value;
    //   } else {
    //     this.displayExpenseDate = new Date();
    //   }
    // });

    // Subscribe Expense Price Type Value Changes __________________________________________
    this.expense_price_type.valueChanges.subscribe((value: string) => {
      console.log("------ Expense Type Changed Value ------");
      console.log(value);

      

      // Calculate the price pack details
      this.calculatePrice.calculatePackPrice(
        this.createExpense.controls["expense_amount"].value,
        this.createExpense.controls["expense_price_type"].value
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

     // Subscribe Pack Price Value Changes __________________________________________
     this.expense_amount.valueChanges.subscribe((value: string) => {
      console.log("------ Expense Amount Changed Value ------");
      console.log(value);

      // Calculate the price pack details
      this.calculatePrice.calculatePackPrice(
        this.createExpense.controls["expense_amount"].value,
        this.createExpense.controls["expense_price_type"].value
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


  }
  //  ~ End - constructor ____________________________________________________________________________________

  //>>>>>  @details :  ngOnInit ###############################################################
  //  ~ Start - ngOnInit _______________________________________________________________________

  ngOnInit() {
    // assign drop down values
    this._expenseCategorySelect = this.displayDropDown.getExpenseCategory();
    this._expensePriceTypeSelect = this.displayDropDown.getPriceType();

    // set variables
    this.userDetails =  this.persistenceService.get('userDetails', StorageType.SESSION);
    this.ownerDetails =  this.persistenceService.get('ownerDetails', StorageType.SESSION);

    console.log("--Cache Values--");
    console.log(this.userDetails);
    console.log(this.ownerDetails);

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
    console.log(this.createExpense);
    if (this.createExpense.valid) {
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
      // this.postRequestObject.records[0].expense_title       =   _.capitalize(this.formJSONValue.expense_title) ;
      // this.postRequestObject.records[0].expense_category_id = this.formJSONValue.expense_category;
      this.postRequestObject.records[0].expense_date        = moment(this.formJSONValue.expense_date).add('330', 'minute');
      this.postRequestObject.records[0].expense_price_type  = this.formJSONValue.expense_price_type;
      this.postRequestObject.records[0].expense_category    = this.formJSONValue.expense_category;
      this.postRequestObject.records[0].expense_subcategory = this.formJSONValue.expense_subcategory;
      this.postRequestObject.records[0].expense_amount      = this.formJSONValue.expense_amount;
      this.postRequestObject.records[0].expense_description = this.formJSONValue.expense_description;
      this.postRequestObject.records[0].base_price          = this.calculatePrice.base_price;
      this.postRequestObject.records[0].cgst_amount         = this.calculatePrice.cgst_amount;
      this.postRequestObject.records[0].sgst_amount         = this.calculatePrice.sgst_amount;
      this.postRequestObject.records[0].total_tax           = this.calculatePrice.total_tax;
      this.postRequestObject.records[0].total_amount        = this.calculatePrice.total_amount;

      this.postRequestObject.records[0].owner_id      = this.ownerDetails.owner_id;
      this.postRequestObject.records[0].created_by    = this.userDetails.user_name;
      this.postRequestObject.records[0].created_by_id = this.userDetails.user_id;
      this.postRequestObject.records[0].comments      = this.userDetails.user_name + " created " +
                          this.formJSONValue.expense_title + '. Expense amount Rs. ' + this.calculatePrice.total_amount + ' on ' + this.currentDate; 

      if ( this.formJSONValue.expense_price_type === "NT") {
        this.postRequestObject.records[0].gst_applied = "N";
        console.log( "GST applied ", this.postRequestObject.records[0].gst_applied  );
      } else {
        this.postRequestObject.records[0].gst_applied = "Y";
      }

      //  // extract the object from array
      //  let category_id = this.formJSONValue.expense_category;
      //  let getCategoryObject: any = _.filter(
      //   this._expenseCategorySelect,
      //   function(obj) {
      //     return obj.value == category_id;
      //   }
      // );
      
      // assign category value
      // this.postRequestObject.records[0].expense_category = _.capitalize(getCategoryObject[0].label);


      console.log(
        "%c Pack Object After ***** -------------------------------------------------------------------------- ",
        "background: #8bc34a;font-weight: bold;color: white; "
      );
      console.log(JSON.stringify(this.postRequestObject));

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
             .makeRequest_manageExpense(this.postRequestObject)
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
                           this.router.navigateByUrl('/manageexpense');

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

 
    } else {
      this.validateFields.validateAllFormFields(this.createExpense);
      // this.notification.ShowPreDefinedMessage('w','CMN-001');
    }
  }

  //  ~ End - onSubmit _______________________________________________________________________
}
//>>>>> @details : Component & Class Definition - End #########################################
