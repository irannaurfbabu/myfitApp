import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PersistenceService } from 'angular-persistence';
import { StorageType } from "../../Service/Interfaces/storage-type.enum";
import { MeCallHttpPostService } from './../../Service/me-call-http-post.service';
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { MeDisplayDropdownListService } from '../../Service/me-display-dropdown-list.service';
import { CommentStmt } from '@angular/compiler';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MeValidateFormFieldsService } from '../../Service/me-validate-form-fields.service';


@Component({
  selector: 'app-me-gym-edit-enquiry',
  templateUrl: './me-gym-edit-enquiry.component.html',
  styleUrls: ['./me-gym-edit-enquiry.component.scss']
})
export class MeGymEditEnquiryComponent implements OnInit {

  editContactForm: FormGroup;
  getAPIResponseObject: any = {
    "records": [{
      "owner_id": null,
      "enquiry_id": null
    }]
  }


  postRequestObject: any = {
    records: [{
      "enquiry_summary":null,
      "enquiry_followup":[],
    }

    ]
  }

  _ownerDetails: any;
  _userDetails: any;
  enquiry_id_param: any;
  _enquiry: any = [];
  isOpen: boolean;
  isClosed: boolean;
  enquieryFollowArray: Array<any> = [];
  addEnquiery:boolean=true;

  Enquiryfollowupdate:boolean=false;

  // postRequestObject: any = {
  //   records: [{
  //     "full_name": null,
  //     "email": null,
  //     "subject": null,
  //     "phone": null,
  //     "enquiry_date": null,
  //     "enquiry_id": null,
  //     "message": null,
  //     "enquiry_status": null,
  //     "registered_by": null,
  //     "registered_on": null,
  //     "owner_id": null,
  //     "dmlType": 'U',

  //   }

  //   ]
  // }



  EditenquiryForm: FormGroup;
  Enquiryfollowup: FormGroup;

  enquiry_num                        : AbstractControl
  representative_name                 : AbstractControl
  enquiry_source                     : AbstractControl
  enquiry_date                       : AbstractControl
  comments                           : AbstractControl
  activity                      : AbstractControl

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


    followup_enquiry_date                   :AbstractControl
    enquiry_status                  :AbstractControl
    followup_comments               :AbstractControl  
    followup_date                   :AbstractControl 

    bmiValue                        : number
    customerAge                     : any;
    weightVal                       : number
    heightVal                       : number




  formJsonValue: any;

  genderSelect                    : Array<any>;
  enquirySourceType               : Array<any>;
  bloodGroupType                  : Array<any>;
  enquiryStatus                   : Array<any>;




  constructor(private fb: FormBuilder,
    private persistenceService: PersistenceService,
    private callHttpPost: MeCallHttpPostService,
    private route: ActivatedRoute,
    private displayDropDown   : MeDisplayDropdownListService,
    private validateFields    : MeValidateFormFieldsService,

    private router: Router) {
    this.EditenquiryForm = fb.group({
      enquiry_num                        : [null, Validators.required],
      representative_name                : [null, Validators.required],
      enquiry_source                     : [null, Validators.required],
      enquiry_date                       : [null, Validators.required],
      activity                           : [null, Validators.required],
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

      age                             : [null],
      height                          : [''],
      weight                          : [''],
      blood_group                     : [null],
    });


    this.Enquiryfollowup= fb.group({

      followup_enquiry_date                   : [null, Validators.required],
      enquiry_status                   : [null, Validators.required],
      followup_comments                : [''],
      followup_date                             : [''],
    });

    this.enquiry_num                  = this.EditenquiryForm.controls['enquiry_num']
    this.representative_name          = this.EditenquiryForm.controls['representative_name']
    this.enquiry_source               = this.EditenquiryForm.controls['enquiry_source']
    this.enquiry_date                 = this.EditenquiryForm.controls['enquiry_date']
    this.activity                = this.EditenquiryForm.controls['activity']
    this.comments                     = this.EditenquiryForm.controls['comments']

    this.first_name             = this.EditenquiryForm.controls['first_name']
    this.last_name              = this.EditenquiryForm.controls['last_name']
    this.gender                 = this.EditenquiryForm.controls['gender']
    this.phone                  = this.EditenquiryForm.controls['phone']
    this.email                  = this.EditenquiryForm.controls['email']
    this.address                = this.EditenquiryForm.controls['address']
    this.city                   = this.EditenquiryForm.controls['city']
    this.area                   = this.EditenquiryForm.controls['area']
    this.pincode                = this.EditenquiryForm.controls['pincode']


    this.age                    = this.EditenquiryForm.controls['age']
    this.height                 = this.EditenquiryForm.controls['height']
    this.weight                 = this.EditenquiryForm.controls['weight']
    this.blood_group            = this.EditenquiryForm.controls['blood_group']


    this.followup_enquiry_date          = this.Enquiryfollowup.controls['followup_enquiry_date']
    this.enquiry_status         =this.Enquiryfollowup.controls['enquiry_status']
     this.followup_comments     =this.Enquiryfollowup.controls['followup_comments']
    this.followup_date       =this.Enquiryfollowup.controls['followup_date']


 
     
  }

  ngOnInit() {



     // assign drop down values
     this.genderSelect               = this.displayDropDown.getGenderDropDown();
     this.enquirySourceType          = this.displayDropDown.getEnquirySourceType();
     this.bloodGroupType             = this.displayDropDown.getEnquiryBloodGroup();
     this.enquiryStatus               =this.displayDropDown.getEnquiryStatus();

    this.enquiry_id_param = +this.route.snapshot.params["id"];

    this._ownerDetails = this.persistenceService.get("ownerDetails", StorageType.SESSION)
    this._userDetails = this.persistenceService.get('userDetails', StorageType.SESSION);
    this.getAPIResponseObject.records[0].owner_id = this._ownerDetails.owner_id;
    this.getAPIResponseObject.records[0].enquiry_id = this.enquiry_id_param;


    

    this.callHttpPost.makeRequest_getEnquiryFollowup(this.getAPIResponseObject).subscribe(
      (response) => { 
        console.log('****************EnquiryFollowup Response*****************',response);
        this.enquieryFollowArray=response.enquiryFollowup;
        console.log('****************this.enquieryFollowArray Response*****************',this.enquieryFollowArray);

        let compArray: any = [];
        _.forEach(this.enquieryFollowArray, function (value) {

          let Object: any = {
          "enquiry_id": null,
          "enquiry_status": null,
          "followup_date": null,
          "followup_enquiry_date":null,
          "followup_comments":null,
          "recordType": "E",
          "created_by": null,
          "created_on": null,
          "created_by_id": null,
          }


          Object.followup_comments=value.followup_comments;
          Object.enquiry_id = value.enquiry_id;
          Object.enquiry_status = value.enquiry_status;
          Object.followup_date = value.followup_date;
          Object.followup_enquiry_date = value.followup_enquiry_date;
          Object.created_by = value.created_by;
          Object.created_on = value.created_on;
          Object.created_by_id = value.created_by_id;

          compArray.push(Object);

        });

        this.enquieryFollowArray=compArray;
        console.log('*****complaintsArray*********', this.enquieryFollowArray);

      }
    )

    this.callHttpPost.makeRequest_getEnquiry(this.getAPIResponseObject).subscribe(
      (response) => { 
        this._enquiry = response.enquiry;
        console.log('****************API Response*****************',this._enquiry);

      

        this.EditenquiryForm.controls['enquiry_num'].setValue(this._enquiry[0].enquiry_num);
        this.EditenquiryForm.controls['representative_name'].setValue(this._enquiry[0].representative_name);
        this.EditenquiryForm.controls['enquiry_source'].setValue(this._enquiry[0].enquiry_source);
        this.EditenquiryForm.controls['enquiry_date'].setValue(this._enquiry[0].enquiry_date);
        this.EditenquiryForm.controls['activity'].setValue(this._enquiry[0].activity);
        this.EditenquiryForm.controls['comments'].setValue(this._enquiry[0].message);


        this.EditenquiryForm.controls['first_name'].setValue(this._enquiry[0].first_name);
        this.EditenquiryForm.controls['last_name'].setValue(this._enquiry[0].last_name);
        this.EditenquiryForm.controls['gender'].setValue(this._enquiry[0].gender);
        this.EditenquiryForm.controls['phone'].setValue(this._enquiry[0].phone);
        this.EditenquiryForm.controls['email'].setValue(this._enquiry[0].email);
        this.EditenquiryForm.controls['address'].setValue(this._enquiry[0].address);
        this.EditenquiryForm.controls['city'].setValue(this._enquiry[0].city);
        this.EditenquiryForm.controls['area'].setValue(this._enquiry[0].area);
        this.EditenquiryForm.controls['pincode'].setValue(this._enquiry[0].pincode);

        this.EditenquiryForm.controls['age'].setValue(this._enquiry[0].age);
        this.EditenquiryForm.controls['height'].setValue(this._enquiry[0].height);
        this.EditenquiryForm.controls['weight'].setValue(this._enquiry[0].weight);
        this.EditenquiryForm.controls['blood_group'].setValue(this._enquiry[0].blood_group)

        this.customerAge = moment().diff(moment(this._enquiry[0].age), 'years');

        this.weightVal = this._enquiry[0].weight
        if(this.heightVal != 0 && this.heightVal != null){
            this.bmiValue = this.weightVal / this.heightVal
        }

        this.heightVal = (this._enquiry[0].height * this._enquiry[0].height) / 10000
        if(this.weightVal && this.heightVal !=0) {
            this.bmiValue = this.weightVal / this.heightVal
        }


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

            console.log('entered Age block');
              this.customerAge = moment().diff(moment(value), 'years');
          }
      )


      this.enquiry_status.valueChanges.subscribe(
        (value : any) => {
        if(value =='CONTACT IN FUTURE' || value == 'ONHOLD'){
          this.Enquiryfollowupdate=true;
        }else{
          this.Enquiryfollowupdate=false;
        }
      }
      )

        // if (this._enquiry[0].enquiry_status == 'O') {
        //   this.EditenquiryForm.controls['action'].setValue(false);
        //   this.isOpen = true;
        //   this.isClosed = false;
        // } else {
        //   this.EditenquiryForm.controls['action'].setValue(true);
        //   this.isOpen = false;
        //   this.isClosed = true;
        // }

      }
    )
  }

  public enableStatus() {
    console.log('enquiry_status is changed');
    this.isOpen = !this.isOpen;
    this.isClosed = !this.isClosed;
  }


  onSubmit(value: string) {

    this.formJsonValue = JSON.parse(JSON.stringify(this.Enquiryfollowup.value));
    console.log(JSON.stringify(this.Enquiryfollowup.value));

    console.log(this.EditenquiryForm);

    if (this.EditenquiryForm.valid) {

     this.EditenquiryForm.value.enquiry_id=this.enquiry_id_param;
     this.EditenquiryForm.value.modified_by=this._userDetails.user_name;
     this.EditenquiryForm.value.modified_by_id=this._userDetails.user_id;
     this.EditenquiryForm.value.dmlType = 'U';

      console.log('********************Submitted Values ***************************', JSON.parse(JSON.stringify(value)));

      this.formJsonValue = JSON.parse(JSON.stringify(value));

    this.postRequestObject.records[0].enquiry_summary=this.EditenquiryForm.value;
    this.postRequestObject.records[0].enquiry_summary.enquiry_status = this.enquieryFollowArray[this.enquieryFollowArray.length - 1].enquiry_status;
    this.postRequestObject.records[0].enquiry_followup=this.enquieryFollowArray;

    
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




    }
  }


  AddEnquieryFollowUp(){

    if(this.addEnquiery && this.Enquiryfollowup.valid){


    let Object: any = {
      "enquiry_id": null,
      "enquiry_status": null,
      "followup_comments": null,
      "followup_enquiry_date":null,
      "followup_date":null,
      "recordType": "N",
      "created_by": null,  
      "created_on": null,
      "created_by_id": null,
      }



      Object.enquiry_id=this.enquiry_id_param;
      Object.followup_enquiry_date = this.Enquiryfollowup.controls['followup_enquiry_date'].value;
      Object.enquiry_status = this.Enquiryfollowup.controls['enquiry_status'].value;
      Object.followup_comments = this.Enquiryfollowup.controls['followup_comments'].value;
      Object.followup_date = this.Enquiryfollowup.controls['followup_date'].value;
      Object.created_by = this._userDetails.user_name;
      Object.created_by_id = this._userDetails.user_id;

      this.enquieryFollowArray.push(Object);
      this.addEnquiery=false;
      console.log('this.enquieryFollowArray 2',this.enquieryFollowArray);
    }else{
      this.validateFields.validateAllFormFields(this.Enquiryfollowup);

    }
    this.Enquiryfollowup.reset();
  }


  deleteEnquiryRow(status: string, recordType: string) {

    if (recordType == 'N') {
      this.enquieryFollowArray = this.enquieryFollowArray.filter(
        (Object) => {
          return Object.recordType != 'N';
        })
    }
    this.addEnquiery=true;

  }



}
