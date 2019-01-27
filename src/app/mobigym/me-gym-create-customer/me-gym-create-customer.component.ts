
/*
------------------------------------------------------------------------------------------------
## COMPONENT OBJECT FOR CREATE CUSTOMER ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   28-JUN-2018 |   CREATED_BY  |   PRIYANK
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Ability to create customer. 
|      
|   
------------------------------------------------------------------------------------------------
## CHANGE LOG DETAILS 				##
------------------------------------------------------------------------------------------------
|   ++ 28-JUN-2018    v1.0     - Created the New Component.
|   ++
------------------------------------------------------------------------------------------------
*/

//>>>>> @details : Angular Core and Custom Imports  ##############################################
// Import ~ Start _________________________________________________________________________________

// Import Angular Core

import { Component, OnInit, NgZone } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    AbstractControl,
    Validators
} from '@angular/forms';


// Import Additional Libraries
import swal from "sweetalert2";
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/observable';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router'
import * as S3 from 'aws-sdk/clients/s3';


// Import Services
import { MeValidateFormFieldsService } from "../../Service/me-validate-form-fields.service";
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { MeDisplayDropdownListService } from '../../Service/me-display-dropdown-list.service';
// import { MeTitleCaseService } from '../../Service/me-title-case.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { PersistenceService } from 'angular-persistence';
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";

declare var jsPDF: any;

// Import ~ End _________________________________________________________________________________

//>>>>> @details : Component & Class Definition - Start #########################################

@Component({
    selector: 'app-me-gym-create-customer',
    templateUrl: './me-gym-create-customer.component.html',
    styleUrls: ['./me-gym-create-customer.component.scss']
})

export class MeGymCreateCustomerComponent implements OnInit {
    //>>>>> @details - Class variable declaration ~ Start ___________________________________________

    // Form Group
    customer_details                 : FormGroup
    subscription_details             : FormGroup
    payment_details                  : FormGroup
    customer_meta                    : FormGroup

    //-- Create List of Fields
    first_name                      : AbstractControl
    last_name                       : AbstractControl
    gender                          : AbstractControl
    phone                           : AbstractControl
    email                           : AbstractControl
    address                         : AbstractControl
    city                            : AbstractControl
    area                            : AbstractControl
    pincode                         : AbstractControl
    customer_id                     : AbstractControl
    payment_mode                    : AbstractControl

    age                             : AbstractControl
    height                          : AbstractControl
    weight                          : AbstractControl
    blood_group                     : AbstractControl
    registration_date               : AbstractControl
    activation_date                 : AbstractControl
    select_prepaid_pack             : AbstractControl
    select_postpaid_pack            : AbstractControl
    payment_type                    : AbstractControl
    payment_amount                  : AbstractControl
    reminder_day                    : AbstractControl
    fullName                        : AbstractControl
    ePhone                          : AbstractControl
    eAddress                        : AbstractControl
    image                           : AbstractControl
    relationship                    : AbstractControl

    prepaidPack_activation_date     : AbstractControl
    postpaidPack_activation_date    : AbstractControl
    pack_expiry_date                : AbstractControl
    due_date                        : AbstractControl
    extention_period                : AbstractControl

    // Public Local Variables
    imageSelectedFlag               : Boolean = false;
    genderSelect                    : Array<any>;
    subscriptionTypeSelect          : Array<any>;
    paymentTypeSelect               : Array<any>;
    reminderDaySelect               : Array<any>;
    _bloodGroupType                 : Array<any>;
    _paymentMode                    : Array<any>;
    _packList                       : any[];
    _prepaidPackList                : any[];
    _postpaidPackList               : any[];
    _enquiry                        : any;
    packName                        : string[];
    prepaid                         : boolean
    openingBalanceObject            : any
    filteredPack                    : Observable<any>;
    pack_obj                        : any;
    selectedPaymentType             : string
    enteredPaymentAmount            : number

    paymentArray                    : any = []
    prepaidPackArray                : any = []
    postpaidPackArray               : any = []
    _customerList                   : any = []
    _customerId                     : any = []
    _ownerDetails                   : any;
    _userDetails                    : any;
    _relationshipType               : any;  
    invoice_id                      : any;

    currentDate                     : Date
    minDate                         : Date
    maxDate                         : Date
    oneMonth                        : Date

    packDuration                    : string
    packDurationType                : string
    reminderHelpText                : string
    showDuplicate                   : any

    registrationExists              : Boolean
    discountExists                  : Boolean
    depositExists                   : Boolean
    displayDueDate                  : Boolean = false;
    displayExtPeriod                : Boolean = false;
    displayNextPaymentInfo          : Boolean = false;
    openingBalanceExists            : any
    selectedPack                    : string
    duration                        : string
    packActivationDate              : any;
    packExpiryDate                  : any;
    bmiValue                        : number
    customerAge                     : any;
    weightVal                       : number
    heightVal                       : number

    total_prepaid_base_price        : number = 0
    total_prepaid_cgst_amount       : number = 0
    total_prepaid_sgst_amount       : number = 0
    total_prepaid_tax_amount        : number = 0
    total_prepaid_amount_value      : number = 0

    total_postpaid_base_price       : number = 0
    total_postpaid_cgst_amount      : number = 0
    total_postpaid_sgst_amount      : number = 0
    total_postpaid_tax_amount       : number = 0
    total_postpaid_amount_value     : number = 0
    previousDue                     : number = 0
    date : Date;
    // selected_postpaid_pack_obj = {
    //     'pack_name'                 : null,
    //     'pack_activation_date'      : this.date,
    //     'pack_expiry_date'          : null,
    //     'pack_duration'             : null,
    //     'pack_duration_type'        : '',
    //     'pack_type'                 : null,
    //     'pack_id'                   : null,
    //     'base_price'                : null,
    //     'cgst_amount'               : null,
    //     'sgst_amount'               : null,
    //     'total_tax'                 : null,
    //     'total_amount'              : null
    // }
    selected_prepaid_pack_obj = {
        'pack_name'                 : null,
        'pack_activation_date'      : this.date,
        'pack_expiry_date'          : null,
        'pack_duration'             : null,
        'pack_duration_type'        : '',
        'pack_type'                 : null,
        'pack_id'                   : null,
        'base_price'                : null,
        'cgst_amount'               : null,
        'sgst_amount'               : null,
        'total_tax'                 : null,
        'total_amount'              : null
    }

    //Url Variabes
    public id                       : any;
    public source                   :string;

    // Private Local Variables
    private formValuesJSON              : any = null;
    private getPackResponseAPI_Input    : any = {
        records: [{
            "owner_id": null,
        }]
    }
    private getEnquiryResponseObject    : any = {
        records : [{
            "owner_id": null,
            "enquiry_id" : null
        }]
    }
    private postRequestObject = {
        records: [
            {
                "subscription_details": [
                    {
                        "prepaid_pack_details"      : '',
                        "postpaid_pack_details"     : ''
                    }
                ],

                "subscription_summary": {

                    "total_prepaid_packs"           : 0,
                    "total_prepaid_base_price"      : 0,
                    "total_prepaid_cgst_amount"     : 0,
                    "total_prepaid_sgst_amount"     : 0,
                    "total_prepaid_tax"             : 0,
                    "total_prepaid_amount"          : 0,
                    "total_postpaid_packs"          : 0,
                    "total_postpaid_base_price"     : 0,
                    "total_postpaid_cgst_amount"    : 0,
                    "total_postpaid_sgst_amount"    : 0,
                    "total_postpaid_tax"            : 0,
                    "total_postpaid_amount"         : 0
                },

                "payment_details" : '',

                "customer_details": {
                    "first_name"                    : '',
                    "last_name"                     : '',
                    "full_name"                     : '',
                    "gender"                        : '',
                    "phone"                         : '',
                    "email"                         : '',
                    "address"                       : '',
                    "city"                          : '',
                    "area"                          : '',
                    "pincode"                       : '',
                    "owner_id"                      : 0,
                    "created_by"                    : '',
                    "created_on"                    : '',
                    "created_by_id"                 : 0,
                    "customer_id"                   : '',
                    "comments"                      : '',
                    "dmlType"                       : 'I',
                    "active"                        : 'Y',
                    "recordType"                    : 'N',
                    "image"                         : '',
                    "discount"                      : null,
                    "due_date"                      : null, 
                    "payment_mode"                  : ''

                },
                "customer_meta": {
                    "age"                           : '',
                    "dob"                           : '',
                    "weight"                        : '',
                    "height"                        : '',
                    "registration_date"             : '',
                    "fullName"                      : '',
                    "ePhone"                        : '',
                    "eAddress"                      : '',
                    "relationship"                  : '',
                    "blood_group"                   : ''
                },
                "enquiry_details" : {
                    "enquiry_id"                    : null,
                    "enquiry_status"                : null
                }
            }
        ]
    }

// Image Upload Variables
    FOLDER = 'mobifit/';
    selectedFiles: FileList;
    fileLocation:any;
    locationUrl:any;


    //>>>>> @details - Class variable declaration ~ End ___________________________________________

    //>>>>>  @details :  constructor ###############################################################
    //  ~ Start - constructor _______________________________________________________________________

    constructor(
        fb: FormBuilder,
        private validateFields              : MeValidateFormFieldsService,
        private callHttpPost                : MeCallHttpPostService,
        private toastService                : ToastService,
        private displayDropDown             : MeDisplayDropdownListService,
        // private capitalise                  : MeTitleCaseService,
        public router                       : Router,
        private route                       : ActivatedRoute,
        private createCustomerPersistenceService : PersistenceService,
        private zone                        : NgZone
    ) {
        // assign fields and validators to form group
        this.customer_details = fb.group({
            first_name                      : [null, Validators.required],
            last_name                       : ['',],
            gender                          : ['', Validators.required],
            phone                           : ['', Validators.required],
            email                           : ['',],
            address                         : ['',],
            city                            : ['',],
            area                            : ['',],
            pincode                         : ['',],
            customer_id                     : ['', Validators.required],
            image                           : [''],
            due_date                        : [''],
            payment_mode                    : ['']

        })

        this.customer_meta = fb.group({
            age                             : ['',],
            height                          : ['', ],
            weight                          : ['', ],
            registration_date               : ['', Validators.required],
            fullName                        : ['', ],
            ePhone                          : ['', ],
            eAddress                        : ['', ],
            relationship                    : ['', ],
            blood_group                     : ['',]
        })

        this.subscription_details = fb.group({
            select_prepaid_pack              : [null],
            select_postpaid_pack             : [null],
            prepaidPack_activation_date      : [null],
            postpaidPack_activation_date     : [null],
            extention_period                : [null]

        })

        this.payment_details = fb.group({
            payment_type                    : [''],
            payment_amount                  : ['']
        })


        // map form fields and controls

        this.first_name             = this.customer_details.controls['first_name']
        this.last_name              = this.customer_details.controls['last_name']
        this.gender                 = this.customer_details.controls['gender']
        this.phone                  = this.customer_details.controls['phone']
        this.email                  = this.customer_details.controls['email']
        this.address                = this.customer_details.controls['address']
        this.city                   = this.customer_details.controls['city']
        this.area                   = this.customer_details.controls['area']
        this.pincode                = this.customer_details.controls['pincode']
        this.customer_id            = this.customer_details.controls['customer_id']
        this.image                  = this.customer_details.controls['image']
        this.due_date               = this.customer_details.controls['due_date']
        this.payment_mode           = this.customer_details.controls['payment_mode']

        this.age                    = this.customer_meta.controls['age']
        this.height                 = this.customer_meta.controls['height']
        this.weight                 = this.customer_meta.controls['weight']
        this.blood_group            = this.customer_meta.controls['blood_group']
        this.registration_date      = this.customer_meta.controls['registration_date']
        this.fullName               = this.customer_meta.controls['fullName']
        this.ePhone                 = this.customer_meta.controls['ePhone']
        this.eAddress               = this.customer_meta.controls['eAddress']
        this.relationship           = this.customer_meta.controls['relationship']


        this.select_prepaid_pack            = this.subscription_details.controls['select_prepaid_pack']
        this.select_postpaid_pack           = this.subscription_details.controls['select_postpaid_pack']
        this.prepaidPack_activation_date    = this.subscription_details.controls['prepaidPack_activation_date']
        this.postpaidPack_activation_date   = this.subscription_details.controls['postpaidPack_activation_date']
        this.extention_period               = this.subscription_details.controls['extention_period']

        this.payment_type                   = this.payment_details.controls['payment_type']
        this.payment_amount                 = this.payment_details.controls['payment_amount']
        this.pack_expiry_date               = this.payment_details.controls['pack_expiry_date']

        //Assign Variables
        this.currentDate                    = new Date();
        this.maxDate                        = this.currentDate;
        this.minDate                        = new Date();
        this.minDate.setMonth(this.currentDate.getMonth() - 1)
        console.log('Min Date:', this.minDate)

        this.route.queryParams.subscribe(params => {
            this.id = params["id"];
            this.source = params["Source"];
            });
            console.log('Id',this.id,'source',this.source);


    }

    //  ~ End - constructor ____________________________________________________________________________________

    //>>>>>  @details :  ngOnInit ###############################################################
    //  ~ Start - ngOnInit _______________________________________________________________________

    // onFileSelected(event) {
    //     console.log(event);
    //     this.selectedFile = event.target.files[0];

    //     let reader = new FileReader();
    //     let input = new FormData();

    //     reader.onload = (e: any) => {
    //     this.selectedFile = e.target.result;
    //     input.append('name', this.selectedFile.name);
    //     input.append('value', this.selectedFile.value);

    //     this.customer_details.controls['image'].setValue(input);
    //     console.log("*******image************", this.customer_details.controls['image'])
    //     }

    // reader.readAsDataURL(event.target.files[0]);

    // }

    selectFile(event) 
    {
        this.selectedFiles = event.target.files;
        if (this.selectedFiles)
        {
            this.upload();
        }
        else
        {
            console.log('Please Choose Image File');
            this.toastService.warning('Please Choose Image of JPEG/PNG Format');
        }
        

    }

    upload() {
        const file = this.selectedFiles.item(0);
        var fileName;
        
        if(this.customer_details.controls['customer_id'].value == !'' || this.customer_details.controls['first_name'].value != '')
        {
            fileName = this.customer_details.controls['customer_id'].value + '_' + this.customer_details.controls['first_name'].value + '_' + file.name;
        }
        else
        {
            fileName = file.name;
        }
        
        console.log('fileName:',fileName);
        if(file.size <= 500000 )
        {
            if(file.type == "image/jpeg" || file.type == "image/png")
            {
                
                var self = this;
                this.imageSelectedFlag = true;
                const params = {
                  Bucket: 'mobiezy-image-upload',
                  Key: this.FOLDER + fileName,
                  Body: file,
                  ContentType: file.type
                };
                
                const bucket = new S3(
                  {
                    accessKeyId: 'AKIAIV4NWQ7NTJRRCIXQ',
                    secretAccessKey: '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',
                    region: 'ap-south-1'
                  }
                );
            
            
                var obj= bucket.upload(params, function (err, data) {
                  if (err) {
                    console.log('There was an error uploading your file: ', err);
                    return false;
                  }
            
                  console.log('Successfully uploaded file.', data);
                  self.Response(data);
                  return data;
                });
            }
            else
            {
                console.log('Invalid File Type');
                this.imageSelectedFlag = false;
                this.toastService.warning('File type must be in JPEG/PNG Format');
                this.zone.run(() =>  this.imageSelectedFlag = true)
            }
        }
        else
        {
            console.log('File Size Exceeded!');
            this.imageSelectedFlag = false;
           
            this.toastService.warning('File size must be less than or equal to 500kb');
           
        }
        
    }
    
    Response(value)
    {
        console.log('value',value.Location);
        this.locationUrl=Location;
        this.zone.run(() =>  this.locationUrl=value.Location)
    }


    ngOnInit() {

        
        // assign drop down values
        this.genderSelect               = this.displayDropDown.getGenderDropDown()
        this.subscriptionTypeSelect     = this.displayDropDown.getSubscriptionType()
        this.paymentTypeSelect          = this.displayDropDown.getPaymentType()
        this._relationshipType          = this.displayDropDown.getRelationshipType()
        this._bloodGroupType            = this.displayDropDown.getEnquiryBloodGroup()
        this._paymentMode               = this.displayDropDown.getPaymentMode()

        this._ownerDetails = this.createCustomerPersistenceService.get("ownerDetails", StorageType.SESSION);
        this._userDetails = this.createCustomerPersistenceService.get("userDetails", StorageType.SESSION)
        console.log('*********ownerId*********', this._ownerDetails.owner_id);
        this.subscription_details.controls['extention_period'].setValue(0);
        

        // Check source is manage Enquiry
        if(this.source =='manageenquiry'){

            this.getEnquiryResponseObject.records[0].owner_id = this._ownerDetails.owner_id;
            this.getEnquiryResponseObject.records[0].enquiry_id = this.id;
            
            // Api call for fetching customer information
            this.callHttpPost.makeRequest_getEnquiry(this.getEnquiryResponseObject).subscribe(
            (response) => {
            console.log('****************EnquiryFollowup Response*****************',response);
            this._enquiry = response.enquiry[0];
            console.log('****************this.enquieryFollowArray Response*****************',this._enquiry);
            
            
            this.customer_details.controls['first_name'].setValue(this._enquiry.first_name)
            this.customer_details.controls['last_name'].setValue(this._enquiry.last_name)
            this.customer_details.controls['gender'].setValue(this._enquiry.gender)
            this.customer_details.controls['phone'].setValue(this._enquiry.phone)
            this.customer_details.controls['email'].setValue(this._enquiry.email)
            this.customer_details.controls['address'].setValue(this._enquiry.address)
            this.customer_details.controls['city'].setValue(this._enquiry.city)
            this.customer_details.controls['area'].setValue(this._enquiry.area)
            this.customer_details.controls['customer_id'].setValue(this._enquiry.customer_id)
            this.customer_details.controls['pincode'].setValue(this._enquiry.pincode)
            this.customer_meta.controls['age'].setValue(this._enquiry.age)
            this.customer_meta.controls['height'].setValue(this._enquiry.height)
            this.customer_meta.controls['weight'].setValue(this._enquiry.weight)
            this.customer_meta.controls['registration_date'].setValue(this._enquiry.registration_date)
            this.customer_meta.controls['blood_group'].setValue(this._enquiry.blood_group)

            this.postRequestObject.records[0].enquiry_details.enquiry_id = this.id;
            this.postRequestObject.records[0].enquiry_details.enquiry_status = "CONVERTED";
            
            
            }
            )
            
            }


        


        // assign values to input object
        this.getPackResponseAPI_Input.records[0].owner_id = this._ownerDetails.owner_id;

        console.log(
            "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
            "background: #5e35b1;color: white; font-weight: bold;"
        );
        console.log(this.getPackResponseAPI_Input);

        // Api call for getting packs to display in the dropdown of select pack.
        this.callHttpPost
            .makeRequest_getPack(this.getPackResponseAPI_Input).subscribe(
                (response) => {
                    this._packList = response.packList;
                    console.log("Response Value : ", this._packList)

                    this._prepaidPackList = this._packList.filter(
                        (packList) => packList.pack_type === 'prepaid'
                    )
                    console.log('prepaid', this._prepaidPackList)

                    this._postpaidPackList = this._packList.filter(
                        (packList) => packList.pack_type === 'postpaid'
                    )
                    console.log('postpaid', this._postpaidPackList)
                }
            )
            // Api call to display last 10 Customer id 
        this.callHttpPost.makeRequest_getCustomerList(this.getPackResponseAPI_Input).subscribe(
            (response) => {
                this._customerList = response.customerList;
                console.log('Response value ', this._customerList)
                let idArray : any = []
                
                this._customerList.filter(
                (object) => {
                    let idObj   : any = {
                        "customer_id" : null,
                        "customer_name" : null,
                        "created_on"   : null
                    }
                    idObj.customer_id = object.customer_id;
                    idObj.customer_name = object.full_name;
                    idObj.created_on = object.created_on;
                    idArray.push(idObj);
                }
            )
                this._customerId = idArray.reverse().slice(0,10);
                
                console.log('************Customer Id Array************* ', this._customerId)


            })
        

            // Customer_id Validation 
        this.customer_id.valueChanges.subscribe(
            (value : string) => {
                let customerId = this._customerList.find(
                    (object : any) => {
                        return object.customer_id.toLowerCase() === value.trim().toLowerCase();
                    }
                )
                console.log('Customer ID ', customerId)

                if(customerId) {
                    this.showDuplicate = true;
                    console.log('Customer Id Already Exists')
                } else {
                    this.showDuplicate = false;
                    console.log('New Customer Id')
                }
            }
        )

        this.weight.valueChanges.subscribe(
            (value: number) => {
                this.weightVal = value
                if(this.heightVal != 0 && this.heightVal != null){
                    this.bmiValue = this.weightVal / this.heightVal
                }
                
            }
        )
        this.height.valueChanges.subscribe(
            (value: number) => {
                this.heightVal = (value * value) / 10000
                if(this.weightVal && this.heightVal !=0) {
                    this.bmiValue = this.weightVal / this.heightVal
                }

            }
        )

        this.age.valueChanges.subscribe(
            (value : any) => {
                this.customerAge = moment().diff(moment(value), 'years');
            }
        )

        // Subscribe Payment Type Value Changes __________________________________________
        this.payment_type.valueChanges.subscribe(
            (value: string) => {
                if (value == '1') {

                    this.selectedPaymentType = "Registration Fee";
                    console.log("Selected Payment Type: ", this.selectedPaymentType);
                }
                if (value == '2') {

                    this.selectedPaymentType = "Deposit";
                    console.log("Selected Payment Type: ", this.selectedPaymentType);
                }
                if (value == '3') {

                    this.selectedPaymentType = "Subscription Fees";
                    console.log("Selected Payment Type: ", this.selectedPaymentType);
                }
                if (value == '4') {

                    this.selectedPaymentType = "Discount";
                    console.log("Selected Payment Type: ", this.selectedPaymentType);
                }
            }
        )

        // Subscribe Payment Amount Value Changes __________________________________________
        this.payment_amount.valueChanges.subscribe(
            () => {
                this.enteredPaymentAmount = this.payment_details.controls["payment_amount"].value;
                console.log("Entered Payment Amount: ", this.enteredPaymentAmount);
            }
        )
        console.log('packlist', this._packList)

        this.payment_details.controls['payment_type'].setValue('4')


    }

    //  ~ End - ngOnInit _______________________________________________________________________

    //>>>>>  @details :  onSubmit ###############################################################
    //  ~ Start - onSubmit _______________________________________________________________________
    onSubmit(value: string): void {

        /* @details - Check for fields validity
             ++ Check the customer_details, customer_meta validity and customer_id validation
               ** If the form state is invalid call validateAllFormFields service
               ** If the form state is valid call http  post service
             ++  Check for Pack Validity and Payments Validity
            
        */
        if (this.customer_details.valid && this.customer_meta.valid && !this.showDuplicate) {

            console.log('***********Customer Details and Customer meta are valid***********')

            if (this.validatePrepaidPacks()) {

                console.log('***************PrepaidPack Array is Valid**************')

                if (this.validatePayments()) {

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
                    console.log('postobj before assign', this.postRequestObject);

                    //create JSON
                    this.formValuesJSON = JSON.parse(JSON.stringify(value));
                    console.log("--------------- JSON Value ---------------");
                    console.log(this.formValuesJSON);




                    // Assign Values from values to post request object

                    this.postRequestObject.records[0].subscription_details[0].prepaid_pack_details          = this.prepaidPackArray
                    this.postRequestObject.records[0].subscription_details[0].postpaid_pack_details         = this.postpaidPackArray

                    this.postRequestObject.records[0].subscription_summary.total_prepaid_packs              = this.prepaidPackArray.length
                    this.postRequestObject.records[0].subscription_summary.total_prepaid_base_price         = this.total_prepaid_base_price
                    this.postRequestObject.records[0].subscription_summary.total_postpaid_base_price        = this.total_postpaid_base_price
                    this.postRequestObject.records[0].subscription_summary.total_postpaid_cgst_amount       = this.total_postpaid_cgst_amount
                    this.postRequestObject.records[0].subscription_summary.total_prepaid_cgst_amount        = this.total_prepaid_cgst_amount
                    this.postRequestObject.records[0].subscription_summary.total_prepaid_sgst_amount        = this.total_prepaid_sgst_amount
                    this.postRequestObject.records[0].subscription_summary.total_postpaid_sgst_amount       = this.total_postpaid_sgst_amount
                    this.postRequestObject.records[0].subscription_summary.total_postpaid_packs             = this.postpaidPackArray.length
                    this.postRequestObject.records[0].subscription_summary.total_postpaid_tax               = this.total_postpaid_tax_amount
                    this.postRequestObject.records[0].subscription_summary.total_prepaid_tax                = this.total_prepaid_tax_amount
                    this.postRequestObject.records[0].subscription_summary.total_postpaid_amount            = this.total_postpaid_amount_value
                    this.postRequestObject.records[0].subscription_summary.total_prepaid_amount             = this.total_prepaid_amount_value

                    /* Filtering discount from payment array. If payment array contains discount then assign the discount amount value 
                    to postrequestobject discount and remove discount object from payment array (*Payment Array should only contain 
                    subscription fees, registration fees or deposit). If no discount object is present then set it to Zero.
                    */
                    let discount: any = this.paymentArray.filter(
                        (object) => {
                            return object.payment_type_id == '4'
                        }
                    )
                    console.log('***************Discount************', discount);
                    if (discount.length > 0) {
                        this.postRequestObject.records[0].customer_details.discount  =  discount[0].payment_amount;
                        console.log('************discount amount*********', discount[0].payment_amount);
                        this.paymentArray = this.paymentArray.filter(
                            (object) => {
                                return object.payment_type_id != '4'
                            }
                        )
                    } else {
                        this.postRequestObject.records[0].customer_details.discount = 0;  
                    }

                    // Assign Payment Details
                    this.postRequestObject.records[0].payment_details                               = this.paymentArray

                    // Assign Customer details values
                    this.postRequestObject.records[0].customer_details.first_name                   = this.formValuesJSON.first_name
                    this.postRequestObject.records[0].customer_details.last_name                    = this.formValuesJSON.last_name
                    this.postRequestObject.records[0].customer_details.full_name                    = this.formValuesJSON.first_name + " " + this.formValuesJSON.last_name
                    this.postRequestObject.records[0].customer_details.gender                       = this.formValuesJSON.gender;
                    this.postRequestObject.records[0].customer_details.phone                        = this.formValuesJSON.phone;
                    this.postRequestObject.records[0].customer_details.email                        = this.formValuesJSON.email
                    this.postRequestObject.records[0].customer_details.address                      = this.formValuesJSON.address
                    this.postRequestObject.records[0].customer_details.city                         = this.formValuesJSON.city
                    this.postRequestObject.records[0].customer_details.area                         = this.formValuesJSON.area
                    this.postRequestObject.records[0].customer_details.pincode                      = this.formValuesJSON.pincode;
                    this.postRequestObject.records[0].customer_details.customer_id                  = this.formValuesJSON.customer_id;
                    this.postRequestObject.records[0].customer_details.owner_id                     = this._ownerDetails.owner_id;
                    this.postRequestObject.records[0].customer_details.created_by                   = this._userDetails.user_name;
                    this.postRequestObject.records[0].customer_details.created_by_id                = this._userDetails.user_id;
                    this.postRequestObject.records[0].customer_details.comments                     = 'Created new customer'
                    this.postRequestObject.records[0].customer_details.dmlType                      = 'I'
                    this.postRequestObject.records[0].customer_details.active                       = 'Y'
                    this.postRequestObject.records[0].customer_details.recordType                   = 'N'
                    this.postRequestObject.records[0].customer_details.due_date                     = moment(this.formValuesJSON.due_date).add('330', 'minute');
                    this.postRequestObject.records[0].customer_details.image                        = this.locationUrl;
                    this.postRequestObject.records[0].customer_details.payment_mode                 = this.formValuesJSON.payment_mode;

                    // Assign customer_meta value
                    this.postRequestObject.records[0].customer_meta.age                             = this.customerAge;
                    this.postRequestObject.records[0].customer_meta.dob                             = this.customer_meta.controls['age'].value
                    this.postRequestObject.records[0].customer_meta.height                          = this.customer_meta.controls['height'].value
                    this.postRequestObject.records[0].customer_meta.weight                          = this.customer_meta.controls['weight'].value
                    this.postRequestObject.records[0].customer_meta.blood_group                     = this.customer_meta.controls['blood_group'].value
                    this.postRequestObject.records[0].customer_meta.registration_date               = this.customer_meta.controls['registration_date'].value
                    this.postRequestObject.records[0].customer_meta.fullName                        = this.customer_meta.controls['fullName'].value
                    this.postRequestObject.records[0].customer_meta.ePhone                          = this.customer_meta.controls['ePhone'].value
                    this.postRequestObject.records[0].customer_meta.eAddress                        = this.customer_meta.controls['eAddress'].value
                    this.postRequestObject.records[0].customer_meta.relationship                    = this.customer_meta.controls['relationship'].value

        
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
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        reverseButtons: true

                    }).then((result) => {

                        console.log(result);

                        //  Check result of buttom click - start ----------------------------------------------------------------------
                        if (result.value) {

                            console.log(result.value);

                            swal({
                                title: 'Processing...',
                                titleText: 'Your record is being saved...',
                                text: 'Please do not refresh this page or click back button',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                allowEnterKey: false,
                                onOpen: () => {
                                    swal.showLoading()
                                }
                            });



                            // make post reqest call to send area form data to DB
                            //  ~ Start  --  post reqest call-------------------------------------------------------------------------

                            this.callHttpPost.makeRequest_manageCustomer(this.postRequestObject).subscribe(
                                (response) => {
                                    // Log Response - Remove Later
                                    console.warn(
                                        "%c ___________________________ Manage Customer Post Response ___________________________",
                                        "background: #4dd0e1;color: black; font-weight: bold;"
                                    );


                                    console.log(response);


                                    // Check reponse for success or failure - start 
                                    if (response.p_out_mssg_flg = 'S') {

                                        // swal ~ start -----

                                        swal({
                                            title: 'Do you want to download invoice?',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            allowEnterKey: false,
                                            showConfirmButton: true,
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            cancelButtonText: 'No',
                                            confirmButtonText: 'Yes',
                                            reverseButtons: true
                                            
                                        }).then((result) => {

                                            if (result.value) {
                                                this.invoice_id = response[0].p_out_inv_id;
                                                this.downloadPdf();
                                        
                                            swal({
                                                type: 'success',
                                                title: 'Your work has been saved',
                                                text: 'Click OK to proceed...',
                                                allowOutsideClick: false,
                                                allowEscapeKey: false,
                                                allowEnterKey: false,
                                                showConfirmButton: true

                                            }).then((result) => {

                                                if (result.value) {
                                                this.router.navigateByUrl('/managecustomer');

                                            }

                                        }) // swal ~ end -----
                                    }
                                    else{

                                        swal({
                                            type: 'success',
                                            title: 'Your work has been saved',
                                            text: 'Click OK to proceed...',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            allowEnterKey: false,
                                            showConfirmButton: true

                                        }).then((result) => {

                                            if (result.value) {
                                            this.router.navigateByUrl('/managecustomer');

                                        }

                                    }) // swal ~ end -----

                                    }
        
                                })

                                    }
                                    else if (response.p_out_mssg_flg = 'E') {

                                        // swal ~ start -----
                                        swal({
                                            type: 'error',
                                            title: 'Failed to process your work',
                                            text: 'Click OK to proceed...',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            allowEnterKey: false,
                                            showConfirmButton: true

                                        }).then((result) => {

                                            if (result.value) {

                                                swal.close();

                                            }

                                        }) // swal ~ end -----

                                    } // Check reponse for success or failure - start

                                });

                            //  ~ End  --  post reqest call-------------------------------------------------------------------------

                        } //  Check result of buttom click - End ----------------------------------------------------------------------

                    });//  call sweet alert - End ___________________________________________________________________________________________________

                } else {
                    if (this.paymentArray.length > 0) {
                        this.toastService.warning('Please Pay Subscription Fees');
                        console.log('*******Payment Array Validation failed**************')
                    } else {
                        console.log('*******Payment Array Validation failed**************')

                    }
                }

            }
            else {

                // this.toastService.warning("Please Select at least one Prepaid Pack")
            }


        } else {
            this.validateFields.validateAllFormFields(this.customer_details)
            this.validateFields.validateAllFormFields(this.customer_meta)

        }

    }
    //  ~ End - onSubmit _______________________________________________________________________

    // _______________________________Local Functions Definitions _____________________________________________________________


    

    validatePrepaidPacks(): boolean {

        // checking if customer subscription has atleast one pack in it.
        return this.prepaidPackArray.length > 0
    }

    validatePayments(): boolean {
        console.log('Payment Array ', this.paymentArray)

        // Checking if payment array contains subscription fees in it.
        if (this.paymentArray.length > 0) {
            
            let opnBal: any = this.paymentArray.filter(
                (obj: any) => {
                    return obj.payment_type_id == '3'
                }
            )
            if(opnBal.length > 0) {
                return true
            }else {
                return false
            }

        } else {
            // this.toastService.warning('Please Add Payment Details Opening Balance must be present')
            return false
        }

    }

    // Code for Select Pack Autocomplete
    //*************************************************Start**************************************************//

    // Returns a list of Prepaid packs to display in the autocomplete
    getPrepaidPackList() {
        console.log("*********PackList**********", this._packList)

        this.prepaid = true
        console.log("**********prepaidPacklist***********", this._prepaidPackList)
        console.log('getPackList is running');

        this.filteredPack = this.select_prepaid_pack.valueChanges.pipe(
            startWith(''),
            map(
                packNameValue =>
                    packNameValue ? this.filterPacks(packNameValue, this.prepaid) : this._prepaidPackList.slice()
            )
        );

        console.warn('----------------- filteredPacks ----------------- ');
        console.warn(this.filteredPack);

    }
    // Returns a list of Postpaid packs to display in the autocomplete
    // getPostpaidPackList() {

    //     this.filteredPack = this.select_postpaid_pack.valueChanges.pipe(
    //         startWith(''),
    //         map(
    //             packNameValue =>
    //                 packNameValue ? this.filterPacks(packNameValue, false) : this._postpaidPackList.slice()
    //         )
    //     );

    //     console.warn('----------------- filteredPacks ----------------- ');
    //     console.warn(this.filteredPack);

    // }

    filterPacks(packNameValue: string, prepaid: boolean) {
        console.log(
            '%c filterPacks ***** -------------------------------------------------------------------------- ',
            'background: #4caf50;font-weight: bold;color: white; '
        );
        console.log(packNameValue.toLowerCase());
        if (prepaid) {
            return this._prepaidPackList.filter(
                packList =>
                    packList.pack_name.toLowerCase().indexOf(packNameValue.toLowerCase()) === 0

            );
        } else {
            return this._postpaidPackList.filter(
                packList =>
                    packList.pack_name.toLowerCase().indexOf(packNameValue.toLowerCase()) === 0

            );
        }



    }
    //*********************************************End Of Autocomplete*********************************************************** */

    // Code for Adding Initial Payment 
    //****************************************************Start************************************************** */
    addPaymentDetails() {

        // Display toast notifications when user has not selected anything and clicked add button
        if (this.payment_details.controls['payment_type'].value == null || this.payment_details.controls['payment_amount'].value == null) {
            // this.toastService.warning('Please Select Payment Type')
            return
        }
        // if (this.payment_details.controls['payment_amount'].value == null && this.payment_details.controls['payment_type'].value) {
        //     // this.toastService.warning('Please Enter Payment Amount')
        //     return
        // }
        // if (this.payment_details.controls['payment_type'].value == null && this.payment_details.controls['payment_amount'].value == null) {
        //     // this.toastService.warning('Please Select Payment Type and Enter Payment Amount')
        //     return
        // }

        let payment_obj = {
            "payment_type_id"           : '',
            "payment_type"              : this.selectedPaymentType,
            "payment_amount"            : this.enteredPaymentAmount,
            "payment_date"              : moment().format('LL'),
            "remarks"                   : "Added " + this.selectedPaymentType + " On " + moment().format('LL')
        }
        console.log("***************Payment Object**************");
        console.log(payment_obj);

        // Check if Discount already exist if not then add it
        if (payment_obj.payment_type === 'Discount') {

            this.discountExists = this.paymentArray.find(
                (obj: any) => obj.payment_type === 'Discount'
            )
            console.log('-------payment type--------------', this.discountExists)
            if (!this.discountExists && payment_obj.payment_type && payment_obj.payment_amount) {
                payment_obj.payment_type_id = '4'
                this.paymentArray.push(payment_obj)
                this.payment_details.controls['payment_type'].setValue(null);
                this.payment_details.controls['payment_amount'].setValue(null);
                console.log("Payment Array", this.paymentArray)

            } else {
                // this.toastService.warning('Registration Fee is already added')
            }
        }
        // Check if Registration Fee already exist if not then add it
        if (payment_obj.payment_type === 'Registration Fee') {

            this.registrationExists = this.paymentArray.find(
                (obj: any) => obj.payment_type === 'Registration Fee'
            )
            console.log('-------payment type--------------', this.registrationExists)
            if (!this.registrationExists && payment_obj.payment_type && payment_obj.payment_amount) {
                payment_obj.payment_type_id = '1'
                this.paymentArray.push(payment_obj)
                this.payment_details.controls['payment_type'].setValue(null);
                this.payment_details.controls['payment_amount'].setValue(null);
                console.log("Payment Array", this.paymentArray)

            } else {
                // this.toastService.warning('Registration Fee is already added')
            }
        }
        // Check if Deposit already exist if not then add it
        if (payment_obj.payment_type === 'Deposit') {

            this.depositExists = this.paymentArray.find(
                (obj:any) => obj.payment_type === 'Deposit'
            )
            console.log('-------payment type--------------', this.depositExists)
            if (!this.depositExists && payment_obj.payment_type && payment_obj.payment_amount) {
                payment_obj.payment_type_id = '2'
                this.paymentArray.push(payment_obj)
                this.payment_details.controls['payment_type'].setValue(null);
                this.payment_details.controls['payment_amount'].setValue(null);
                console.log("Payment Array", this.paymentArray)

            } else {
                // this.toastService.warning('Deposit is already added')
            }
        }
        // Check if Opening Balance already exist if not then add it
        if (payment_obj.payment_type === 'Subscription Fees') {

            this.openingBalanceExists = this.paymentArray.find(
                (obj: any) => obj.payment_type === 'Subscription Fees'
            )
            console.log('-------payment type--------------', this.openingBalanceExists);
            console.log('-------Total Amount--------------', this.pack_obj[0].total_amount);

            if (!this.openingBalanceExists && payment_obj.payment_type) {
                payment_obj.payment_type_id = '3'
                this.paymentArray.push(payment_obj)

                this.payment_details.controls['payment_type'].setValue(null)
                this.payment_details.controls['payment_amount'].setValue(null)
                this.displayNextPaymentInfo = this.displayNextPayment();

                this.payment_details.controls['payment_type'].markAsTouched({ onlySelf: false })
                this.payment_details.controls['payment_amount'].markAsTouched({ onlySelf: false })

                console.log("Payment Array", this.paymentArray)

            } else {
                this.toastService.warning('Subscription Fee is less than Subscription Charges');
            }
        } console.log('--------------Payments Array-----------------', this.paymentArray)
    }


    //****************************************************End Of Initial Payments************************************************** */

    // Code for deleting the payment type selected from the Initial Payments Area
    //****************************************************Start************************************************** */
    deletePaymentType(paymentType_Id: string, payment_Type: string) {
        console.log('Delete Button clicked with id: ', paymentType_Id)
        console.log('Delete Button clicked with type: ', payment_Type)

        // if (paymentType_Id === '3') {
        //     this.payment_details.controls['payment_type'].setValue('3')
        //     // this.toastService.warning('Opening Balance must be present')
    
        // } else {
            this.paymentArray = this.paymentArray.filter(
                (object: any) => {
                   return  object.payment_type_id != paymentType_Id
                }
            )
        // }
    }

    //****************************************************End of Deleting Payment type************************************************** */ 

    // Code for adding the Prepaid Pack details selected by the user  
    //****************************************************Start************************************************** */

    addPrepaidSubscriptionDetails() {

        let expiryDate: any = '';

        let selected_prepaid_pack_obj = {
            'rownum'                    : null,
            'pack_name'                 : null,
            'pack_activation_date'      : null,
            'pack_expiry_date'          : null,
            'pack_duration'             : null,
            'pack_duration_type'        : '',
            'pack_type'                 : null,
            'pack_id'                   : null,
            'base_price'                : null,
            'cgst_amount'               : null,
            'sgst_amount'               : null,
            'total_tax'                 : null,
            'total_amount'              : null,
            'extention_period'          : null

        }

        this.selectedPack               = this.subscription_details.controls['select_prepaid_pack'].value;
        this.packActivationDate         = this.subscription_details.controls['prepaidPack_activation_date'].value
        console.log('*******************pack activation date***********************', this.packActivationDate)

        switch( this.selectedPack == null || this.packActivationDate == null) {
            case true:
                break;
        }

        console.log('Pack Activation date', this.packActivationDate)

        this.pack_obj = this._prepaidPackList.filter(
            obj => obj.pack_name === this.selectedPack
        )
        
        console.log("Selected Pack Object", this.pack_obj[0])
        
        // Calculating Expiry date of the pack
        if (this.pack_obj[0].pack_duration_type == 'dd') {
            this.duration = 'days'
            // Adding 330 minutes to convert GMT into Indian Standard Time.
             expiryDate = moment(this.packActivationDate).add(this.pack_obj[0].pack_duration, this.duration).add('330', 'minute').add(this.subscription_details.controls['extention_period'].value, 'days')
            console.log('Expiry Date: ', expiryDate)
        } else if (this.pack_obj[0].pack_duration_type == 'mm') {
            this.duration = 'months'
             expiryDate = moment(this.packActivationDate).add(this.pack_obj[0].pack_duration, this.duration).add('330', 'minute').add(this.subscription_details.controls['extention_period'].value, 'days')
            console.log('Expiry Date: ', expiryDate)
        } else if (this.pack_obj[0].pack_duration_type == 'yy') {
            this.duration = 'year'
             expiryDate = moment(this.packActivationDate).add(this.pack_obj[0].pack_duration, this.duration).add('330', 'minute').add(this.subscription_details.controls['extention_period'].value, 'days')
            console.log('Expiry Date: ', expiryDate)
        }

        // Assign Values to objects in prepaidpack array
        selected_prepaid_pack_obj.pack_name                 = this.pack_obj[0].pack_name
        selected_prepaid_pack_obj.pack_activation_date      = moment(this.packActivationDate).add('330', 'minute')
        selected_prepaid_pack_obj.pack_expiry_date          = expiryDate
        selected_prepaid_pack_obj.pack_id                   = this.pack_obj[0].pack_id
        selected_prepaid_pack_obj.pack_duration             = this.pack_obj[0].pack_duration
        selected_prepaid_pack_obj.pack_duration_type        = this.duration
        selected_prepaid_pack_obj.base_price                = this.pack_obj[0].base_price
        selected_prepaid_pack_obj.cgst_amount               = this.pack_obj[0].cgst_amount
        selected_prepaid_pack_obj.sgst_amount               = this.pack_obj[0].sgst_amount
        selected_prepaid_pack_obj.total_tax                 = this.pack_obj[0].total_tax
        selected_prepaid_pack_obj.total_amount              = this.pack_obj[0].total_amount
        selected_prepaid_pack_obj.pack_type                 = this.pack_obj[0].pack_type
        selected_prepaid_pack_obj.extention_period          = this.subscription_details.controls['extention_period'].value;

        var packExists  = this.prepaidPackArray.find(
            (object:any) => object.pack_name == this.selectedPack
        )

        console.log('--------packExists value----------', packExists)
        // Add Pack if it does not exist 
        if (typeof packExists == 'undefined' && this.packActivationDate) {
            selected_prepaid_pack_obj.rownum = this.prepaidPackArray.length + 1;
            this.prepaidPackArray.push(selected_prepaid_pack_obj)
            console.log('***************prepaid pack array***********************8',this.prepaidPackArray)
            // this.toastService.success('Pack was successfully added')

            this.total_prepaid_base_price           += this.prepaidPackArray[this.prepaidPackArray.length - 1].base_price;
            this.total_prepaid_cgst_amount          += this.prepaidPackArray[this.prepaidPackArray.length - 1].cgst_amount;
            this.total_prepaid_sgst_amount          += this.prepaidPackArray[this.prepaidPackArray.length - 1].sgst_amount;
            this.total_prepaid_tax_amount           += this.prepaidPackArray[this.prepaidPackArray.length - 1].total_tax;
            this.total_prepaid_amount_value         += this.prepaidPackArray[this.prepaidPackArray.length - 1].total_amount;

            this.subscription_details.controls['select_prepaid_pack'].setValue(null)
            this.subscription_details.controls['prepaidPack_activation_date'].setValue(null)
            this.subscription_details.controls['extention_period'].setValue(0)
        } else {
            // this.toastService.warning("Pack is already added");
            this.subscription_details.controls['select_prepaid_pack'].setValue(null)
            this.subscription_details.controls['prepaidPack_activation_date'].setValue(null)
            this.subscription_details.controls['extention_period'].setValue(0)
        }
    }
// Code for adding the Prepaid Pack details selected by the user  
//****************************************************End************************************************** */

toggleExtPeriod() {
    this.displayExtPeriod = !this.displayExtPeriod;
}

// Displaying next payment box if customer has not paid the full amount
displayNextPayment() : boolean {
    console.log('****************display next info method called***********')
    let discount: any = this.paymentArray.filter(
        (object) => {
            return object.payment_type_id == '4'
        }
    )
    let rebateAmount: any = discount[0].payment_amount 
    let paidAmountArray : any = this.paymentArray.filter(
        (object) => {
            return object.payment_type_id == '3'
        }
    )
    let paidAmount = paidAmountArray[0].payment_amount;

    if ((this.total_prepaid_amount_value - rebateAmount - paidAmount) >= 0) {
        return true;
    } else {
        return false;
    }
}

// // Code for adding the Postpaid Pack details selected by the user  
//     //****************************************************Start************************************************** */
//     addPostpaidSubscriptionDetails() {

//         // Declare variables
//         let expiryDate: any = '';
//         let selected_postpaid_pack_obj = {
//             'pack_name'                 : null,
//             'pack_activation_date'      : this.date,
//             'pack_expiry_date'          : null,
//             'pack_duration'             : null,
//             'pack_duration_type'        : '',
//             'pack_type'                 : null,
//             'pack_id'                   : null,
//             'base_price'                : null,
//             'cgst_amount'               : null,
//             'sgst_amount'               : null,
//             'total_tax'                 : null,
//             'total_amount'              : null

//         }
        
//         this.selectedPack           = this.subscription_details.controls['select_postpaid_pack'].value;
//         this.packActivationDate     = this.subscription_details.controls['postpaidPack_activation_date'].value

//         console.log('Pack Activation date', this.packActivationDate)

//         switch( this.selectedPack == null || this.packActivationDate == null) {
//             case true:
//                 break;
//         }

//         this.pack_obj = this._postpaidPackList.filter(
//             obj => obj.pack_name === this.selectedPack
//         )
        
//         console.log("Selected Pack Object", this.pack_obj[0])

//         // calculating expiry dates for the pack
//         if (this.pack_obj[0].pack_duration_type == 'dd') {
//             this.duration = 'days'
//              expiryDate = moment(this.packActivationDate).add(this.pack_obj[0].pack_duration, this.duration).format('LL')
//             console.log('Expiry Date: ', expiryDate)
//         } else if (this.pack_obj[0].pack_duration_type == 'mm') {
//             this.duration = 'months'
//              expiryDate = moment(this.packActivationDate).add(this.pack_obj[0].pack_duration, this.duration).format('LL')
//             console.log('Expiry Date: ', expiryDate)
//         } else if (this.pack_obj[0].pack_duration_type == 'yy') {
//             this.duration = 'year'
//              expiryDate = moment(this.packActivationDate).add(this.pack_obj[0].pack_duration, this.duration).format('LL')
//             console.log('Expiry Date: ', expiryDate)
//         }


//         // Assign Values to objects in prepaidpack array
//         selected_postpaid_pack_obj.pack_name                 = this.pack_obj[0].pack_name
//         selected_postpaid_pack_obj.pack_activation_date      = this.packActivationDate
//         selected_postpaid_pack_obj.pack_expiry_date          = expiryDate
//         selected_postpaid_pack_obj.pack_id                   = this.pack_obj[0].pack_id
//         selected_postpaid_pack_obj.pack_duration             = this.pack_obj[0].pack_duration
//         selected_postpaid_pack_obj.pack_duration_type        = this.duration
//         selected_postpaid_pack_obj.base_price                = this.pack_obj[0].base_price
//         selected_postpaid_pack_obj.cgst_amount               = this.pack_obj[0].cgst_amount
//         selected_postpaid_pack_obj.sgst_amount               = this.pack_obj[0].sgst_amount
//         selected_postpaid_pack_obj.total_tax                 = this.pack_obj[0].total_tax
//         selected_postpaid_pack_obj.total_amount              = this.pack_obj[0].total_amount
//         selected_postpaid_pack_obj.pack_type                 = this.pack_obj[0].pack_type

//         var packExists = this.postpaidPackArray.find(
//             (object:any) => object.pack_name == this.selectedPack
//         )
        
//         // Add Pack if it does not exist
//         if (!packExists && this.packActivationDate) {
//             this.postpaidPackArray.push(selected_postpaid_pack_obj)
//             console.log(this.prepaidPackArray)
//             // this.toastService.success('Pack was successfully added')

//             this.total_postpaid_base_price          += this.postpaidPackArray[this.postpaidPackArray.length - 1].base_price;
//             this.total_postpaid_cgst_amount         += this.postpaidPackArray[this.postpaidPackArray.length - 1].cgst_amount;
//             this.total_postpaid_sgst_amount         += this.postpaidPackArray[this.postpaidPackArray.length - 1].sgst_amount;
//             this.total_postpaid_tax_amount          += this.postpaidPackArray[this.postpaidPackArray.length - 1].total_tax;
//             this.total_postpaid_amount_value        += this.postpaidPackArray[this.postpaidPackArray.length - 1].total_amount;

//             this.subscription_details.controls['select_postpaid_pack'].setValue(null)
//             this.subscription_details.controls['postpaidPack_activation_date'].setValue(null)
//         } else {
//             // this.toastService.warning("Pack is already added");
//             this.subscription_details.controls['select_postpaid_pack'].setValue(null)
//             this.subscription_details.controls['postpaidPack_activation_date'].setValue(null)
//         }
//     }
//     // Code for adding the Postpaid Pack details selected by the user  
//     //****************************************************End************************************************** */


    // Code for deleting Pack details from the Membership details area
    //****************************************************Start************************************************** */ 

    deletePrepaidPack(pack_id: number) {

        
        var array = this.prepaidPackArray.filter(
            (obj: any) => obj.pack_id == pack_id
        )

        this.prepaidPackArray = this.prepaidPackArray.filter(
            (object : any) => 
                object.pack_id != pack_id
        )
        // this.toastService.error('Selected Pack was deleted')

        this.total_prepaid_amount_value         -= array[0].total_amount
        this.total_prepaid_cgst_amount          -= array[0].cgst_amount
        this.total_prepaid_sgst_amount          -= array[0].sgst_amount
        this.total_prepaid_tax_amount           -= array[0].total_tax
        this.total_prepaid_base_price           -= array[0].base_price
    }

    //****************************************************End************************************************** */ 

    // Code for deleting Pack details from the Membership details area
    //****************************************************Start************************************************** */ 

    // deletePostpaidPack(pack_id: number) {

    //     var array = this.postpaidPackArray.filter(
    //         (obj : any) => obj.pack_id == pack_id
    //     )

    //     this.postpaidPackArray = this.postpaidPackArray.filter(
    //         (object : any) =>
    //             object.pack_id != pack_id
    //     )
    //     // this.toastService.error('Selected Pack was deleted')

    //     this.total_postpaid_amount_value        -= array[0].total_amount
    //     this.total_postpaid_cgst_amount         -= array[0].cgst_amount
    //     this.total_postpaid_sgst_amount         -= array[0].sgst_amount
    //     this.total_postpaid_tax_amount          -= array[0].total_tax
    //     this.total_postpaid_base_price          -= array[0].base_price
    // }


    // Invoice download

    downloadPdf() { 
        var doc = new jsPDF('p','pt','a4');
        doc.setLineWidth(1.5)
        doc.rect(5,5,584,820)
        doc.rect(5,5,584,10, 'F')
        doc.setFontSize(18)
        var text = `${this._ownerDetails.owner_company_name}`
        doc.text(text,20,55);
       
        doc.setFontSize(20);
        doc.setFontType('bold')
        doc.text('INVOICE',485,46)
        doc.setFontSize(12)
        doc.text('Address :',20,95)
        doc.setFontType('normal')
        var text1 = `${this._ownerDetails.owner_company_address}`
        var line = doc.splitTextToSize(text1,190)
        doc.text(line,20,110);
        doc.setFontType('bold')
        doc.text('Phone :',20,75);
        doc.setFontType('normal')
        doc.text(`${this._ownerDetails.owner_phone}`,67,75)
        doc.setFontType('bold')
        doc.text('Invoice#',380,85)
        doc.text('Invoice Date:',380,105)
        // if(this.owner_meta_Json.enable_gst === "Y")
        // {
        // doc.text('GSTIN#',380,125)
        // doc.setFontType('normal')
        // doc.text(`${this.owner_meta_Json.gstin_number}`,475,125)
        // }
        doc.setFontType('normal')
        doc.text(`${this.invoice_id}`,475,85)
        doc.text(`${moment().format("Do-MMM YYYY")}`,475,105)
        
        doc.rect(20,165,230,20, 'F')
        // doc.rect(310,165,263,20, 'F')
        doc.setTextColor(255,255,255)
        doc.setFontType('normal')
        doc.text('Bill To',25,179)
        // doc.text('Details',315,179)

        doc.setTextColor(0,0,0)
        doc.setFontType('bold')
        doc.text(`Customer ID :`,25,200)
        doc.setFontType('normal')
        doc.text(`${ this.postRequestObject.records[0].customer_details.customer_id}`,106, 200)
        
        doc.setFontType('bold')
        doc.setTextColor(0,0,0)
        doc.text(`${this.postRequestObject.records[0].customer_details.full_name}`, 25, 216)
        doc.text('Phone :',25,232);
        doc.setFontType('normal')
        doc.text(`${this.postRequestObject.records[0].customer_details.phone}`,72,232)
        // console.log(this.customer_meta.customer_meta.GSTIN)
        // if(this.customer_meta.customer_meta.GSTIN != "" && this.customer_meta.customer_meta.GSTIN != null)
        // {
        //   doc.setFontType('bold')
        //   doc.text('GSTIN :',25,232) 
        //   doc.setFontType('normal')
        //   doc.text(`${this.customer_meta.customer_meta.GSTIN}`,72,232)
        // }
        doc.setFontType('bold')
        doc.text(`Address :`,25, 264)
        doc.setFontType('normal')
        var text2 = `${this.postRequestObject.records[0].customer_details.address }`
        var lines = doc.splitTextToSize(text2, 190)
        doc.text(lines,25, 279)
        doc.setFontType('bold')
        
    
       
        // doc.text(`Bill Month:`,315,216)
 
        
        
        // this.month = moment(this.billMonth).format('MMMM YYYY');
        // var bill_month = moment(this.month).subtract('months',1).format('MMM YYYY')
        // doc.text(`${bill_month}`,410,216)
    
        doc.setLineWidth(0.5)
        doc.line(20, 311, 571, 311)
        doc.setFontSize(18);
        doc.setFontType('bold')
        doc.text('INVOICE TOTAL',25,336)
        doc.text(`Rs. ${this.total_prepaid_amount_value.toFixed(2)}`,520,336,null,null,'right')
        doc.line(20,348,571,348)
    
    
        var data = this.postRequestObject.records[0].subscription_details[0].prepaid_pack_details;
        var columns = [
            { title:"#", dataKey: "rownum"},
            { title:"Pack Name",dataKey:"pack_name"},
            { title:"Activation Date",dataKey:"pack_activation_date"},
            { title:"Expiry Date",dataKey:"pack_expiry_date"},
            { title:"Amount",dataKey:"total_amount"}
        ]
        var res = doc.autoTable(columns, data,{startX:250,startY: 384,theme:'grid',
        columnStyles: { rownum:{columnWidth:40,halign:'center'},pack_name:{columnWidth:130}, pack_activation_date: {columnwidth: 180}, pack_expiry_date: {columnwidth: 180}, total_amount: {columnWidth: 125,halign:'right'}},
        headerStyles:{fillColor: [0, 0, 0],halign:'center',fontSize: 12},});
        let first = doc.autoTable.previous.finalY;
        doc.rect(430,first,125,20)
        doc.rect(430,first+20,125,20)
        doc.rect(430,first+40,125,20)
        doc.rect(430,first+60,125,20)
        doc.rect(430,first+80,125,20)
        doc.rect(430,first+100,125,20)
        doc.setFontType('normal')
        doc.setFontSize(10)
        doc.text(`${this.postRequestObject.records[0].subscription_summary.total_prepaid_base_price.toFixed(2)}`,550,first+14,null,null,'right')
        doc.text(`${this.postRequestObject.records[0].subscription_summary.total_prepaid_cgst_amount.toFixed(2)}`,550,first+34,null,null,'right')
        doc.text(`${this.postRequestObject.records[0].subscription_summary.total_prepaid_sgst_amount.toFixed(2)}`,550,first+54,null,null,'right')
        // doc.text(`${this.postRequestObject.records[0].subscription_summary.total_prepaid_amount.toFixed(2)}`,550,first+74,null,null,'right')
        doc.text(`${this.postRequestObject.records[0].customer_details.discount.toFixed(2)}`,550,first+74,null,null,'right')
        doc.text(`${this.previousDue.toFixed(2)}`,550,first+94,null,null,'right')
        doc.setFontSize(11)
        doc.text('Base Price',377,first+14)
        doc.text('CGST',380,first+34)
        doc.text('SGST',380,first+54)
        // doc.text('Monthly Charge',348,first+74)
        doc.text('Discount',382,first+74)
        doc.text('Previous Due',359,first+94)
        doc.setFontSize(15);
        doc.setFontType('bold')
        doc.text('Total',385,first+140)
        doc.setFillColor(0, 0, 0)
        doc.rect(429.5,first+120,125.5,30,'F')
        doc.setTextColor(255,255,255)
        doc.text(`${(this.total_prepaid_amount_value - this.postRequestObject.records[0].customer_details.discount).toFixed(2)}`,550,first+140,null,null,'right')
       
    
        doc.rect(40,first+40,250,110)
        // if(this.owner_meta_Json.udf1 != ""&& this.owner_meta_Json.udf1 != "null" && this.owner_meta_Json.udf1 != null)
        // {
        //   if(this.owner_meta_Json.udf2 != "" && this.owner_meta_Json.udf2 != "null" && this.owner_meta_Json.udf2 != null)
        //   {
        //     doc.setFontSize(10);
        //     doc.setFontType('normal')
        //     doc.setTextColor(0,0,0)
        //     doc.rect(40,first+120,250,15)
        //     doc.text(`${this.owner_meta_Json.udf1}`,45,first+131)
        //     doc.rect(40,first+135,250,15)
        //     doc.text(`${this.owner_meta_Json.udf2}`,45,first+147)
        //   }
        // }
        doc.setFillColor(0, 0, 0)
        doc.rect(40,first+24,250,20,'F')
        doc.setFontSize(12);
        doc.setFontType('bold')
        doc.setTextColor(255,255,255)
        doc.text('Comments',45,first+38)
    
        // if(this.collectionAmountDisplay === 0)
        // {
        var image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANUAAABKCAMAAAAbruEnAAADAFBMVEVHcEz/iYn/gID/gYH/goL/gID/gID/AAD/h4f/qqr/gID/gID/gID/mZn/gID/gID/gID/g4P/goL/gID/gID/gID/gID/iIj/gID/gID/i4v/gID/gID/gID/g4P/gID/gID/gID/hob/jo7/gID/gID/gID/gYH/gID/gYH/g4P/gID/gID/gID/gID/gID/gID/gYH/gID/gID/gID/gID/gID/gID/gID/goL/gID/gID/gYH/gID/gID/gID/gID/gID/gID/gID/gID/gYH/gID/gID/gID/gYH/gID/gID/gID/kpL/gID/gID/gID/gID/hIT/gID/goL/hob/gID/gID/gID/gID/gID/hIT/gID/gID/gID/gID/gID/hIT/gID/gID/gYH/gID/gID/gID/gID/gID/gID/gID/g4P/gID/gID/gID/gID/gID/gYH/gYH/gID/gID/gID/goL/gID/gID/goL/gID/gID/gID/gYH/gID/gID/gID/gYH/gID/gID/gID/gYH/gID/gID/gYH/gID/gID/gID/gID/goL/gID/gID/gID/gID/gID/gID/gID/gYH/gID/gYH/gYH/gID/gID/gID/gID/gID/gID/gID/gID/gID/hYX/gYH/gID/gYH/gID/gID/gID/gID/gID/gYH/gID/gID/gID/gID/gYH/gID/gID/gID/gID/gID/goL/gID/gID/gID/g4P/gYH/gID/gID/gYH/gID/gID/gID/gYH/gID/gID/gYH/gID/gID/gID/gID/gID/gID/gID/gID/gYH/gID/gYH/gID/goL/gID/gID/gID/gID/gID/gID/gID/goL/hYX/gID/gID/gID/gID/gID/gID/goL/gYH/gID/gID/gID/gID/gID/gID/gID/gID/gID/gID/gYH/gYH/gID/gID/gID/gID/gID/gID/gID/gID/gID/gYH/gYH/gID/gID/gID/gIBfxqbjAAAA/3RSTlMADcxVM/4CAREDZpnuBf1EUiMtxafyBA/JagvYQN0p0N98FQmc/I11qUMnVKO3DEiIdygy+oJQXjo1ip5ZsvsY0QYiPItfTlgsRxpwCgeU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"
        doc.addImage(image, 'PNG', 110, 605, 120, 50);
        // }
        
        doc.setFontSize(15);
        doc.setFontType('normal')
        doc.setTextColor(0,0,0)
        doc.setDrawColor(0,0,0)
        doc.line(20, 790, 571, 790)
        doc.text('Thank You',258,814)
        doc.setFontSize(8);
        doc.setFontType('normal')
        // doc.setTextColor(161,169,169)
        doc.text('**This is a computer generated invoice and does not require any signature',25,837)
    
        doc.save('Invoice_'+this.postRequestObject.records[0].customer_details.full_name+'_'+this.postRequestObject.records[0].customer_details.customer_id+'_.pdf');
      }


    //****************************************************End************************************************** */ 


}
