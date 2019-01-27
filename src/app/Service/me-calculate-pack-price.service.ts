import { Injectable } from "@angular/core";

@Injectable()
export class MeCalculatePackPriceService {
  base_price:number = 0;
  cgst_amount:number = 0;
  sgst_amount:number = 0;
  total_tax:number = 0;
  total_amount:number = 0;

  displayigst      : number  = 0;
  gstAmount        : number  = 0;

  igstSelected     : boolean;
  gstSelected      : boolean;
  nonTaxable       : boolean;

  constructor() {}

  // calculate pack price
  calculatePackPrice(p_baseprice: string, p_pricetype: string): void {

   if(!(p_baseprice && p_pricetype)){
     console.error('Message1 - Incorrect or Null values received for price caculation');
     console.error('Values - >> base price : ',p_baseprice,' >> price type : ', p_pricetype );

     this.base_price = 0;
     this.cgst_amount = 0;
     this.sgst_amount = 0;
     this.total_tax = 0;
     this.total_amount = 0;

   }  

   if( parseInt(p_baseprice) === 0 && p_pricetype === null ){
      this.base_price = 0;
      this.cgst_amount = 0;
      this.sgst_amount = 0;
      this.total_tax = 0;
      this.total_amount = 0;
  }  

  if( parseInt(p_baseprice) === null && p_pricetype ){
    this.base_price = 0;
    this.cgst_amount = 0;
    this.sgst_amount = 0;
    this.total_tax = 0;
    this.total_amount = 0;
}  

   if(p_baseprice && p_pricetype) {
              // Calculate totals if the base price > 0 
            // ~~ Start ----------------------------------------------------------------------
            if (parseInt(p_baseprice) > 0 ) {
              switch (p_pricetype) {
                case "NT": {
                  console.log("NT");
                  this.nonTaxable = true;
                  this.gstAmount = 0;

                  this.base_price   = parseFloat(p_baseprice);
                  this.cgst_amount  = 0.0;
                  this.sgst_amount  = 0.0;
                  this.total_tax    = 0.0;
                  this.total_amount = parseFloat(p_baseprice);

                  break;
                }
                case "GST-0": {
                  console.log("GST-0");
                  this.nonTaxable = false;
                  this.gstSelected = true;
                  this.igstSelected = false;
                  this.gstAmount = 0;


                  this.base_price = parseFloat(p_baseprice);
                  this.cgst_amount = 0.0;
                  this.sgst_amount = 0.0;
                  this.total_tax = 0.0;
                  this.total_amount = parseFloat(p_baseprice);

                  break;
                }
                case "GST-5": {
                  console.log("GST-5");
                  this.nonTaxable = false;
                  this.gstSelected = true;
                  this.igstSelected = false;
                  this.gstAmount = 5;

                  // this.base_price = parseFloat(p_baseprice);
                  // this.cgst_amount = parseFloat(p_baseprice) * (2.5 / 100);
                  // this.sgst_amount = parseFloat(p_baseprice) * (2.5 / 100);
                  // this.total_tax = this.cgst_amount + this.sgst_amount;
                  // this.total_amount = this.base_price + this.total_tax;

                  this.base_price = (100/105) * parseFloat(p_baseprice);
                  this.total_amount = parseFloat(p_baseprice);
                  this.cgst_amount = (this.total_amount - this.base_price)/2;
                  this.sgst_amount = (this.total_amount - this.base_price)/2;
                  this.total_tax = this.cgst_amount + this.sgst_amount;
                  


                  break;
                }
                case "GST-12": {
                  console.log("GST-12");
                  this.nonTaxable = false;
                  this.gstSelected = true;
                  this.igstSelected = false;
                  this.gstAmount = 12;

                  // this.base_price = parseFloat(p_baseprice);
                  // this.cgst_amount = parseFloat(p_baseprice) * (6 / 100);
                  // this.sgst_amount = parseFloat(p_baseprice) * (6 / 100);
                  // this.total_tax = this.cgst_amount + this.sgst_amount;
                  // this.total_amount = this.base_price + this.total_tax;

                  this.base_price = (100/112) * parseFloat(p_baseprice);
                  this.total_amount = parseFloat(p_baseprice);
                  this.cgst_amount = (this.total_amount - this.base_price)/2;
                  this.sgst_amount = (this.total_amount - this.base_price)/2;
                  this.total_tax = this.cgst_amount + this.sgst_amount;

                  break;
                }
                case "GST-18": {
                  console.log("GST-18");
                  this.nonTaxable = false;
                  this.gstSelected = true;
                  this.igstSelected = false;
                  this.gstAmount = 18;

                  // this.base_price = parseFloat(p_baseprice);
                  // this.cgst_amount = parseFloat(p_baseprice) * (9 / 100);
                  // this.sgst_amount = parseFloat(p_baseprice) * (9 / 100);
                  // this.total_tax = this.cgst_amount + this.sgst_amount;
                  // this.total_amount = this.base_price + this.total_tax;

                  this.base_price = (100/118) * parseFloat(p_baseprice);
                  this.total_amount = parseFloat(p_baseprice);
                  this.cgst_amount = (this.total_amount - this.base_price)/2;
                  this.sgst_amount = (this.total_amount - this.base_price)/2;
                  this.total_tax = this.cgst_amount + this.sgst_amount;

                  break;
                }
                case "GST-28": {
                  console.log("GST-28");
                  this.nonTaxable = false;
                  this.gstSelected = true;
                  this.igstSelected = false;
                  this.gstAmount = 28;

                  // this.base_price = parseFloat(p_baseprice);
                  // this.cgst_amount = parseFloat(p_baseprice) * (14 / 100);
                  // this.sgst_amount = parseFloat(p_baseprice) * (14 / 100);
                  // this.total_tax = this.cgst_amount + this.sgst_amount;
                  // this.total_amount = this.base_price + this.total_tax;

                  this.base_price = (100/128) * parseFloat(p_baseprice);
                  this.total_amount = parseFloat(p_baseprice);
                  this.cgst_amount = (this.total_amount - this.base_price)/2;
                  this.sgst_amount = (this.total_amount - this.base_price)/2;
                  this.total_tax = this.cgst_amount + this.sgst_amount;

                  break;
                }
                case "IGST-0": {
                  console.log("IGST-0");
                  this.nonTaxable = false;
                  this.gstSelected = false;
                  this.igstSelected = true;
                  this.gstAmount = 0;

                  this.base_price = parseFloat(p_baseprice);
                  this.displayigst = parseFloat(p_baseprice) * (0 /100);
                  this.total_tax = parseFloat(p_baseprice) * (0 /100);
                  this.total_amount = this.base_price + this.total_tax;

                  break;
                }
                case "IGST-5": {
                  console.log("IGST-5");
                  this.nonTaxable = false;
                  this.gstSelected = false;
                  this.igstSelected = true;
                  this.gstAmount = 5;

                  // this.base_price = parseFloat(p_baseprice);
                  // this.displayigst = parseFloat(p_baseprice) * (5 /100);
                  // this.total_tax = parseFloat(p_baseprice) * (5 /100);
                  // this.total_amount = this.base_price + this.total_tax;

                  
                  this.base_price = (100/105) * parseFloat(p_baseprice);
                  this.displayigst = this.total_amount - this.base_price;
                  this.total_tax = this.total_amount - this.base_price;
                  this.total_amount = parseFloat(p_baseprice);

                  break;
                }
                case "IGST-12": {
                  console.log("IGST-12");
                  this.nonTaxable = false;
                  this.gstSelected = false;
                  this.igstSelected = true;
                  this.gstAmount = 12;

                  // this.base_price = parseFloat(p_baseprice);
                  // this.displayigst = parseFloat(p_baseprice) * (12 /100);
                  // this.total_tax = parseFloat(p_baseprice) * (12 /100);
                  // this.total_amount = this.base_price + this.total_tax;

                  this.base_price = (100/112) * parseFloat(p_baseprice);
                  this.displayigst = this.total_amount - this.base_price;
                  this.total_tax = this.total_amount - this.base_price;
                  this.total_amount = parseFloat(p_baseprice);

                  break;
                }
                case "IGST-18": {
                  console.log("IGST-18");
                  this.nonTaxable = false;
                  this.gstSelected = false;
                  this.igstSelected = true;
                  this.gstAmount = 18;

                  // this.base_price = parseFloat(p_baseprice);
                  // this.displayigst = parseFloat(p_baseprice) * (18 /100);
                  // this.total_tax = parseFloat(p_baseprice) * (18 /100);
                  // this.total_amount = this.base_price + this.total_tax;

                  this.base_price = (100/118) * parseFloat(p_baseprice);
                  this.displayigst = this.total_amount - this.base_price;
                  this.total_tax = this.total_amount - this.base_price;
                  this.total_amount = parseFloat(p_baseprice);

                  break;
                }
                case "IGST-28": {
                  console.log("IGST-28");
                  this.nonTaxable = false;
                  this.gstSelected = false;
                  this.igstSelected = true;
                  this.gstAmount = 28;

                  // this.base_price = parseFloat(p_baseprice);
                  // this.displayigst = parseFloat(p_baseprice) * (28 /100);
                  // this.total_tax = parseFloat(p_baseprice) * (28 /100);
                  // this.total_amount = this.base_price + this.total_tax;

                  this.base_price = (100/128) * parseFloat(p_baseprice);
                  this.displayigst = this.total_amount - this.base_price;
                  this.total_tax = this.total_amount - this.base_price;
                  this.total_amount = parseFloat(p_baseprice);

                  break;
                }
                default: {
                  console.error("Invalid Price Type");
                  break;
                }
              }
            }
            // Calculate totals if the base price > 0 
            // ~~ End ----------------------------------------------------------------------


            // Calculate totals if the base price <= 0 
            // ~~ Start ----------------------------------------------------------------------
            if(parseInt(p_baseprice) <= 0) {

              this.base_price = 0;
              this.cgst_amount = 0;
              this.sgst_amount = 0;
              this.total_tax = 0;
              this.total_amount = 0;

            }
            // Calculate totals if the base price <= 0 
            // ~~ End ----------------------------------------------------------------------

          }
   }



  // calculate pack price
}
