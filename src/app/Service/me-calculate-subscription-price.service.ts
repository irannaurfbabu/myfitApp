import { Injectable } from '@angular/core';

@Injectable()
export class MeCalculateSubscriptionPriceService {

  length: number;
  total_base_price: number 
  total_cgst_amount: number
  total_sgst_amount: number
  total_tax: number
  total_amount: number

  constructor() {

    

   }

  calculateTotalPrice(array: any) {

    this.total_base_price = 0
    this.total_cgst_amount = 0
    this.total_sgst_amount = 0
    this.total_tax = 0
    this.total_amount = 0

  
    for(var i=0; i< array.length; i++){

      this.total_base_price += array[i].base_price
      this.total_cgst_amount += array[i].cgst_amount
      this.total_sgst_amount += array[i].sgst_amount
      this.total_tax += array[i].total_tax
      this.total_amount += array[i].total_amount

      console.log('total base price ', this.total_base_price)
      console.log('total cgst amount ', this.total_cgst_amount)
    }
    
    


  }

}
