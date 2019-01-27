/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR EDIT EXPENSE ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   12-JUN-2018 |   CREATED_BY  |   THAPAS
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Ability to edit expense. 
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
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  AbstractControl,
  Validators,
  FormGroup
} from "@angular/forms";

// Import Additional Libraries
import swal from "sweetalert2";
import * as _ from 'lodash';
import * as moment from 'moment';
import { PersistenceService } from 'angular-persistence';
import { Observable } from 'rxjs/observable';


// Import Services
import { MeCalculatePackPriceService } from "../../Service/me-calculate-pack-price.service";
import { MeValidateFormFieldsService } from "../../Service/me-validate-form-fields.service";
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { MeDisplayDropdownListService } from "../../Service/me-display-dropdown-list.service";
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";


// Import ~ End _________________________________________________________________________________


@Component({
  selector   : 'app-me-gym-edit-expense',
  templateUrl: './me-gym-edit-expense.component.html',
  styleUrls  : ['./me-gym-edit-expense.component.scss']
})
export class MeGymEditExpenseComponent implements OnInit {
//>>>>> @details - Class variable declaration ~ Start ___________________________________________

  // Form Group
  editExpense: FormGroup;

  //-- Create List of Fields
  expense_title      : AbstractControl;
  expense_category   : AbstractControl;
  expense_subcategory: AbstractControl;
  expense_description: AbstractControl;
  expense_date       : AbstractControl;
  expense_price_type : AbstractControl;
  expense_amount     : AbstractControl;
  expense_id         : AbstractControl;

  // Public Local Variables
  _expenseCategorySelect : any = [];
  _expenseSubCategorySelect: any = [];
  _subCat : Observable<any>;
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

  displayCurrentExpenseTitle: any = "None";
  displayCurrentCategory    : any = "None";
  displaySubCategory        : any = "None";
  displayCurrentExpenseDate : any = new Date();
  displayCurrenttotal       : any = 0;

  displayCreatedBy : any = "None";
  displayCreatedOn : any = new Date();
  displayModifiedBy : any = "None";
  displayModifiedOn : any = new Date();

  IsformValid  : any = "";
  ShowPackPrice: boolean = false;
  ShowPackName : boolean = false;
  checkValue   : any;

  // Private Local Variables
  private userDetails : any = "";
  private ownerDetails : any = "";
  private formJSONValue     :    any    =     {};
  private _expenseList      :    any    =     [];
  private expense_id_param  :    number =     0;
  private exp_cat           : any ;
  private currentDate         = new Date().toString();
  private postRequestObject: any = {
    records: [
      {
        expense_id: null,
        expense_title: null,
        expense_description: null,
        expense_category_id: null,
        expense_category: null,
        expense_subcategory: null,
        expense_date: null,
        expense_price_type: null,
        expense_amount: null,
        base_price: null,
        cgst_amount: null,
        sgst_amount: null,
        total_tax: null,
        total_amount: null,
        gst_applied: null,
        owner_id: null,
        modified_by_id: null,
        modified_by: null,
        active: "Y",
        dmlType: "U",
        recordType: "E"
      }
    ]
  };

  // private variables
  private getResponseAPI_Input : any = {
      records : [{
        owner_id : null,
        expense_id  : null
      }]
  }


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
    public  route             : ActivatedRoute,
  ) {
    // assign fields and validators to form group
    this.editExpense = fb.group({
      expense_title      : [''],
      expense_category   : [null, Validators.required],
      expense_subcategory   : [null, Validators.required],
      expense_date       : [null, Validators.required],
      expense_price_type : [null, Validators.required],
      expense_amount     : [null, Validators.required],
      expense_description: [null],
      expense_id: [null]
    });

    // map form fields and controls
    this.expense_id          = this.editExpense.controls["expense_id"];
    this.expense_title       = this.editExpense.controls["expense_title"];
    this.expense_description = this.editExpense.controls["expense_description"];
    this.expense_category    = this.editExpense.controls["expense_category"];
    this.expense_subcategory = this.editExpense.controls["expense_subcategory"];
    this.expense_price_type  = this.editExpense.controls["expense_price_type"];
    this.expense_amount      = this.editExpense.controls["expense_amount"];

    // Expense Title Value Changes __________________________________________
    // this.expense_title.valueChanges.subscribe((value: string) => {
    //   console.log(value);
    //   // if (value) {
    //   //   this.displayExpenseTitle = _.capitalize(value);
    //   // } else {
    //   //   this.displayExpenseTitle = "None";
    //   // }

    // });

    // Expense Category Value Changes __________________________________________
    this.expense_category.valueChanges.subscribe((value: string) => {
      if (value) {
        
          this.displayCurrentCategory = value;
          // this.getExpenseSubCategoryArray(value);
          this._expenseSubCategorySelect = this.displayDropDown.getExpenseSubCategoryArray(value);
        

      } else {
        console.log('None');
        this.displayCurrentCategory = "None";
      }
    });

    this.expense_subcategory.valueChanges.subscribe((value: string) => {
      if (value) {
        this.displaySubCategory = value;
      } else {
        this.displaySubCategory = 'None';
      }
    })

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
        this.editExpense.controls["expense_amount"].value,
        this.editExpense.controls["expense_price_type"].value
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
        this.editExpense.controls["expense_amount"].value,
        this.editExpense.controls["expense_price_type"].value
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

    // assign drop down values
    this.expense_id_param = +this.route.snapshot.params["id"];
    this.exp_cat = this.route.snapshot.paramMap.get('category');
    console.log("---- --- --- Display ID and Expense Category Received ---- --- ---");
    console.log(this.expense_id_param);
    console.log(this.exp_cat);

    this._expenseSubCategorySelect = this.displayDropDown.getExpenseSubCategoryArray(this.exp_cat);
    // this.getExpenseSubCategoryArray(this.exp_cat).subscribe(result => {
    //   this._expenseSubCategorySelect = result;
    // });
    // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",this._expenseSubCategorySelect);

    

     // set variables
     this.userDetails =  this.persistenceService.get('userDetails', StorageType.SESSION);
     this.ownerDetails =  this.persistenceService.get('ownerDetails', StorageType.SESSION);

    // assign values to input object
    this.getResponseAPI_Input.records[0].owner_id   = this.ownerDetails.owner_id;
    this.getResponseAPI_Input.records[0].expense_id = this.expense_id_param;

    console.log(
          "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
          "background: #5e35b1;color: white; font-weight: bold;"
    );
    console.log( this.getResponseAPI_Input);

    this.callHttpPost
    .makeRequest_getExpense( this.getResponseAPI_Input)
    .subscribe(response => {
     
      console.log(
        "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
        "background: #ADF11A;color: black; font-weight: bold;"
   );
      console.log(response);

      // assign to local variable
      this._expenseList = response.expenseList;
      
      if(this._expenseList.length > 0){
        
        // assign values to form variables
        // this.getExpenseSubCategoryArray(this._expenseList[0].category);
        this.editExpense.controls["expense_id"].setValue(this._expenseList[0].expense_id);
        this.editExpense.controls["expense_subcategory"].setValue(this._expenseList[0].subcategory);
        this.editExpense.controls["expense_category"].setValue(this._expenseList[0].category);
        this.editExpense.controls["expense_description"].setValue(this._expenseList[0].description);
        this.editExpense.controls["expense_date"].setValue(this._expenseList[0].expense_date);
        this.editExpense.controls["expense_price_type"].setValue(this._expenseList[0].price_type);
        this.editExpense.controls["expense_amount"].setValue(this._expenseList[0].amount);

        // assign values to current variables
        // this.displayCurrentExpenseTitle = this._expenseList[0].title;
        this.displayCurrentCategory     = this._expenseList[0].category;
        this.displaySubCategory         = this._expenseList[0].subcategory;
        this.displayCurrentExpenseDate  = new Date(this._expenseList[0].expense_date);
        this.displayCurrenttotal        = this._expenseList[0].total_amount;

        // assign values to current variables
        this.displayCreatedBy  = _.capitalize(this._expenseList[0].created_by);
        this.displayCreatedOn  = this._expenseList[0].created_on;
        this.displayModifiedBy = _.capitalize(this._expenseList[0].modified_by);
        this.displayModifiedOn = this._expenseList[0].modified_on;

        //hide progress bar
        // this.showProgressBar = false;

   
      } 
      else {

        // this.showProgressBar = false;
        // this.showNoRecords = true; 

        console.log(
          "%c ---------------------------- *****  NO RESPONSE ***** ---------------------------- ",
          "background: #e57373 ;color: white; font-weight: bold;"
         );
       
      }



       // hide progress bar
    });
  
  


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
    console.log(this.editExpense);
    if (this.editExpense.valid) {
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
      this.postRequestObject.records[0].expense_id          = this.formJSONValue.expense_id;
      // this.postRequestObject.records[0].expense_title       =  _.capitalize(this.formJSONValue.expense_title);
      // this.postRequestObject.records[0].expense_category_id = this.formJSONValue.expense_category;
      this.postRequestObject.records[0].expense_date        = moment(this.formJSONValue.expense_date).add('330', 'minute');
      this.postRequestObject.records[0].expense_price_type  = this.formJSONValue.expense_price_type;
      this.postRequestObject.records[0].expense_amount      = this.formJSONValue.expense_amount;
      this.postRequestObject.records[0].expense_category      = this.formJSONValue.expense_category;
      this.postRequestObject.records[0].expense_subcategory      = this.formJSONValue.expense_subcategory;
      this.postRequestObject.records[0].expense_description = _.capitalize(this.formJSONValue.expense_description);
      this.postRequestObject.records[0].base_price          = this.calculatePrice.base_price;
      this.postRequestObject.records[0].cgst_amount         = this.calculatePrice.cgst_amount;
      this.postRequestObject.records[0].sgst_amount         = this.calculatePrice.sgst_amount;
      this.postRequestObject.records[0].total_tax           = this.calculatePrice.total_tax;
      this.postRequestObject.records[0].total_amount        = this.calculatePrice.total_amount;

      this.postRequestObject.records[0].owner_id           = this.ownerDetails.owner_id;

      this.postRequestObject.records[0].modified_by    = this.userDetails.user_name;
      this.postRequestObject.records[0].modified_by_id = this.userDetails.user_id;
      this.postRequestObject.records[0].comments       = this.userDetails.user_name + " modified the expense on " + this.currentDate ;

      if (
        this.formJSONValue.expense_price_type === "NT"
      ) {
        this.postRequestObject.records[0].gst_applied = "N";
        console.log(
          "GST applied ",
          this.postRequestObject.records[0].gst_applied
        );
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
      
      // // assign category value
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
      this.validateFields.validateAllFormFields(this.editExpense);
      // this.notification.ShowPreDefinedMessage('w','CMN-001');
    }
  }

  //  ~ End - onSubmit _______________________________________________________________________



  // getExpenseSubCategoryArray(value : any): Observable<any> {
  //   switch(value) {
  //     case 'Administration': {
  //       this._expenseSubCategorySelect = this.displayDropDown.getExpenseAdminSubCat();
  //       return this._expenseCategorySelect;
  //       break;
  //     }
  //     case 'Salary': {
  //       this._expenseSubCategorySelect = this.displayDropDown.getExpenseSalarySubCat();
  //       return this._expenseCategorySelect;
  //       break;
  //     }
  //     case 'Utility Bills': {
  //       this._expenseSubCategorySelect = this.displayDropDown.getExpenseUtilitySubCat();
  //       return this._expenseCategorySelect;
  //       break;
  //     }
  //     case 'Purchase': {
  //       this._expenseSubCategorySelect = this.displayDropDown.getExpensePurchaseSubCat();
  //       return this._expenseCategorySelect;
  //       break;
  //     }
  //     case 'Fitness Enablers': {
  //       this._expenseSubCategorySelect = this.displayDropDown.getExpenseFitEnbSubCat();
  //       return this._expenseCategorySelect;
  //       break;
  //     }
  //     case 'Maintenance': {
  //       this._expenseSubCategorySelect = this.displayDropDown.getExpenseMaintSubCat();
  //       return this._expenseCategorySelect;
  //       break;
  //     }
  //     case 'Medical': {
  //       this._expenseSubCategorySelect = this.displayDropDown.getExpenseMedicalSubCat();
  //       return this._expenseCategorySelect;
  //       break;
  //     }
  //     case 'Others' : {
  //       this._expenseSubCategorySelect = this.displayDropDown.getExpenseOthersSubCat();
  //       return this._expenseCategorySelect;
  //       break;
  //     }
  // }
// }
}
//>>>>> @details : Component & Class Definition - End #########################################