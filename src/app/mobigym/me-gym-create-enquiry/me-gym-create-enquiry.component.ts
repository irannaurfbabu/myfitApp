import { MeCallHttpPostService } from './../../Service/me-call-http-post.service';
import { PersistenceService } from 'angular-persistence';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { StorageType } from "../../Service/Interfaces/storage-type.enum";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { MeDisplayDropdownListService } from '../../Service/me-display-dropdown-list.service';
import * as moment from 'moment';
import { MeValidateFormFieldsService } from '../../Service/me-validate-form-fields.service';

@Component({
  selector: 'app-me-gym-create-enquiry',
  templateUrl: './me-gym-create-enquiry.component.html',
  styleUrls: ['./me-gym-create-enquiry.component.scss']
})
export class MeGymCreateEnquiryComponent implements OnInit {

  enquiryForm: FormGroup;


  enquiry_num                        : AbstractControl
  representative_name                 : AbstractControl
  enquiry_source                     : AbstractControl
  enquiry_date                       : AbstractControl
  comments                           : AbstractControl
  activity                           : AbstractControl

   first_name                      : AbstractControl
    last_name                       : AbstractControl
    gender                          : AbstractControl
    phone                           : AbstractControl
    email                           : AbstractControl
    address                         : AbstractControl
    city                            : AbstractControl
    area                            : AbstractControl
    pincode                         : AbstractControl

    age                             : AbstractControl
    height                          : AbstractControl
    weight                          : AbstractControl
    blood_group                     : AbstractControl

    bmiValue                        : number
    customerAge                     : any;
    weightVal                       : number
    heightVal                       : number

  postRequestObject: any = {
    records: [{
      "enquiry_summary":null,
    }

    ]
  }
  formJsonValue: any;
  userDetails: any;
  ownerDetails: any;
  genderSelect                    : Array<any>;
  enquirySourceType               : Array<any>;
  bloodGroupType                  : Array<any>;
  _enquiryNum                     : any = [];

  constructor(private fb: FormBuilder,
    private persistenceService: PersistenceService,
    private callHttpPost      : MeCallHttpPostService,
    private displayDropDown   : MeDisplayDropdownListService,
    private validateFields    : MeValidateFormFieldsService,
    private router            : Router) {
    this.enquiryForm = fb.group({


      enquiry_num                        : [null, Validators.required],
      representative_name                : [''],
      enquiry_source                     : [null, Validators.required],
      enquiry_date                       : [null, Validators.required],
      activity                           : [''],
      comments                           : [''],

      first_name                      : [null, Validators.required],
      last_name                       : [''],
      gender                          : [null, Validators.required],
      phone                           : [null, Validators.required],
      email                           : [''],
      address                         : [''],
      city                            : [''],
      area                            : [''],
      pincode                         : [''],
      blood_group                     : [''],

      age                             : [''],
      height                          : [''],
      weight                          : [''],
    });

    this.enquiry_num                  = this.enquiryForm.controls['enquiry_num']
    this.representative_name          = this.enquiryForm.controls['representative_name']
    this.enquiry_source               = this.enquiryForm.controls['enquiry_source']
    this.enquiry_date                 = this.enquiryForm.controls['enquiry_date']
    this.activity                = this.enquiryForm.controls['activity']
    this.comments                     = this.enquiryForm.controls['comments']

    this.first_name             = this.enquiryForm.controls['first_name']
    this.last_name              = this.enquiryForm.controls['last_name']
    this.gender                 = this.enquiryForm.controls['gender']
    this.phone                  = this.enquiryForm.controls['phone']
    this.email                  = this.enquiryForm.controls['email']
    this.address                = this.enquiryForm.controls['address']
    this.city                   = this.enquiryForm.controls['city']
    this.area                   = this.enquiryForm.controls['area']
    this.pincode                = this.enquiryForm.controls['pincode']


    this.age                    = this.enquiryForm.controls['age']
    this.height                 = this.enquiryForm.controls['height']
    this.weight                 = this.enquiryForm.controls['weight']
    this.blood_group            = this.enquiryForm.controls['blood_group']

  }

  ngOnInit() {


      // assign drop down values
      this.genderSelect               = this.displayDropDown.getGenderDropDown();
      this.enquirySourceType          = this.displayDropDown.getEnquirySourceType();
      this.bloodGroupType             = this.displayDropDown.getEnquiryBloodGroup();


    // set variables
    this.userDetails = this.persistenceService.get('userDetails', StorageType.SESSION);
    this.ownerDetails = this.persistenceService.get('ownerDetails', StorageType.SESSION);
    console.log('this.userDetails',this.userDetails);

    this.callHttpPost.makeRequest_getEnquiryNum({"records": [{"owner_id": this.ownerDetails.owner_id}]}).subscribe(
      (response) => {
        this._enquiryNum = response.enquiryNum;
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


  }

  onSubmit(value: string): void {

    

    if (this.enquiryForm.valid) {
      console.log('********************Submitted Values ***************************', JSON.parse(JSON.stringify(value)));


      this.enquiryForm.value.registered_by = this.userDetails.user_name;
    this.enquiryForm.value.registered_on = moment();;
    this.enquiryForm.value.enquiry_status = 'REGISTERED';
    this.enquiryForm.value.owner_id = this.ownerDetails.owner_id;
    this.enquiryForm.value.dmlType = 'I';

    
    console.log(JSON.stringify(this.enquiryForm.value));

    console.log(' this.enquiryForm', this.enquiryForm);
    this.postRequestObject.records[0].enquiry_summary=this.enquiryForm.value;
    console.log(' this.postRequestObject', this.postRequestObject);

//      this.postRequestObject.records[0].enquiry_summary=this.enquiryForm.value;
// console.log(' this.postRequestObject', this.postRequestObject);


      // this.formJsonValue = JSON.parse(JSON.stringify(value));

      // this.postRequestObject.records[0].full_name = this.formJsonValue.contactFormName;
      // this.postRequestObject.records[0].email = this.formJsonValue.contactFormEmail;
      // this.postRequestObject.records[0].subject = this.formJsonValue.contactFormSubject;
      // this.postRequestObject.records[0].phone = this.formJsonValue.contactFormPhone;
      // this.postRequestObject.records[0].enquiry_date = this.formJsonValue.enquiry_date;
      // this.postRequestObject.records[0].message = this.formJsonValue.contactFormMessage;
      // this.postRequestObject.records[0].registered_by = this.userDetails.user_name;
      // this.postRequestObject.records[0].owner_id = this.ownerDetails.owner_id;

      console.log(
        "%c Pack Object After ***** -------------------------------------------------------------------------- ",
        "background: #8bc34a;font-weight: bold;color: white; "
      );
      console.log(JSON.stringify(this.postRequestObject));
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
          this.callHttpPost
            .makeRequest_manageEnquiry(this.postRequestObject)
            .subscribe(response => {
              // Log Response - Remove Later
              console.warn(
                "%c ___________________________ Manage Pack Post Response ___________________________",
                "background: #4dd0e1;color: black; font-weight: bold;"
              );

              console.log(response);

              // swal.close();

              // Check reponse for success or failure - start 
              if (response.p_out_mssg_flg = 'S') {

                // swal ~ start -----
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
                    this.router.navigateByUrl('/manageenquiry');

                  }

                }) // swal ~ end -----

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

      });  //  call sweet alert - End ___________________________________________________________________________________________________ 




    }else{
      this.validateFields.validateAllFormFields(this.enquiryForm);

    }
  }

}
