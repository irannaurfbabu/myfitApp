import { Component, OnInit } from '@angular/core';

import { PersistenceService } from 'angular-persistence';
// import * as _ from 'lodash';
// import * as moment from 'moment';

 

// import services
import { MeCallHttpPostService } from "../../Service/me-call-http-post.service";
import { StorageType }  from  "../../Service/Interfaces/storage-type.enum";


@Component({
  selector: 'app-me-gym-navigation',
  templateUrl: './me-gym-navigation.component.html',
  styleUrls: ['./me-gym-navigation.component.scss']
})
export class MeGymNavigationComponent implements OnInit {

  user_login_id : any = "";
  ownerCompanyName : any;
  owner_id: any;
  ownerDetails : any;
  userName : any;
  email: any;

  // Private Local Variables
private _userProfile : any = [];
private getUserProfileAPI_Input: any = {records:[{user_login_id: null }]};

  constructor(public callHttpPost : MeCallHttpPostService,
    private persistenceService   : PersistenceService,) { }

  ngOnInit() {


    // fetch login id from cache
  this.user_login_id =  this.persistenceService.get('userLoginID', StorageType.SESSION);
  

  console.log("--- User Login ID ---");
  console.log(this.user_login_id);

  // this.ownerDetails = this.persistenceService.get('ownerDetails', StorageType.SESSION);
  // console.log('**********OwnerId************', this.ownerDetails.owner_id);
  // this.ownerCompanyName = this.ownerDetails.owner_company_name;

  // set get request input value
  this.getUserProfileAPI_Input.records[0].user_login_id = this.user_login_id;
  console.log(
    "%c ---------------------------- *****  API INPUT ***** ---------------------------- ",
    "background: #5e35b1;color: white; font-weight: bold;" );
  console.log( this.getUserProfileAPI_Input); 

    // make api call to fetch user profile data  
  this.callHttpPost.makeRequest_getUserProfile(this.getUserProfileAPI_Input)
  .subscribe(
    (response) => {
      
      console.log(
        "%c ---------------------------- *****  API RESPONSE ***** ---------------------------- ",
        "background: #ADF11A;color: black; font-weight: bold;");
      console.log(response);
    
      this._userProfile = response;

      if(this._userProfile.ownerDetails  && this._userProfile.userDetails ) {
        
        console.log(
          "%c ---------------------------- *****  PROFILE DETAILS ***** ---------------------------- ",
          "background: #FFF59D;color: black; font-weight: bold;");
          console.log(this._userProfile.ownerDetails);
          console.log(this._userProfile.userDetails);
    
          // Save the Input format in cache for use in other Components & Service - Using PersistenceService Service.
          this.persistenceService.set("ownerDetails", this._userProfile.ownerDetails,{type: StorageType.SESSION});
          this.persistenceService.set("userDetails", this._userProfile.userDetails,{type: StorageType.SESSION});

          this.ownerCompanyName = this._userProfile.ownerDetails.owner_company_name;
          console.log('***********OwnercompanyName************', this.ownerCompanyName)
          this.owner_id = this._userProfile.ownerDetails.owner_id;
          console.log('***********OwnerId************', this.owner_id)
          this.userName = this._userProfile.ownerDetails.owner_name;
          this.email = this._userProfile.ownerDetails.owner_email;


        
      }
  });
}

clear_cache() {

  // clear cache variables;
this.persistenceService.remove('ownerDetails',StorageType.SESSION);
this.persistenceService.remove('userDetails',StorageType.SESSION);

// clears all storage saved by this service, and returns a list of keys that were removed;
this.persistenceService.removeAll(StorageType.SESSION);

//cleans the storage of expired objects
this.persistenceService.clean(StorageType.SESSION);

}

}
