
// Angular Core Librris
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from "@angular/router";

// import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
// import { AgmCoreModule } from '@agm/core';
// import { HttpClientModule } from "@angular/common/http";
// import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

// Material Bootstrap - MDB Imports
import { MDBSpinningPreloader, MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { PreloadersModule, InputsModule, WavesModule, ToastModule, ButtonsModule  } from 'ng-uikit-pro-standard'
// import { SidenavModule, WavesModule, AccordionModule } from './../../ng-uikit-pro-standard';


/*
  @details - Material Libraries ----------------------------------------------
*/

import {
    MatTableModule, 
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule
} from '@angular/material';


/*
  @details - Additional Modules\Libraries ----------------------------------------------  */
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentStepsModule  } from '@covalent/core/steps';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { CovalentSearchModule } from '@covalent/core/search';
import { CovalentPagingModule } from '@covalent/core/paging';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PersistenceModule } from 'angular-persistence';
import { Angular2CsvModule } from 'angular2-csv';
import { WebcamModule } from 'ngx-webcam';


/*
 @details -   Custom Modules\Libraries ----------------------------------------------
*/
// Common Components
import { MeGymLoginComponent } from './common/me-gym-login/me-gym-login.component';
import { MeGymHomeComponent } from './common/me-gym-home/me-gym-home.component';
import { MeGymNavigationComponent } from './common/me-gym-navigation/me-gym-navigation.component';
import { MeGymLinearLoaderComponent } from './common/me-gym-linear-loader/me-gym-linear-loader.component';
import { MeGymCircularLoaderComponent } from './common/me-gym-circular-loader/me-gym-circular-loader.component';

// Functional Components
import { MeGymManagePackComponent } from './mobigym/me-gym-manage-pack/me-gym-manage-pack.component';
import { MeGymCreatePackComponent } from './mobigym/me-gym-create-pack/me-gym-create-pack.component';
import { MeGymEditPackComponent } from './mobigym/me-gym-edit-pack/me-gym-edit-pack.component';
import { MeGymManageExpenseComponent } from './mobigym/me-gym-manage-expense/me-gym-manage-expense.component';
import { MeGymCreateExpenseComponent } from './mobigym/me-gym-create-expense/me-gym-create-expense.component';
import { MeGymEditExpenseComponent } from './mobigym/me-gym-edit-expense/me-gym-edit-expense.component';
import { MeGymManageEmployeesComponent } from './mobigym/me-gym-manage-employees/me-gym-manage-employees.component';
import { MeGymAddEmployeeComponent } from './mobigym/me-gym-add-employee/me-gym-add-employee.component';
import { MeGymEditEmployeeComponent } from './mobigym/me-gym-edit-employee/me-gym-edit-employee.component';
import { MeGymManagePaymentsComponent } from './mobigym/me-gym-manage-payments/me-gym-manage-payments.component';
import { MeGymAddBalanRvrslComponent } from './mobigym/me-gym-add-balan-rvrsl/me-gym-add-balan-rvrsl.component';
import { MeGymCollectPaymentComponent } from './mobigym/me-gym-collect-payment/me-gym-collect-payment.component';
import { MeGymManageCustomerComponent } from './mobigym/me-gym-manage-customer/me-gym-manage-customer.component';
import { MeGymCreateCustomerComponent } from './mobigym/me-gym-create-customer/me-gym-create-customer.component';
import { MeGymEditCustomerComponent } from './mobigym/me-gym-edit-customer/me-gym-edit-customer.component';
// import { MeGymCreateCustomerComponent } from './mobigym/me-gym-create-customer/me-gym-create-customer.component';
import { MeGymManageComplaintsComponent } from './mobigym/me-gym-manage-complaints/me-gym-manage-complaints.component';
// import { MeGymCreateComplaintComponent } from './mobigym/me-gym-create-complaint/me-gym-create-complaint.component';


// Service
import { MeCalculatePackPriceService } from "./Service/me-calculate-pack-price.service";
import { MeValidateFormFieldsService } from "./Service/me-validate-form-fields.service";
import { MeCallHttpPostService } from "./Service/me-call-http-post.service";
import { MeGymToastNotificationService } from './Service/me-gym-toast-notification.service';
import { MeDisplayDropdownListService } from './Service/me-display-dropdown-list.service';
import { MeCalculateSubscriptionPriceService } from './Service/me-calculate-subscription-price.service';
import { MeImageUploadService } from './Service/me-image-upload.service';


import { MeGymAddComplainComponent } from './mobigym/me-gym-add-complain/me-gym-add-complain.component';
import { MeGymEditComplaintComponent } from './mobigym/me-gym-edit-complaint/me-gym-edit-complaint.component';
import { MeGymCollectionReportComponent } from './mobigym/me-gym-collection-report/me-gym-collection-report.component';
import { MeGymManageEnquiryComponent } from './mobigym/me-gym-manage-enquiry/me-gym-manage-enquiry.component';
import { MeGymCreateEnquiryComponent } from './mobigym/me-gym-create-enquiry/me-gym-create-enquiry.component';
import { MeGymEditEnquiryComponent } from './mobigym/me-gym-edit-enquiry/me-gym-edit-enquiry.component';
import { MeGymInactiveCustomersComponent } from './mobigym/me-gym-inactive-customers/me-gym-inactive-customers.component';
import { MeGymNewCustomersReportComponent } from './mobigym/me-gym-new-customers-report/me-gym-new-customers-report.component';
import { MeGymDueReportComponent } from './mobigym/me-gym-due-report/me-gym-due-report.component';





// Configure Router
const appRoutes: Routes =                      [
      {          path: "login",                    component:   MeGymLoginComponent                     },
      {          path: "home",                     component:   MeGymHomeComponent                      },
      {          path: "managepack",               component:   MeGymManagePackComponent                },
      {          path: "createpack",               component:   MeGymCreatePackComponent                },
      {          path: "editpack/:id",             component:   MeGymEditPackComponent                  },
      {          path: "manageexpense",            component:   MeGymManageExpenseComponent             },
      {          path: "inactivecustomers",        component:   MeGymInactiveCustomersComponent         },
      {          path: "newcustomersreport",       component:   MeGymNewCustomersReportComponent        },
      {          path: "addexpense",               component:   MeGymCreateExpenseComponent             },
      {          path: "editexpense",              component:   MeGymEditExpenseComponent               },
      {          path: "customerduereport",        component:   MeGymDueReportComponent                 },
      {          path: "manageemployees",          component:   MeGymManageEmployeesComponent           },
      {          path: "addemployee",              component:   MeGymAddEmployeeComponent               },
      {          path: "editemployee/:id",         component:   MeGymEditEmployeeComponent              },
      {          path: "managecustomer",           component:   MeGymManageCustomerComponent            },
      {          path: "manageenquiry",            component:   MeGymManageEnquiryComponent             },
      {          path: "createcustomer",           component:   MeGymCreateCustomerComponent            },
      {          path: "createenquiry",            component:   MeGymCreateEnquiryComponent             },
      {          path: "editcustomer/:id",         component:   MeGymEditCustomerComponent              },
      {          path: "editenquiry/:id",          component:   MeGymEditEnquiryComponent               },
      {          path: "managecomplaint",          component:   MeGymManageComplaintsComponent          },
      {          path: "managepayments",           component:   MeGymManagePaymentsComponent            },
      {          path: "addComplain/:id",          component:   MeGymAddComplainComponent               },
      {          path: "editComplaint/:id",        component:   MeGymEditComplaintComponent             },
      {          path: "addBalanRvrsl/:id",        component:   MeGymAddBalanRvrslComponent             },
      {          path: "collectPayment/:id",       component:   MeGymCollectPaymentComponent            },
      {          path: "collectionReport",         component:   MeGymCollectionReportComponent          },
      {          path: "",                         redirectTo:  "login",                                pathMatch:       "full" },
      {          path: "**",                       component:   MeGymLoginComponent                     }
];


@NgModule({
  declarations: [
    AppComponent,
    MeGymLoginComponent,
    MeGymHomeComponent,
    MeGymManageCustomerComponent,
    MeGymNavigationComponent,
    MeGymManagePackComponent,
    MeGymCreatePackComponent,
    MeGymManageExpenseComponent,
    MeGymCreateExpenseComponent,
    MeGymManageEmployeesComponent,
    MeGymAddEmployeeComponent,
    MeGymManageComplaintsComponent,
    MeGymManagePaymentsComponent,
    MeGymEditPackComponent,
    MeGymEditEmployeeComponent,
    MeGymEditExpenseComponent,
    MeGymLinearLoaderComponent,
    MeGymCircularLoaderComponent,
    MeGymAddBalanRvrslComponent,
    MeGymCollectPaymentComponent,
    MeGymCreateCustomerComponent,
    MeGymEditCustomerComponent,
    MeGymAddComplainComponent,
    MeGymEditComplaintComponent,
    MeGymCollectionReportComponent,
    MeGymManageEnquiryComponent,
    MeGymCreateEnquiryComponent,
    MeGymEditEnquiryComponent,
    MeGymInactiveCustomersComponent,
    MeGymNewCustomersReportComponent,
    MeGymDueReportComponent,
    // MeGymCreateCustomerComponent
  ],
  imports: [
    Angular2CsvModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ToastModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    WavesModule,
    ButtonsModule,
    InputsModule,
    WebcamModule,
    // ModalModule,
    PreloadersModule,
    ReactiveFormsModule,
    ChartsModule,
    NgxChartsModule,
    CovalentLayoutModule,
    CovalentStepsModule,
    CovalentDataTableModule,
    CovalentSearchModule,
    CovalentPagingModule,
    MatTableModule, 
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    PersistenceModule,
    SimpleNotificationsModule.forRoot(),
    SweetAlert2Module.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false, useHash:true  } // <-- debugging purposes only
    ),
    // AgmCoreModule.forRoot({
    //   // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
    //   apiKey: 'Your_api_key'
    // })
  ],
  exports: [
    MatTableModule, 
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatMenuModule,
  ],
  providers: [
    MDBSpinningPreloader,
    MeCalculatePackPriceService, 
    MeValidateFormFieldsService, 
    MeCallHttpPostService,
    MeGymToastNotificationService,
    MeDisplayDropdownListService,
    MeCalculateSubscriptionPriceService,
    MeImageUploadService],
  bootstrap: [AppComponent],
  schemas:      [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
