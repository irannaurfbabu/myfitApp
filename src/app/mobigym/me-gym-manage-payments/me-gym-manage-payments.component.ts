import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';


const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'app-me-gym-manage-payments',
  templateUrl: './me-gym-manage-payments.component.html',
  styleUrls: ['./me-gym-manage-payments.component.scss']
})
export class MeGymManagePaymentsComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'first_name',  label: 'First Name', sortable: true, width: 150 },
    { name: 'last_name', label: 'Last Name', filter: true, sortable: false },
    { name: 'gender', label: 'Gender', hidden: false },
    { name: 'email', label: 'Email', sortable: true, width: 250 },
    { name: 'balance', label: 'Balance', numeric: true, format: DECIMAL_FORMAT },
  ];

  data: any[] = []; // see json data

  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;

  searchBox: any = true;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;

  sortBy: string = 'last_name';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  eventPageSize: IPageChangeEvent;
  pageSize: number = 50;


  constructor(private _dataTableService: TdDataTableService) {}


  ngOnInit() {
    

    this.data =  [
      {
        "balance": 7454.6,
        "email": "sclutterham0@123-reg.co.uk",
        "first_name": "Sully",
        "gender": "Male",
        "img": "https://robohash.org/similiquemodiautem.bmp?size=50x50&set=set1",
        "ip_address": "158.0.165.138",
        "last_name": "Clutterham"
      },
      {
        "balance": 3561.4,
        "email": "mevason1@usatoday.com",
        "first_name": "Mateo",
        "gender": "Male",
        "img": "https://robohash.org/molestiaeadquia.bmp?size=50x50&set=set1",
        "ip_address": "68.147.207.137",
        "last_name": "Evason"
      },
      {
        "balance": 4456.3,
        "email": "lgardener2@wordpress.org",
        "first_name": "Lira",
        "gender": "Female",
        "img": "https://robohash.org/laboredolorumvelit.jpg?size=50x50&set=set1",
        "ip_address": "96.85.6.31",
        "last_name": "Gardener"
      },
      {
        "balance": 5938,
        "email": "edunckley3@instagram.com",
        "first_name": "Edvard",
        "gender": "Male",
        "img": "https://robohash.org/ullamquaedeleniti.png?size=50x50&set=set1",
        "ip_address": "233.189.117.211",
        "last_name": "Dunckley"
      },
      {
        "balance": 4241.6,
        "email": "gsouza4@squidoo.com",
        "first_name": "Gwynne",
        "gender": "Female",
        "img": "https://robohash.org/possimusrepellendusodio.png?size=50x50&set=set1",
        "ip_address": "164.226.80.40",
        "last_name": "Souza"
      },
      {
        "balance": 6558,
        "email": "sfurmedge5@furl.net",
        "first_name": "Sena",
        "gender": "Female",
        "img": "https://robohash.org/iustoillumsit.png?size=50x50&set=set1",
        "ip_address": "192.214.177.38",
        "last_name": "Furmedge"
      },
      {
        "balance": 3159.2,
        "email": "cdykes6@china.com.cn",
        "first_name": "Christian",
        "gender": "Male",
        "img": "https://robohash.org/exveniama.jpg?size=50x50&set=set1",
        "ip_address": "147.35.25.192",
        "last_name": "Dykes"
      },
      {
        "balance": 1471,
        "email": "sklagge7@dell.com",
        "first_name": "Sada",
        "gender": "Female",
        "img": "https://robohash.org/exercitationemtotamenim.jpg?size=50x50&set=set1",
        "ip_address": "143.193.248.153",
        "last_name": "Klagge"
      },
      {
        "balance": 9969.7,
        "email": "glewerenz8@europa.eu",
        "first_name": "Genia",
        "gender": "Female",
        "img": "https://robohash.org/enimdoloremqueut.jpg?size=50x50&set=set1",
        "ip_address": "104.0.250.224",
        "last_name": "Lewerenz"
      },
      {
        "balance": 7253.5,
        "email": "ddemarchi9@taobao.com",
        "first_name": "Daloris",
        "gender": "Female",
        "img": "https://robohash.org/uteaquearchitecto.jpg?size=50x50&set=set1",
        "ip_address": "124.166.67.100",
        "last_name": "De Marchi"
      }
    ];

    this.filter();

  }

  // Local Functions
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  // showAlert(event: any): void {
  //   let row: any = event.row;
  //   // .. do something with event.row
  // }

  filter(): void {
    let newData: any[] = this.data;
    let excludedColumns: string[] = this.columns
    .filter((column: ITdDataTableColumn) => {
      return ((column.filter === undefined && column.hidden === true) ||
              (column.filter !== undefined && column.filter === false));
    }).map((column: ITdDataTableColumn) => {
      return column.name;
    });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  changePageSize(event: IPageChangeEvent): void {
    this.eventPageSize = event;
  }

}
