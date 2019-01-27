import { element } from 'protractor';
import { MeDisplayDropdownListService } from './../../Service/me-display-dropdown-list.service';
import { Component, OnInit } from '@angular/core';
import { MeCallHttpPostService } from '../../Service/me-call-http-post.service';
import { Router, ActivatedRoute } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';

import * as _ from 'lodash';

import * as moment from 'moment';
import swal from "sweetalert2";
import { PersistenceService } from 'angular-persistence';
import { StorageType } from "../../Service/Interfaces/storage-type.enum";


@Component({
  selector: 'app-me-gym-edit-complaint',
  templateUrl: './me-gym-edit-complaint.component.html',
  styleUrls: ['./me-gym-edit-complaint.component.scss']
})
export class MeGymEditComplaintComponent implements OnInit {

  optionsSelect: Array<any>;
  complainStatusOptions: Array<any>;
  complaintsArray: Array<any> = [];
  _titlesArray: Array<any>;
  _paymentArray: Array<any>;
  _serviceArray: Array<any>;
  _equipmentArray: Array<any>;
  _gymAreaArray: Array<any>;
  _lockerArray: Array<any>;
  _trainerArray: Array<any>;
  displayTitleArray: Array<any>;
  customer_number_param: any;
  _ownerDetails: any;
  _userDetails : any;

  private getCustomerDetailsAPI_Input: any = {
    records: [{
      owner_id: null,
      customer_number: null
    }]
  }
  _customerDetailsObj: any = [];
  _customerComplaintsObj: any = [];
  _complaintDetailsObj: any = [];
  _employeeList : any = [];
  displayName: string = '';
  displayAddress: string = '';
  displayPhone: number;
  displayId: number;
  displayStatus: any;
  displayDate: any;
  displayRegisteredBy: any;
  displayPmnt: boolean = false;
  displaySer: boolean = false;
  displayEqmt: boolean = false;
  // displayPmntModal: boolean;
  // displaySerModal: boolean;
  // displayEqmtModal: boolean;
  complaint_id: any;
  complaint_title: AbstractControl;
  complaint_type: AbstractControl;
  complaint_description: AbstractControl;

  complaint_status: AbstractControl;
  complaint_comments: AbstractControl;
  complaint_assigned_to: AbstractControl;
  options: string[] = [];

  titleArray: any = [
    { "name": "Option 1" },
    { "name": "Option 2" },
    { "name": "Option 3" },
    { "name": "Option 4" },
  ]

  addComplain: FormGroup;
  complaintProgress: FormGroup;

  formJSON: any;

  postRequestObject: any = {
    "records": [
      {
        "complaint_summary": {
          "complaint_type": '',
          "complaint_description": '',
          "complaint_title_id": '',
          "dmlType": "U",
          "recordType": "E",
          "complaint_status": '',
          "created_by": "",
          "owner_id": '',
          "modified_by": "",
          "logged_by": '',
          "active": "Y",
          "complaint_title": '',
          "complaint_id": '',
          "customer_number": '',
          "customer_id": '',
          "created_by_id": ''
        },
        "complaint_details": []
      }
    ]
  };

  constructor(public callHttpPost: MeCallHttpPostService,
    public router: Router,
    public route: ActivatedRoute,
    private persistenceService: PersistenceService,
    fb: FormBuilder,
  private displayDropdown : MeDisplayDropdownListService) {

    this.addComplain = fb.group({
      complaint_title: [null, Validators.required],
      complaint_type: [null, Validators.required],
      complaint_description: ['']
    });
    this.complaintProgress = fb.group({
      complaint_status: [null],
      complaint_comments: [null],
      complaint_assigned_to: [null]
    })

    this.complaint_title = this.addComplain.controls['complaint_title'];
    this.complaint_type = this.addComplain.controls['complaint_type'];
    this.complaint_description = this.addComplain.controls['complaint_description'];

    this.complaint_assigned_to = this.complaintProgress.controls['complaint_assigned_to'];
    this.complaint_comments = this.complaintProgress.controls['complaint_comments'];
    this.complaint_status = this.complaintProgress.controls['complaint_status'];
  }



  ngOnInit() {

    this.optionsSelect = this.displayDropdown.getComplaintType();
    this.complainStatusOptions = [
      { value: 'ASSN', label: 'ASSIGNED' },
      { value: 'INPR', label: 'IN-PROGRESS' },
      { value: 'CAN', label: 'CANCELLED' },
      { value: 'CLSD', label: 'CLOSED' },
    ]

    this.customer_number_param = +this.route.snapshot.params["id"];
    console.log("---- --- --- Customer Number Received ---- --- ---");
    console.log(this.customer_number_param);

    this._ownerDetails = this.persistenceService.get("ownerDetails", StorageType.SESSION);
    this._userDetails = this.persistenceService.get("userDetails", StorageType.SESSION);
    console.log('*********ownerId*********', this._ownerDetails.owner_id);


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

          this.postRequestObject.records[0].complaint_summary.customer_id = this.displayId;


        }
      }
    )

    // make api call to fetch data ~ Start -----------------------
    this.callHttpPost.makeRequest_getEmployee({ "records": [{ "owner_id": this._ownerDetails.owner_id }] }).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- ***** Manage Employee API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);

        // assign to local variable
        this._employeeList = response.employeeList
        let empArray : any = [];
        _.forEach(this._employeeList, function(val) {
          empArray.push({value: val.full_name, label: val.full_name})
        })
        this._employeeList = empArray;
        console.log("**************employeeList**************", this._employeeList);

      })


    this.callHttpPost.makeRequest_getComplainTitles(this.getCustomerDetailsAPI_Input).subscribe(
      (response) => {

        console.log(
          "%c ---------------------------- ***** API RESPONSE ***** ---------------------------- ",
          "background: #ADF11A;color: black; font-weight: bold;");
        console.log(response);

        this._titlesArray = response.complainTitles;
        console.log('************TitlesArray**************', this._titlesArray);

        let selectedTitleArray: any = [];
        _.forEach(this._titlesArray, function (val) {
          selectedTitleArray.push({ value: val.complaint_title_id, label: val.complaint_title })
          console.log(selectedTitleArray)
        });
        this.displayTitleArray = selectedTitleArray;

        

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



        console.log('**********Payment Array***********', this._paymentArray);
        console.log('*********Equipment Array***********', this._equipmentArray);
        console.log('**********Service Array***********', this._serviceArray);

        this.callHttpPost.makeRequest_getComplaints(this.getCustomerDetailsAPI_Input).subscribe(
          (response) => {

            console.log(
              "%c ---------------------------- ***** API RESPONSE ***** ---------------------------- ",
              "background: #ADF11A;color: black; font-weight: bold;");
            console.log(response);
            this._customerComplaintsObj = response.complaintList;

            if (this._customerComplaintsObj) {
              this.addComplain.controls['complaint_type'].setValue(this._customerComplaintsObj[0].complaint_type);
              this.addComplain.controls['complaint_title'].setValue(this._customerComplaintsObj[0].complaint_title_id);
              this.addComplain.controls['complaint_description'].setValue(this._customerComplaintsObj[0].complaint_description);
              this.displayStatus = this._customerComplaintsObj[0].complaint_status;
              this.displayDate = this._customerComplaintsObj[0].complaint_date;
              this.displayRegisteredBy = this._customerComplaintsObj[0].created_by;
              this.complaint_id = this._customerComplaintsObj[0].complaint_id;

              this.postRequestObject.records[0].complaint_summary.complaint_id = this.complaint_id;


              this.callHttpPost.makeRequest_getComplaintDetails({ "records": [{ "complaint_id": this.complaint_id }] }).subscribe(
                (response) => {
                  this._complaintDetailsObj = response.complaintDetails;
                  console.log('--------complaintDetails-----------', this._complaintDetailsObj);

                  let compArray: any = [];
                  _.forEach(this._complaintDetailsObj, function (value) {

                    let Object: any = {
                      "complaint_comments": '',
                      "assigned_to": '',
                      "assigned_on": '',
                      "complaint_status": '',
                      "recordType": 'E',
                      "created_by": '',
                      "complaint_dtls_id": '',
                      "complaint_id": '',
                      "assigned_to_id": '',
                      "assigned_to_name": '',
                      "created_on": '',
                      "created_by_id": '',
                      "modified_on": '',
                      "modified_by": '',
                      "modified_by_id": ''
                    }



                    Object.complaint_comments = value.complaint_comments;
                    Object.assigned_to = value.assigned_to;
                    Object.assigned_on = value.assigned_on;
                    Object.complaint_status = value.complaint_status;
                    Object.complaint_dtls_id = value.complaint_dtls_id;
                    Object.complaint_id = value.complaint_id;
                    Object.created_on = value.created_on;

                    compArray.push(Object);

                  });

                  this.complaintsArray = compArray;



                  console.log('*****complaintsArray*********', this.complaintsArray);

                }
              )




            }
          }
        )



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

    this.formJSON = JSON.parse(JSON.stringify(value));

    console.log('======formJSON=============', this.formJSON);

    this.postRequestObject.records[0].complaint_details = this.complaintsArray;
    this.postRequestObject.records[0].complaint_summary.complaint_type = this.formJSON.complaint_type;
    this.postRequestObject.records[0].complaint_summary.complaint_description = this.formJSON.complaint_description;
    // this.postRequestObject.records[0].complaint_summary.complaint_title = this.formJSON.complaint_title;
    this.postRequestObject.records[0].complaint_summary.complaint_title_id = this.formJSON.complaint_title;
    this.postRequestObject.records[0].complaint_summary.modified_by = this._userDetails.user_name;
    this.postRequestObject.records[0].complaint_summary.customer_number = this.customer_number_param;
    this.postRequestObject.records[0].complaint_summary.owner_id = this._ownerDetails.owner_id;
    this.postRequestObject.records[0].complaint_summary.complaint_status = this.complaintsArray[this.complaintsArray.length - 1].complaint_status;

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






  addComplaintProgress() {

    console.log('*********************', this.complaintProgress.controls['complaint_status'].value);
    console.log('*********************', this.complaintProgress.controls['complaint_comments'].value);
    console.log('*********************', this.complaintProgress.controls['complaint_assigned_to'].value);

    let duplicateArray: any = [];

    let complaintObject: any = {
      "complaint_comments": '',
      "assigned_to": '',
      "assigned_on": '',
      "complaint_status": '',
      "recordType": 'N',
      "created_by": '',
      "assigned_to_id": '',
      "assigned_to_name": '',
      "created_on": '',
      "created_by_id": '',
     
    }
    let status: any = this.complaintProgress.controls['complaint_status'].value;
    if (status == "ASSN") {
      complaintObject.complaint_status = 'ASSIGNED';
    } else if (status == "INPR") {
      complaintObject.complaint_status = 'IN-PROGRESS';
    } else if (status == "CAN") {
      complaintObject.complaint_status = 'CANCELLED';
    } else if (status == "CLSD") {
      complaintObject.complaint_status = 'CLOSED';
    }

    complaintObject.complaint_comments = this.complaintProgress.controls['complaint_comments'].value;
    complaintObject.assigned_to = this.complaintProgress.controls['complaint_assigned_to'].value;
    complaintObject.assigned_on = moment();
    complaintObject.created_on = moment();
    complaintObject.created_by = this._userDetails.user_name;

    duplicateArray = this.complaintsArray.filter(
      (object) => {
        return object.complaint_status == complaintObject.complaint_status;
      }
    )
    console.log('********Duplicate Array*********', duplicateArray);
    if (duplicateArray.length == 0 && complaintObject.complaint_status != null) {
      this.complaintsArray.push(complaintObject);
      console.log('**********ComplaintsArray***********', this.complaintsArray);
    }

    this.complaintProgress.controls['complaint_comments'].setValue(null);
    this.complaintProgress.controls['complaint_assigned_to'].setValue(null);
    this.complaintProgress.controls['complaint_status'].setValue(null);




  }

  deleteComplaintRow(status: string, recordType: string) {

    if (recordType == 'N') {
      this.complaintsArray = this.complaintsArray.filter(
        (Object) => {
          return Object.complaint_status != status;
        }
      )
    }
  }

}

