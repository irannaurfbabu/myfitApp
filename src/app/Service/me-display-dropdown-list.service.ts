/*
------------------------------------------------------------------------------------------------
## Datastore Service for Drop Down Values ##
------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   06-JUN-2018 |   CREATED_BY  |   PRIYANK
------------------------------------------------------------------------------------------------
## COMPONENT FUNTIONALITY DETAILS 	##
------------------------------------------------------------------------------------------------
|   ++ Added drop down values for Pack Forms. 
|      
|   
------------------------------------------------------------------------------------------------
## CHANGE LOG DETAILS 				##
------------------------------------------------------------------------------------------------
|   ++ 06-JUN-2018    v1.0     - Created the New Component.
|   ++
------------------------------------------------------------------------------------------------
*/


import {
  Injectable
} from '@angular/core';

@Injectable()
export class MeDisplayDropdownListService {

  // ----------------- ###### Create and Edit Pack Form ###### -----------------
  // ~ Start - Pack Form ______________________________________________________
  getPackType(): Array<any> {
    return [{
      value: 'postpaid',
      label: 'Postpaid'
    },
    {
      value: 'prepaid',
      label: 'Prepaid'
    }
    ];
  }

  getPaymentMode(): Array<any> {
    return [{
      value: 'CASH',
      label: 'CASH'
    },
    {
      value: 'DEBIT CARD',
      label: 'DEBIT CARD'
    },
    {
      value: 'CREDIT CARD',
      label: 'CREDIT CARD'
    },
    {
      value: 'NET BANKING',
      label: 'NET BANKING'
    },
    {
      value: 'E-WALLETS',
      label: 'E-WALLETS'
    },  
    {
      value: 'OTHERS',
      label: 'OTHERS'
    },
    ];
  }

  getRelationshipType(): Array<any> {
    return [
      { value : 'MOTHER', label : 'MOTHER'},
      { value : 'FATHER', label : 'FATHER'},
      { value : 'BROTHER', label : 'BROTHER'},
      { value : 'SISTER', label : 'SISTER'},
      { value : 'SPOUSE', label : 'SPOUSE'},
      { value : 'FRIEND', label : 'FRIEND'},
      { value : 'UNCLE', label : 'UNCLE'},
      { value : 'AUNT', label : 'AUNT'},
    ]
  }

  getPriceType(): Array<any> {

    return [{
      value: 'NT',
      label: 'Non Taxable'
    },
    // {
    //   value: 'GST-0',
    //   label: 'GST[0%]'
    // },
    {
      value: 'GST-5',
      label: 'GST[5%]'
    },
    {
      value: 'GST-12',
      label: 'GST[12%]'
    },
    {
      value: 'GST-18',
      label: 'GST[18%]'
    },
    {
      value: 'GST-28',
      label: 'GST[28%]'
    },
    // {
    //   value: 'IGST-0',
    //   label: 'IGST[0%]'
    // },
    {
      value: 'IGST-5',
      label: 'IGST[5%]'
    },
    {
      value: 'IGST-12',
      label: 'IGST[12%]'
    },
    {
      value: 'IGST-18',
      label: 'IGST[18%]'
    },
    {
      value: 'IGST-28',
      label: 'IGST[28%]'
    }
    ]
  }

  getPackDurationType(): Array<any> {

    return [{
      value: 'dd',
      label: 'Days'
    },

    {
      value: 'mm',
      label: 'Months'
    },
    {
      value: 'yy',
      label: 'Year'
    }
    ]
  }


  // ~ End - Pack Form ______________________________________________________


  // ----------------- ###### Create and Edit Expense Form ###### -----------------
  // ~ Start - Expense Form ______________________________________________________
  getExpenseCategory(): Array<any> {

    return [{
      value: 'Administration',
      label: 'Administration'
    },
    {
      value: 'Salary',
      label: 'Salary'
    },
    {
      value: 'Utility Bills',
      label: 'Utility Bills'
    },
    {
      value: 'Purchase',
      label: 'Purchase'
    },
    {
      value: 'Fitness Enablers',
      label: 'Fitness Enablers'
    },
    {
      value: 'Maintenance',
      label: 'Maintenance'
    },
    {
      value: 'Medical',
      label: 'Medical'
    },
    {
      value: 'Others',
      label: 'Others'
    }
    ]
  }

  getExpenseAdminSubCat(): Array<any> {

    return [{
      value: 'Building Rent',
      label: 'Building Rent'
    },
    {
      value: 'Insurance',
      label: 'Insurance'
    },
    {
      value: 'Office Supply',
      label: 'Office Supply'
    },
    {
      value: 'Consulting Fee',
      label: 'Consulting Fee'
    },
    {
      value: 'Audit Fee',
      label: 'Audit Fee'
    },
    {
      value: 'Others',
      label: 'Others'
    }
    ]
  }

  getExpenseSalarySubCat(): Array<any> {

    return [{
      value: 'Owner',
      label: 'Owner'
    },
    {
      value: 'Receptionist',
      label: 'Receptionist'
    },
    {
      value: 'Trainer',
      label: 'Trainer'
    },
    {
      value: 'Others',
      label: 'Others'
    }
    ]
  }

  getExpenseUtilitySubCat(): Array<any> {

    return [{
      value: 'Internet Bill',
      label: 'Internet Bill'
    },
    {
      value: 'Electricity Bill',
      label: 'Electricity Bill'
    },
    {
      value: 'Water Bill',
      label: 'Water Bill'
    },
    {
      value: 'Phone Bill',
      label: 'Phone Bill'
    },
    {
      value: 'Cable Bill',
      label: 'Cable Bill'
    },
    {
      value: 'Others',
      label: 'Others'
    }
    ]
  }

  getExpensePurchaseSubCat(): Array<any> {

    return [{
      value: 'Equipments',
      label: 'Equipments'
    },
    {
      value: 'TV',
      label: 'TV'
    },
    {
      value: 'Music System',
      label: 'Music System'
    },
    {
      value: 'Others',
      label: 'Others'
    }
    ]
  }

  getExpenseFitEnbSubCat(): Array<any> {

    return [{
      value: 'Nutrition',
      label: 'Nutrition'
    },
    {
      value: 'Accessories',
      label: 'Accessories'
    },
    {
      value: 'Others',
      label: 'Others'
    }
    ]
  }

  getExpenseMaintSubCat(): Array<any> {

    return [{
      value: 'Equipments',
      label: 'Equipments'
    },
    {
      value: 'TV',
      label: 'TV'
    },
    {
      value: 'Music System',
      label: 'Music System'
    },
    {
      value: 'Others',
      label: 'Others'
    }
    ]
  }

  getExpenseMedicalSubCat(): Array<any> {

    return [
    {
      value: 'Others',
      label: 'Others'
    }
    ]
  }

  getExpenseOthersSubCat(): Array<any> {

    return [{
      value: 'Others',
      label: 'Others'
    },
    ]
  }



  // ~ End - Expense Form ______________________________________________________


  // ----------------- ###### Add and Edit Employee Form ###### -----------------
  // ~ Start - Employee Form ______________________________________________________
  getEmployeeDropDown(): Array<any> {

    return [{
      value: 'owner',
      label: 'Owner'
    },
    {
      value: 'supervisor',
      label: 'Supervisor'
    },
    {
      value: 'trainer',
      label: 'Trainer'
    },
    {
      value: 'staff',
      label: 'Staff'
    }
    ]
  }

  getGenderDropDown(): Array<any> {

    return [{
      value: 'M',
      label: 'Male'
    },
    {
      value: 'F',
      label: 'Female'
    }
    ]
  }



  // ~ End - Employee Form ____________________________________________


  // Remove Below ______________________________________________________

  getSubscriptionType(): Array<any> {

    return [{
      value: 'prepaid',
      label: 'Prepaid'
    },
    {
      value: 'postpaid',
      label: 'Postpaid'
    }
    ]
  }

  getPaymentType(): Array<any> {

    return [{
      value: '1',
      label: 'Registration Fee'
    },
    {
      value: '2',
      label: 'Deposit'
    },
    {
      value: '3',
      label: 'Subscription Fees'
    },{
      value: '4',
      label: 'Discount'
    }
    ]
  }

  getComplaintType(): Array<any> {

    return [
      { value: 'PMNT', label: 'Payment' },
      // { value: 'SER', label: 'Service' },
      { value: 'EQMT', label: 'Equipment' },
      { value: 'TNER', label: 'Trainer' },
      { value: 'GYMA', label: 'Gym-Area' },
      { value: 'LKCR', label: 'Locker & Changing Room' },
    ];
  }

  getPackSubscriptionType(): Array<any> {

    return [{
      value: '1',
      label: 'Prepaid'
    },
    {
      value: '2',
      label: 'Postpaid'
    }
    ]
  }

  getEnquirySourceType(): Array<any> {

    return [{
      value: 'Walk-in',
      label: 'Walk-in'
    },
    {
      value: 'Referral',
      label: 'Referral'
    },
    {
      value: 'Advertisement',
      label: 'Advertisement'
    },
    {
      value: 'Internet',
      label: 'Internet-Search'
    },
    {
      value: 'Employee Referral',
      label: 'Employee Referral'
    },
    {
      value: 'Customer Referral',
      label: 'Customer Referral'
    }
    ]
  }

  getEnquiryBloodGroup(): Array<any> {

    return [{
      value: 'O+ve',
      label: 'O+ve'
    },
    {
      value: 'O-ve',
      label: 'O-ve'
    },
    {
      value: 'A+ve',
      label: 'A+ve'
    },
    {
      value: 'A-ve',
      label: 'A-ve'
    },
    {
      value: 'B+ve',
      label: 'B+ve'
    },
    {
      value: 'B-ve',
      label: 'B-ve'
    },
    {
      value: 'AB+ve',
      label: 'AB+ve'
    },
    {
      value: 'AB-ve',
      label: 'AB-ve'
    }
    ]
  }


  getEnquiryStatus(): Array<any> {

    return [{
      value: 'INTERESTED',
      label: 'Interested'
    },
    {
      value: 'NOT INTERESTED',
      label: 'Not Interested'
    },
    {
      value: 'ONHOLD',
      label: 'On-Hold'
    },
    {
      value: 'CONTACT IN FUTURE',
      label: 'Contact In Future'

    },

    ]

  }

  getExpenseSubCategoryArray(value : any) : Array<any> {
    switch(value) {
      case 'Administration': {
        
        return this.getExpenseAdminSubCat();
      }
      case 'Salary': {
        
        return this.getExpenseSalarySubCat();
      }
      case 'Utility Bills': {
        return this.getExpenseUtilitySubCat();
      }
      case 'Purchase': {
        return this.getExpensePurchaseSubCat();
      }
      case 'Fitness Enablers': {
        return this.getExpenseFitEnbSubCat();
      }
      case 'Maintenance': {
        return this.getExpenseMaintSubCat();
      }
      case 'Medical': {
        return this.getExpenseMedicalSubCat();
      }
      case 'Others' : {
        return this.getExpenseOthersSubCat();
      }
  }
  }


}