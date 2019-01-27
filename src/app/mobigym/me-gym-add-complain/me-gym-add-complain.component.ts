import { MeDisplayDropdownListService } from './../../Service/me-display-dropdown-list.service';
import { Component, OnInit } from '@angular/core';
import { MeCallHttpPostService } from '../../Service/me-call-http-post.service';
import { Router, ActivatedRoute } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';

import * as moment from 'moment';
import * as _ from 'lodash';
import swal from "sweetalert2";
import { PersistenceService } from 'angular-persistence';
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";

@Component({
  selector: 'app-me-gym-add-complain',
  templateUrl: './me-gym-add-complain.component.html',
  styleUrls: ['./me-gym-add-complain.component.scss']
})
export class MeGymAddComplainComponent implements OnInit {


  optionsSelect: Array<any>;
  _titlesArray: Array<any>;
  _paymentArray: Array<any>;
  _serviceArray: Array<any>;
  _equipmentArray: Array<any>;
  _gymAreaArray: Array<any>;
  _lockerArray: Array<any>;
  _trainerArray: Array<any>;
  complainTypeSelect: any;
  displayTitleArray: Array<any>;
  _ownerDetails : any;
  _userDetails : any;
  customer_number_param: any;
  private getCustomerDetailsAPI_Input: any = {
    records: [{
      owner_id: null,
      customer_number: null
    }]
  }
  _customerDetailsObj: any = [];
  displayName: string = '';
  displayAddress: string = '';
  displayPhone: number;
  displayId: number;
  displayPmnt: boolean = false;
  displaySer: boolean = false;
  displayEqmt: boolean = false;
  complaint_title: AbstractControl;
  complaint_type: AbstractControl;
  complaint_description: AbstractControl;
  payment: AbstractControl;
  equipment: AbstractControl;
  service: AbstractControl;

  addComplain: FormGroup;

  postRequestObject: any = {
    'records': [
      {
        "complaint_summary": {
          'customer_number': '',
          'customer_id': '',
          'complaint_title': '',
          'complaint_title_id': '',
          'complaint_description': '',
          'complaint_type': '',
          'registered_on': '',
          'registered_by': '',
          'complaint_status': '',
          'dmlType': 'I',
          'created_by': '',
          'active': 'Y'
        }
      }

    ]
  }


  constructor(public callHttpPost: MeCallHttpPostService,
    public router: Router,
    public route: ActivatedRoute,
    private persistenceService : PersistenceService,
    fb: FormBuilder,
  private displayDropdown : MeDisplayDropdownListService) {

    this.addComplain = fb.group({
      complaint_title: [null, Validators.required],
      complaint_type: [null, Validators.required],
      complaint_description: [''],
      payment: [null],
      equipment: [null],
      service: [null],
    });

    this.complaint_title = this.addComplain.controls['complaint_title'];
    this.complaint_type = this.addComplain.controls['complaint_type'];
    this.complaint_description = this.addComplain.controls['complaint_description'];
    this.payment = this.addComplain.controls['payment'];
    this.equipment = this.addComplain.controls['equipment'];
    this.service = this.addComplain.controls['service'];
  }

  ngOnInit() {

    this.complainTypeSelect = this.displayDropdown.getComplaintType();

    this._ownerDetails = this.persistenceService.get("ownerDetails", StorageType.SESSION);
    this._userDetails = this.persistenceService.get("userDetails", StorageType.SESSION);
        console.log('*********ownerId*********', this._ownerDetails.owner_id);

    this.customer_number_param = +this.route.snapshot.params["id"];
    console.log("---- --- --- Customer Number Received ---- --- ---");
    console.log(this.customer_number_param);

    this.getCustomerDetailsAPI_Input.records[0].owner_id = this._ownerDetails.owner_id;
    this.getCustomerDetailsAPI_Input.records[0].customer_number = this.customer_number_param;

    this.callHttpPost.makeRequest_getCustomerList(this.getCustomerDetailsAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- ***** API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);

        this._customerDetailsObj = response.customerList;

        if (this._customerDetailsObj.length > 0) {
          this.displayName = this._customerDetailsObj[0].full_name;
          this.displayId = this._customerDetailsObj[0].customer_id;
          this.displayPhone = this._customerDetailsObj[0].phone;
          this.displayAddress = this._customerDetailsObj[0].address;
        }
      }
    )

    this.callHttpPost.makeRequest_getComplainTitles(this.getCustomerDetailsAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- ***** API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);

        this._titlesArray = response.complainTitles;
        console.log('************TitlesArray**************', this._titlesArray);

        this._paymentArray = this._titlesArray.filter(
          (object) => {
            return object.complaint_type == 'PMNT';
          }
        )
        this._equipmentArray = this._titlesArray.filter(
          (object) => {
            return object.complaint_type == 'EQMT';
          }
        )
        this._serviceArray = this._titlesArray.filter(
          (object) => {
            return object.complaint_type == 'SER';
          }
        )
        this._trainerArray = this._titlesArray.filter(
          (object) => {
            return object.complaint_type == 'TNER';
          }
        )
        this._lockerArray = this._titlesArray.filter(
          (object) => {
            return object.complaint_type == 'LKCR';
          }
        )
        this._gymAreaArray = this._titlesArray.filter(
          (object) => {
            return object.complaint_type == 'GYMA';
          }
        )


        let pArray: any = [];
        _.forEach(this._paymentArray, function (val) {
          pArray.push({ value: val.complaint_title_id, label: val.complaint_title })
          console.log(pArray)
        });
        this._paymentArray = pArray;

        let sArray: any = [];
        _.forEach(this._serviceArray, function (val) {
          sArray.push({ value: val.complaint_title_id, label: val.complaint_title })
          console.log(sArray)
        });
        this._serviceArray = sArray;

        let eArray: any = [];
        _.forEach(this._equipmentArray, function (val) {
          eArray.push({ value: val.complaint_title_id, label: val.complaint_title })
          console.log(eArray)
        });
        this._equipmentArray = eArray;

        let gymaArray: any = [];
        _.forEach(this._gymAreaArray, function (val) {
          gymaArray.push({ value: val.complaint_title_id, label: val.complaint_title })
          console.log(gymaArray)
        });
        this._gymAreaArray = gymaArray;

        let lockArray: any = [];
        _.forEach(this._lockerArray, function (val) {
          lockArray.push({ value: val.complaint_title_id, label: val.complaint_title })
          console.log(lockArray)
        });
        this._lockerArray = lockArray;

        let tArray: any = [];
        _.forEach(this._trainerArray, function (val) {
          tArray.push({ value: val.complaint_title_id, label: val.complaint_title })
          console.log(tArray)
        });
        this._trainerArray = tArray;


        console.log('**********Payment Array***********', this._paymentArray);
        console.log('*********Equipment Array***********', this._equipmentArray);
        console.log('**********Service Array***********', this._serviceArray);

      }
    )


    this.complaint_type.valueChanges.subscribe(
      (value: string) => {
        if (value == "PMNT") {
         
          this.displayTitleArray = this._paymentArray;

        } else if (value == "EQMT") {
          
          this.displayTitleArray = this._equipmentArray;

        } else if (value == 'SER') {
          
          this.displayTitleArray = this._serviceArray;
        } else if (value == 'GYMA') {
          
          this.displayTitleArray = this._gymAreaArray;
        } else if (value == 'LKCR') {
          
          this.displayTitleArray = this._lockerArray;
        } else if (value == 'TNER') {
          
          this.displayTitleArray = this._trainerArray;
        }

      }
    )


  }

  onSubmit(value: string): void {
    if (this.addComplain.valid) {

      console.log(value);

      let formJSONValue: any;

      formJSONValue = JSON.parse(JSON.stringify(value));

      this.postRequestObject.records[0].complaint_summary.customer_number = this.customer_number_param;
      this.postRequestObject.records[0].complaint_summary.customer_id = this._customerDetailsObj[0].customer_id;
      this.postRequestObject.records[0].complaint_summary.complaint_title_id = formJSONValue.complaint_title;
      // this.postRequestObject.records[0].complaint_summary.complaint_title   = formJSONValue.complaint_title;
      this.postRequestObject.records[0].complaint_summary.complaint_description = formJSONValue.complaint_description;
      this.postRequestObject.records[0].complaint_summary.registered_by = this._userDetails.user_name;
      this.postRequestObject.records[0].complaint_summary.created_by = this._userDetails.user_name;
      this.postRequestObject.records[0].complaint_summary.registered_on = moment();
      this.postRequestObject.records[0].complaint_summary.complaint_status = 'REGISTERED';
      this.postRequestObject.records[0].complaint_summary.owner_id = this._ownerDetails.owner_id;
      this.postRequestObject.records[0].complaint_summary.complaint_type = formJSONValue.complaint_type;



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

          this.callHttpPost.makeRequest_manageComplaints(this.postRequestObject).subscribe(
            (response) => {
              console.log(
                "%c ---------------------------- ***** API RESPONSE ***** ---------------------------- ",
                "background: #ADF11A;color: black; font-weight: bold;");
              console.log(response);

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
                  type: 'success',
                  title: 'Your work has been saved',
                  text: 'Click OK to proceed...',
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                  showConfirmButton: true

                }).then((result) => {

                  if (result.value) {
                    this.router.navigateByUrl('/managecomplaint');

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

      });//  call sweet alert - End ___________________________________________________________________________________________________






    }
  }

}
