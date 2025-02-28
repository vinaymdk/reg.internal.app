<template>
    <div class="q-pa-md row items-start">
      <!-- <div class="row q-col-gutter-x-xs q-col-gutter-y-lg"> -->
      <!-- <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12"> -->
        <!-- Start Prohibited Search -->
        <q-card class="my-card-prhbtd">
        <q-card-section class="bg-negative text-white">
          <div class="text-subtitle2 text-center">Prohibited Search</div>
        </q-card-section>

        <q-separator />
        <q-scroll-area :thumb-style="thumbStyle"
               :content-style="contentStyle"
               :content-active-style="contentActiveStyle" style="height:387px">
      <!-- <q-scroll-area> -->
          <q-list>

              <q-item clickable v-ripple v-for="revDev in revDevisions"
                :key="revDev.loc"
                v-bind="revDev" @click="updatePrhbtdList(revDev),titleView='Prohibited', locVal=''">
              <!-- <q-item-section avatar top>
                <q-avatar icon="place" :color="revDev.color" text-color="white" />
              </q-item-section> -->

              <q-item-section>
                <q-item-label lines="1">{{ revDev.loc }}</q-item-label>
              </q-item-section>
            </q-item>
                  
          </q-list>
        </q-scroll-area>
        <q-separator />
          <q-card-section class="bg-info text-white">
          <div class="text-subtitle2 text-center">Decimal Value Conversion</div>
        </q-card-section>
        <q-item-section class="q-pa-md">
            <q-item-label><span class="q-pa-md">0.1 - 08</span> <span class="q-pa-md">0.7 - 58</span></q-item-label>
            <q-item-label><span class="q-pa-md">0.2 - 16</span> <span class="q-pa-md">0.8 - 66</span></q-item-label>
            <q-item-label><span class="q-pa-md">0.3 - 25</span> <span class="q-pa-md">0.9 - 75</span></q-item-label>
            <q-item-label><span class="q-pa-md">0.4 - 33</span> <span class="q-pa-md">0.10 - 83</span></q-item-label>
            <q-item-label><span class="q-pa-md">0.5 - 41</span> <span class="q-pa-md">0.11 - 91</span></q-item-label>
            <q-item-label><span class="q-pa-md">0.6 - 50</span> <span class="q-pa-md">0.12 - 1F</span></q-item-label>
          </q-item-section>

      </q-card>
        <!-- End Prohibited Search -->

        <!-- Start Calculation -->
        <q-card class="my-card">
        <q-card-section class="bg-warning text-white">
          <div class="text-subtitle2 text-center">Dimension Calculation</div>
        </q-card-section>

        <q-separator />
           <q-separator />
            <div class="q-pa-md column">
              <div>
                <q-toggle v-model="calType" checked-icon="check" color="red" @click="changeCalType()" :label="lableTxt" unchecked-icon="clear" />
              </div>

              <q-input type="number" v-model="eastDim" maxlength="6" label="East" @keyup="inchConv(eastDim, southDim, westDim, northDim)" placeholder="Measurment in feets" />
              <q-input type="number" v-model="southDim" label="South" @keyup="inchConv(eastDim, southDim, westDim, northDim)" placeholder="Measurment in feets" />
              <q-input type="number" v-model="westDim" label="West" @keyup="inchConv(eastDim, southDim, westDim, northDim)" placeholder="Measurment in feets" />
              <q-input type="number" v-model="northDim" label="North" @keyup="inchConv(eastDim, southDim, westDim, northDim)" placeholder="Measurment in feets" />
            </div>

            <q-separator />
            <q-card-section class="bg-info text-white">
            <div class="text-subtitle2 text-center">Calculation Result</div>
          </q-card-section>

        <div class="q-pa-md column">
          <!-- need to convert cents to sq yards .... pending .... -->
          <q-input type="number" v-model="totSqYards" label="Square Yards" @keyup="valutionCal(true, false),eastDim='',southDim='',westDim='',northDim=''" placeholder="Total Sq.Yards" />
          <q-input type="number" v-model="totCents" label="Cents" @keyup="valutionCal(false, true),eastDim='',southDim='',westDim='',northDim=''" placeholder="Total cents" />
          <q-input type="number" readonly v-model="totSqMtrs" label="Value in Sq.Meters" />
        </div>

        <!-- <q-card-actions align="right">
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions> -->
      </q-card>
        <!-- End Calculation -->

        <!-- Start Market Valution -->
        <q-card class="my-card">
        <q-card-section class="bg-secondary text-white">
          <div class="text-subtitle2 text-center">Current Market Value</div>
        </q-card-section>

        <q-separator />

        <div class="q-pa-md column">
          <q-select color="secondary" outlined label-color="secondary" v-model="locVal" :options="locOptions" label="Select Location" @click="titlePro=''">
            <template v-slot:append>
            </template>
          </q-select>
          
          <q-separator />

          <!-- <q-select v-if="locVal != ''" color="secondary" outlined label-color="secondary" v-model="typeOfFormVal" :options="formOptions" label="Form type">
            <template v-slot:append>
            </template>
          </q-select> -->
        </div>

        <q-separator />

        <div class="q-pa-md column">
        <!-- need to convert cents to sq yards .... pending .... -->
        <q-input type="number" v-model="mvPerYard" label="M.V. Per Sq.yard" @keyup="valutionCal(false, false)" placeholder="Enter yard value" />
        <q-input type="number" v-model="rccPlinth" label="RCC Plinth Area" @keyup="valutionCal(false, false)" placeholder="Enter in Sq.Feets" />
        <q-input type="number" v-model="accPlinth" label="ACC Plinth Area" @keyup="valutionCal(false, false)" placeholder="Enter in Sq.Feets" />
        <q-input type="number" v-model="hutPlinth" label="Hut Plinth Area" @keyup="valutionCal(false, false)" placeholder="Enter in Sq.Feets" />
        <q-input type="number" v-model="compWallPlinth" label="Compound Wall Plinth Area" @keyup="valutionCal(false, false)" placeholder="Enter in Sq.Feets" />
      </div>

        <q-separator />

      <!-- <q-btn v-if="resSiteVal != ''" flat color="primary" style="width:100%">
          Site Value: Rs.{{ resSiteVal }}/-
        </q-btn>
        <q-btn v-if="resConstPlinthVal != ''" flat color="primary" style="width:100%">
          Const. Value: Rs.{{ resConstPlinthVal }}/-
        </q-btn> -->
        <!-- <q-btn v-if="resDeedVal != ''" flat color="primary" style="width:100%">
          Deed value: Rs.{{ resDeedVal }}/-
        </q-btn> -->
        <div class="q-pa-md column">
          <q-input type="number" v-model="resDeedVal" label="Deed Value" @keyup="challanCal()" placeholder="Custom Deed Value" />
        </div>

      <q-separator v-if="resDeedVal != ''" />
      <div class="q-pa-sm column">
        <q-btn v-if="resDeedVal != ''" label="Challan Details" color="secondary" @click="popChallanInfo = true" style="width:100%" />
      </div>
      <!-- <div class="q-pa-sm column">
        <q-btn label="Partition Cal..." color="primary" @click="partitionDailog = true, partDeedTotVal=0, listItems.length=0, dividedAndSubShares=[], dividedShare=0, partDeedTotVal=0, partDeedSeprtVal=0, sepTotDividedVal=0 " style="width:100%" />
      </div> -->
      <div class="q-pa-sm q-gutter-sm">
        <q-btn label="Partition" color="primary" @click="partitionDailog = true, partDeedTotVal=0, listItems.length=0, dividedAndSubShares=[], dividedShare=0, partDeedTotVal=0, partDeedSeprtVal=0, sepTotDividedVal=0 " />
        <q-btn label="Lease" color="primary" @click="leaseDailog = true" />
      </div>
      <div id='box'></div>
      </q-card>
        <!-- End Market Valution -->
        

      <!-- <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pr-sm"> -->
      <div class="col q-pr-sm">
        <q-card class="my-card-view">
        <q-card-section class="bg-info text-white">
          <div class="text-h6 text-center" v-if="locVal == '' && titleView != ''"> {{ viewPdfInfo.loc }} {{ titleView  }} List</div>
          <div class="text-h6 text-center" v-if="locVal != ''"> {{ locVal['value'] }} Location Market Valuation</div>
        </q-card-section>

        <q-card-section>
          <!-- <embed src="http://infolab.stanford.edu/pub/papers/google.pdf" frameBorder="0" scrolling="auto" height="550px" width="100%" /> -->
          <embed v-if="locVal == ''" :src="viewPdfInfo.url" frameBorder="0" scrolling="auto" height="550px" width="100%" />
          <embed v-if="locVal != ''" :src="locVal.url" frameBorder="0" scrolling="auto" height="550px" width="100%" />
        </q-card-section>

      </q-card>
      </div>

      <!-- Start General Challan Dailogs -->
        <q-dialog v-model="popChallanInfo" persistent>
        <q-card class="my-dailog">
          <q-card-section>
            <div class="text-h5 cls-primary">
          <b>Deed Value: Rs.{{ resDeedVal }}/</b>
          </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-none">
            <div class="text-h6 cls-primary">Sale Deed: </div>
              <div class="text-subtitle1">
                Deficit Stamp Duty: <span class="bold-class">Rs.{{ (6.5 / 100) * resDeedVal }}/- (6.5%)</span>
            </div>
            <div class="text-subtitle1">
                Registration Fee: <span class="bold-class">Rs.{{ (1 / 100) * resDeedVal }}/-  (1%)</span>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-none">
            <div class="text-h6 cls-primary">Gift Deed In favour of family member: </div>
              <div class="text-subtitle1">
                Deficit Stamp Duty: <span class="bold-class">Rs.{{ (2 / 100) * resDeedVal }}/- (2%)</span>
            </div>
            <div class="text-subtitle1">
                Registration Fee: <span class="bold-class">Rs.{{ giftRegFee }}/- (0.5%)</span>
            </div>
        </q-card-section>

        <q-separator />

          <q-card-section class="q-pt-none">
            <div class="text-h6 cls-primary">Gift Deed In favour of others: </div>
              <div class="text-subtitle1">
                Deficit Stamp Duty: <span class="bold-class">Rs.{{ (3 / 100) * resDeedVal }}/- (3%)</span>
            </div>
            <div class="text-subtitle1">
                Registration Fee:  <span class="bold-class">Rs.{{ giftRegFee }}/- (0.5%)</span>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" label="OK" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End General Challan Dailogs -->
      <!-- Start Partition Dailogs -->
      <q-dialog v-model="partitionDailog" style="width:850px" persistent>
        <q-card style="width:650px">
          <q-card-section>
            <div class="text-h6">Partition Calculation</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 60vh" class="scroll">
            <!-- <p v-for="n in 15" :key="n">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p> -->
            <div class="row no-wrap q-gutter-md">
            <q-btn label="Add Schedule" color="primary" @click="addSchedule" />
            <q-btn label="Remove Shedule" color="accent" @click="removeSchedule" :disable="listItems.length === 0" />
        </div>

        <div class="row">
          <div class="col-3">
            <div class="q-pa-md" v-mutation="handler">
              <q-input type="number" v-for="(item, index) in listItems" :key="item" :id="`item-${index}`" :label="item.shedule" @keyup="calPartTotalDeedVal(item.modelName, index), item.val = item.modelName" v-model="item.modelName" placeholder="Enter Value" />
              

            </div>
              <q-separator />
            <div>

                <q-input type="text" label="Total DSD" v-model="partTotalDSD" disable />
                <q-input type="text" label="Total Reg Fee" v-model="partTotalFee" disable  />
            </div>
          </div>

          <div class="col-9">
            <div v-if="listItems.length > 0" class="q-pa-md">
            <!-- <q-card flat class="q-mt-md overflow-auto"> -->
              <q-table :title="tblHead" :rows="rows" :columns="columns" row-key="name" :pagination="initialPagination"/>

              <!-- <b><u>Total Deed Value: Rs.{{ partDeedTotVal }}/-</u></b>
              <q-separator />
              <p>-> Divided Share: Rs.{{ dividedShare }}/-</p>
              <p v-for="(share) in dividedAndSubShares" :key="share">-> Subtracted Value of {{ share.shedule }}: Rs.{{ (dividedShare - share.val) }}/-</p>
              <p>-> General DSD: <b>Rs.{{ (1 / 100) * partDeedSeprtVal }}/- (1% on Rs.{{ partDeedSeprtVal }}/-)</b></p>
              <p>-> DSD on Seperated Value: <b>Rs.{{ (3 / 100) * sepTotDividedVal }}/- (3% on Rs.{{ sepTotDividedVal }}/-)</b></p>
              <p>-> General Reg. Fee: <b>Rs.1000/-</b></p>
              <p>-> Reg. Fee on Seperated Value: <b>Rs.{{ (0.5 / 100) * sepTotDividedVal }}/- (0.5% on Rs.{{ sepTotDividedVal }}/-)</b></p> -->
            </div>
          </div>
        </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <!-- <q-btn flat label="Decline" color="primary" v-close-popup /> -->
            <!-- <q-btn flat label="Ok" color="green" v-close-popup /> -->
            <!-- <q-btn style="background: goldenrod; color: white" label="Goldenrod" /> -->
            <q-btn flat label="Ok" style="background: #31CCEC; color: white" v-close-popup />
          </q-card-actions>
        </q-card>
    </q-dialog>
      <!-- End Partition Dailogs -->
      <!-- Start Lease Dailogs -->
      <q-dialog v-model="leaseDailog" style="width:850px" persistent>
        <q-card style="width:650px">
          <q-card-section>
            <div class="text-h6">Lease Calculation</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 60vh" class="scroll">
            <!-- <p v-for="n in 15" :key="n">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p> -->
            <!-- <div class="row no-wrap q-gutter-md">
              <q-btn label="Add Schedule" color="primary" @click="addSchedule" />
              <q-btn label="Remove Shedule" color="accent" @click="removeSchedule" :disable="listItems.length === 0" />
          </div> -->

        <div class="row">
          <div class="col-12">
            <span class="text-subtitle2">Property Type</span>
            <div class="q-gutter-md">
                <q-radio v-model="property" val="Residential" label="Residential" />
                <q-radio v-model="property" val="Commercial" label="Commercial" />
                <div v-if="property">
                  <q-checkbox v-model="monthlyRent" keep-color label="Monthly Rent" color="teal" />
                  <q-checkbox v-if="monthlyRent" keep-color v-model="lesseeTax" label="Lessee Tax" color="orange" />
                  <q-checkbox v-model="improvments" keep-color label="Improvments" color="red" />
                </div>
            </div>
            <span v-if="property" class="text-subtitle2">Advance Type</span>
            <div v-if="property" class="q-gutter-md">
              <q-radio v-model="advanceType" val="Refundable" label="Refundable" />
              <q-radio v-model="advanceType" val="Non-Refundable" label="Non-Refundable" />
            </div>
          </div>
        </div>
        <div class="row">
            <div class="col-5">
              <div class="q-gutter-md">
                <div v-if="property">
                  <!-- <q-select v-model="lesseeTaxType" :options="options" label="Standard" /> -->
                  <q-input type="number" label="Lease period in years" v-model="leaseTime" />
                  <q-input v-if="lesseeTax && monthlyRent" type="number" label="Tax amount paiying by the lessee" v-model="lesseeTaxAmt" />
                  <!-- <q-input type="number" label="Tax amount paiying by the lessee" v-model="lesseeTaxAmt" /> -->
                  <q-input type="number" label="Advance" v-model="advncePay" />
                </div>
            </div>
          </div>
          <div class="col-1"></div>
          <div class="col-5">
              <div class="q-gutter-md">
                <div v-if="property">
                  <q-input type="text" label="Total DSD" v-model="leaseTotalDSD" disable />
                  <q-input type="text" label="Total Reg Fee" v-model="leaseTotalFee" disable  />
                </div>
            </div>
          </div>
        </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Ok" style="background: #31CCEC; color: white" v-close-popup />
          </q-card-actions>
        </q-card>
    </q-dialog>
      <!-- End Lease Dailogs -->
  </div>
</template>

<script>
import { ref } from 'vue'
// import { test } from 'getmac'

// function showMacAddress() {
//     var obj = new ActiveXObject("WbemScripting.SWbemLocator");
//     var s = obj.ConnectServer(".");
//     var properties = s.ExecQuery("SELECT * FROM Win32_NetworkAdapterConfiguration");
//     var e = new Enumerator(properties);
//     var output;
//     output = '<table border="0" cellPadding="5px" cellSpacing="1px" bgColor="#CCCCCC">';
//     output = output + '<tr bgColor="#EAEAEA"><td>Caption</td><td>MACAddress</td></tr>';
//     while (!e.atEnd()) {
//         e.moveNext();
//         var p = e.item();
//         if (!p) continue;
//         output = output + '<tr bgColor="#FFFFFF">';
//         output = output + '<td>' + p.Caption; +'</td>';
//         output = output + '<td>' + p.MACAddress + '</td>';
//         output = output + '</tr>';
//     }
//     output = output + '</table>';
//     document.getElementById("box").innerHTML = output;
// }

// showMacAddress();

// const getmac = require('getmac')
// debugger
// callMac()
// const callMac = () =>{
//     // return getmac.default()
//     console.log(getmac.default())
// }

// function domToObj (domEl, whitelist) {
//   const obj = {}
//   for (let i = 0; i < whitelist.length; i++) {
//     if (domEl[ whitelist[ i ] ] instanceof NodeList) {
//       obj[ whitelist[ i ] ] = Array.from(domEl[ whitelist[ i ] ])
//     }
//     else {
//       obj[ whitelist[ i ] ] = domEl[ whitelist[ i ] ]
//     }
//   }
//   return obj
// }
// const whitelist = ['id', 'type', 'addedNodes', 'removedNodes', 'attributeName', 'attributeNamespace', 'nextSibling', 'oldValue', 'previousSibling', 'target', 'tagName', 'className', 'childNodes'];

export default {
  setup () {
    const listItems = ref([])
    const mutationInfo = ref('')
    return {
      eastDim: ref(''),
      southDim: ref(''),
      westDim: ref(''),
      northDim: ref(''),
      resDeedVal: ref(''),
      resSiteVal: ref(''),
      giftRegFee: ref(''),
      resConstPlinthVal: ref(''),
      locVal: ref(''),
      totCents: ref(''),
      totSqYards: ref(''),
      totSqMtrs: ref(''),
      mvPerYard: ref(''),
      rccPlinth: ref(''),
      accPlinth: ref(''),
      hutPlinth: ref(''),
      compWallPlinth: ref(''),
      curDeedVal: ref(''),
      noOfBenfs: ref(''),
      tblHead: ref(''),
      columns: [ 
      { name: 'title', required: true, label: 'Title', align: 'left', field: row => row.title, format: val => `${val}` },
      { name: 'amt', required: true, label: 'Amount', align: 'left', field: row => row.amt, format: val => `${val}` }],
    rows: [],
    // initialPagination: {
   //      sortBy: 'desc',
   //      descending: false,
   //      page: 5,
   //      rowsPerPage:8
   //      // rowsNumber: xx if getting data from a server
   //    },
      partDeedTotVal: ref(0),
      partDeedTotValDividNoOfSchedules: ref(0),
      dividedShare: ref(0),
      partDeedSeprtVal: ref(0),
      sepTotDividedVal: ref(0),
      dividedAndSubShares: [],
      greaterSchedVal: [],
      gnrlChallanDSD: ref(0),
      partTotalDSD: ref(0),
      partTotalFee: ref(0),
      partDeedTotValHedTxt: ref(''),
      mutationInfo,
      listItems,
      titleView: ref('Prohibited'),
      lableTxt: ref('Feets Conversion'),
      calType: ref(true),
      popChallanInfo: ref(false),
      partitionDailog: ref(false),
      leaseDailog: ref(false),
      property: ref(false),
      monthlyRent: ref(false),
      leaseTime: ref(0),
      advncePay: ref(0),
      lesseeTax: ref(false),
      lesseeTaxAmt: ref(0),
      advanceType: ref(false),
      improvments: ref(false),
      leaseTotalDSD: ref(0),
      leaseTotalFee: ref(0),
      // options: ['Property Tax', 'GST', 'Others'],
      viewPdfInfo: ref({ loc: "CHIRALA", color: "orange", url: '/prohibited-list/CHIRALA.pdf' }),
      // exesList: ref({ modelName: "exe_1", val: '' }),
      source1: 'https://www.africau.edu/images/default/sample.pdf',
      source2: 'data:application/pdf;base64,<BASE64_ENCODED_PDF>',
   //    provide: {
    //     PdfViewer: [Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner]
    // },
    changeCalType () {
      this.eastDim = "";
      this.southDim = "";
      this.westDim = "";
      this.northDim  = "";
      this.lableTxt = this.calType ? 'Feets Conversion' : 'Links Conversion';
    },
      locOptions: [
        { label: 'AKKAYAPALEM', value: 'AKKAYAPALEM', url: '/market-val/akkayapalem-2.pdf' },
        { label: 'CHALLAREDDYPALLEM', value: 'CHALLAREDDYPALLEM', url: '/market-val/challareddypalem-7.pdf'},
        { label: 'CHIRALA NAGAR', value: 'CHIRALA NAGAR', url: '/market-val/chiralanagar-4.pdf'},
        { label: 'CHIRALA / PERALA (RURAL)', value: 'CHIRALA / PERALA (RURAL)', url: '/market-val/chirala-perala.pdf'},
        { label: 'DESAIPETA', value: 'DESAIPETA', url: '/market-val/desaipeta-5.pdf'},
        { label: 'DEVANGAPURI', value: 'DEVANGAPURI', url: '/market-val/devangapuri-1.pdf'},
        { label: 'EPURU PALEM', value: 'EPURUPALEM', url: '/market-val/epurupalem-7.pdf'},
        { label: 'EPURU PALEM / WADA / ETC.', value: 'EPURUPALEM / WADA / ETC.', url: '/market-val/eprplm-wada-etc.grmkntm-7.pdf'},
        { label: 'GANDHINAGAR', value: 'GANDHINAGAR', url: '/market-val/gandhinagar-6.pdf'},
        { label: 'KADAVAKUDURU', value: 'KADAVAKUDURU', url: '/market-val/kadavakuduru-1.pdf'},
        { label: 'KARAMCHEDU', value: 'KARAMCHEDU', url: '/market-val/karamchedu-1.pdf'},
        { label: 'KOTHAPALEM', value: 'KOTHAPALEM', url: '/market-val/kothapalem-5.pdf'},
        { label: 'KOTHAPETA', value: 'KOTHAPETA', url: '/market-val/kothapeta-1.pdf'},
        { label: 'KUNKALAMARRU', value: 'KUNKALAMARRU', url: '/market-val/kunkalamarru-2.pdf'},
        { label: 'MOTUPALLI', value: 'MOTUPALLI', url: '/market-val/motupalli-2.pdf'},
        { label: 'PANDILLA PALLI', value: 'PANDILLAPALLI', url: '/market-val/pandillapalli-9.pdf'},
        { label: 'PAPAYAPALEM', value: 'PAPAYAPALEM', url: '/market-val/papayapalem-3.pdf'},
        { label: 'PULLARI PALEM', value: 'PULLARIPALEM', url: '/market-val/pullaripalem-8.pdf'},
        { label: 'RAMAKRISHNAPURAM', value: 'RAMAKRISHNAPURAM', url: '/market-val/ramakrishnapuram-2.pdf'},
        { label: 'RAMMANNAPETA', value: 'RAMMANNAPETA', url: '/market-val/ramannapeta-6.pdf'},
        { label: 'SANTHARAVURU', value: 'SANTHARAVURU', url: '/market-val/santharavuru-3.pdf'},
        { label: 'SOLMANCENTER', value: 'SOLMANCENTER', url: '/market-val/salmoncenter-3.pdf'},
        { label: 'SWARNA', value: 'SWARNA', url: '/market-val/swarna-3.pdf'},
        { label: 'SWARNAPALEM', value: 'SWARNAPALEM', url: '/market-val/swarnapelem-4.pdf'},
        { label: 'VETAPALEM', value: 'VETAPALEM', url: '/market-val/vetapalem-4.pdf'},
        { label: 'URBUN VILLAGES', value: 'URBUNVILLAGES', url: '/market-val/urbun-gramas.pdf'},
        { label: 'Form - 1', value: 'Form-1', url: '/market-val/FORM-1.pdf'},
        { label: 'Form - 2', value: 'Form-2', url: '/market-val/FORM-2.pdf'},
        { label: 'Form - 3', value: 'Form-3', url: '/market-val/FORM-3.pdf'},
        { label: 'Form - 4', value: 'Form-4', url: '/market-val/FORM-4.pdf' }
      ],
      formOptions: ['Form - 1', 'Form - 2', 'Form - 3', 'Form - 4'],
      revDevisions: [
        { loc: "CHIRALA URBAN", color: "primary", url: '/prohibited-list/CHIRALA-URBAN.pdf' },
        { loc: "CHIRALA", color: "orange", url: '/prohibited-list/CHIRALA.pdf' },
        { loc: "DEVANGAPURI URBAN", color: "orange", url: '/prohibited-list/DEVANGAPURI-URBAN.pdf' },
        { loc: "EPURUPALEM", color: "primary", url: '/prohibited-list/EPURUPALEM.pdf' },
        { loc: "KADAVAKUDURU", color: "orange", url: '/prohibited-list/KADAVAKUDURU.pdf' },
        { loc: "KARAMCHEDU", color: "primary", url: '/prohibited-list/KARAMCHEDU.pdf' },
        { loc: "KOTHAPETA URBAN", color: "orange", url: '/prohibited-list/KOTHAPETA-URBAN.pdf' },
        { loc: "KOTHAPETA", color: "primary", url: '/prohibited-list/KOTHAPETA.pdf' },
        { loc: "KUNKALAMARRU URBAN", color: "orange", url: '/prohibited-list/KUNKALAMARRU-URBAN.pdf' },
        { loc: "KUNKALAMARRU", color: "primary", url: '/prohibited-list/KUNKALAMARRU.pdf' },
        { loc: "MOTUPALLI", color: "orange", url: '/prohibited-list/MOTUPALLI.pdf' },
        { loc: "NAYANIPALLI", color: "primary", url: '/prohibited-list/NAYANIPALLI.pdf' },
        { loc: "PANDILLAPALLI", color: "orange", url: '/prohibited-list/PANDILLAPALLI.pdf' },
        { loc: "PANDILLAPALLI URBAN", color: "orange", url: '/prohibited-list/PANDILLAPALLI-URBAN.pdf' },
        { loc: "LP No.PANDILLAPALLI", color: "orange", url: '/prohibited-list/LP-NO-PANDILLAPALLI.pdf' },
        { loc: "PERALA URBAN", color: "primary", url: '/prohibited-list/PERALA-URBAN.pdf' },
        { loc: "PERALA", color: "orange", url: '/prohibited-list/PERALA.pdf' },
        { loc: "PULLARIPALEM", color: "primary", url: '/prohibited-list/PULLARIPALEM.pdf' },
        { loc: "SANTHARAVURU", color: "orange", url: '/prohibited-list/SANTHARAVURU.pdf' },
        { loc: "SWARNA", color: "primary", url: '/prohibited-list/SWARNA.pdf' },
        { loc: "VETAPALEM URBAN", color: "orange", url: '/prohibited-list/VETAPALEM-URBAN.pdf' },
        { loc: "VETAPALEM", color: "primary", url: '/prohibited-list/VETAPALEM.pdf' },
        { loc: "WADA", color: "primary", url: '/prohibited-list/WADA.pdf' }
      ],
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },
      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: '0.75'
      },
      updatePrhbtdList(revDev) {
        this.viewPdfInfo = revDev;
      },
    inchConv(eastVal, southVal, westVal, northVal) {  // Dimentsion calculation function start
      var phaseOne = 0;
    var phaseTwo = 0;
    var sqFeets = 0;
    var sqYards = 0;
      // const replaceVal = { '0': '00', '00': '00', '1': '8', '2': '16', '3': '25', '4': '33', '5': '41', '6': '50', '7': '58', '8': '66', '9': '75', '10': '83', '11': '91' };
      // const changedVal = curVal.split('.').length > 1 ? (curVal.split('.')[0]) + '.' + replaceVal[curVal.split('.')[1]] : curVal + '.00';
      // this.$emit(modelBind, changedVal);
      // return changedVal;
      // const test = modelBinds

      eastVal = eastVal == '' ? 0 : parseFloat(eastVal);
      southVal = southVal == '' ? 0 : parseFloat(southVal);
      westVal = westVal == '' ? 0 : parseFloat(westVal);
      northVal = northVal == '' ? 0 : parseFloat(northVal);
      if (!this.calType) {
        eastVal = (eastVal * 0.66);
        southVal = (southVal * 0.66);
        westVal = (westVal * 0.66);
        northVal = (northVal * 0.66);
      }

      if (((eastVal != 0 && westVal != 0) && (southVal != 0 && northVal != 0)) ) {
        phaseOne = eastVal + westVal;
        phaseOne = phaseOne / 2;

        phaseTwo = (southVal + northVal);
        phaseTwo = (phaseTwo / 2);
      } else if (eastVal != 0 && westVal != 0 && southVal != 0 && northVal == 0) {
        phaseOne = eastVal + westVal;
        phaseOne = phaseOne / 2;

        phaseTwo = (southVal + northVal);
        phaseTwo = (phaseTwo / 2);
      } else if (eastVal != 0 && westVal != 0 && southVal == 0 && northVal != 0) {
        phaseOne = eastVal + westVal;
        phaseOne = phaseOne / 2;

        phaseTwo = (southVal + northVal);
        phaseTwo = (phaseTwo / 2);
      } else if (eastVal != 0 && westVal == 0 && southVal != 0 && northVal != 0) {
        phaseOne = eastVal + westVal;
        phaseOne = phaseOne / 2;

        phaseTwo = (southVal + northVal);
        phaseTwo = (phaseTwo / 2);
      } else if (eastVal == 0 && westVal != 0 && southVal != 0 && northVal != 0) {
        phaseOne = eastVal + westVal;
        phaseOne = phaseOne / 2;

        phaseTwo = (southVal + northVal);
        phaseTwo = (phaseTwo / 2);
      } else if (eastVal == 0 && westVal != 0 && southVal != 0 && northVal == 0) {
        phaseOne = westVal;

        phaseTwo = southVal;
      } else if (eastVal != 0 && westVal == 0 && southVal == 0 && northVal != 0) {
        phaseOne = eastVal;

        phaseTwo = northVal;
      } else if (eastVal != 0 && westVal == 0 && southVal != 0 && northVal == 0) {
        phaseOne = eastVal;

        phaseTwo = southVal;
      } else if (eastVal == 0 && westVal != 0 && southVal == 0 && northVal != 0) {
        phaseOne = westVal;

        phaseTwo = northVal;
      }

      sqFeets = (phaseOne * phaseTwo);

      sqYards = (sqFeets / 9);
      this.totSqYards = sqYards;
      this.totCents = (sqYards / 48.4);
      this.totSqMtrs = (this.totSqYards * 0.836);
      // this.resDimension = sqYards;
    }, // Dimentsion calculation function end.
    valutionCal (yards, cents) { // Market Value Calculation function start
      var totRccPlinth = this.rccPlinth == '' ? 0 : (parseFloat(this.rccPlinth) * 1200);
      var totAccPlinth = this.accPlinth == '' ? 0 : (parseFloat(this.accPlinth) * 650);
      var totHutPlinth = this.hutPlinth == '' ? 0 : (parseFloat(this.hutPlinth) * 160);
      var totCompWallPlinth = this.compWallPlinth == '' ? 0 : (parseFloat(this.compWallPlinth) * 100);
      var totalCents = this.totCents == '' ? 0 : parseFloat(this.totCents);
      var totalSqYards = this.totSqYards == '' ? 0 : parseFloat(this.totSqYards);
      var marketValPerYard = this.mvPerYard == '' ? 0 : this.mvPerYard;
      var totConstPlinthArea = (totRccPlinth + totAccPlinth + totHutPlinth + totCompWallPlinth);
      var resGiftRegFee = 0;

      if (yards) {
        this.totCents = (totalSqYards / 48.4);
        this.totSqMtrs = (totalSqYards * 0.836);
      } else if (cents) {
        this.totSqYards = (totalCents * 48.4);
        this.totSqMtrs = (this.totSqYards * 0.836);
      } else {
        this.totCents = totalCents;
        this.totSqYards = totalSqYards;
        this.totSqMtrs = (totalSqYards * 0.836);
      }

      this.resConstPlinthVal = totConstPlinthArea;
      this.resSiteVal = (totalSqYards * marketValPerYard);
      this.resDeedVal = (this.resSiteVal + this.resConstPlinthVal);
      resGiftRegFee = (0.5 / 100) * this.resDeedVal;
      this.giftRegFee = resGiftRegFee < 1000 ? 1000 : resGiftRegFee;

    }, // Market Value Calculation function end
    resTitleView(locVal) {
      this.titleView = locVal.value + ' Location Market Valution';
    }, // Challan Calculation Function
    challanCal () {
      var resGiftRegFee = 0;

      resGiftRegFee = (0.5 / 100) * this.resDeedVal;
      if (resGiftRegFee < 1000) {
        this.giftRegFee = 1000;
      } else if (resGiftRegFee > 10000) {
        this.giftRegFee = 10000;
      } else {
        this.giftRegFee = resGiftRegFee;
      }
    }, // Partition calculation
    handler (mutationRecords) {
        const info = []

        for (const index in mutationRecords) {
          const record = mutationRecords[ index ];
          console.log(record);
        }

        mutationInfo.value = info.join('\n')
      },
    addSchedule () {
        const shedule = { 0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z' };

        listItems.value.push({ modelName: 'exe_' + (listItems.value.length + 1), shedule: shedule[listItems.value.length] + ' - Schedule', exe_no: listItems.value.length + 1 });
      },
      removeSchedule () {
        listItems.value.pop();
      },
      calPartTotalDeedVal (val, index) {
        console.log(index + ' Value is: ' + val)
        var totVal = 0;
        var allVal = [];
        // var genChallanVal = 0;
        var tempAllSchedVal = [];
        // var greaterSchedVal = [];
        listItems.value[index].val = val;

        this.dividedAndSubShares = [];
        this.greaterSchedVal = [];
        this.dividedShare = 0;
        this.partDeedTotVal = 0;
        this.partDeedSeprtVal = 0;
        this.sepTotDividedVal = 0;

        for (var item = 0; item < listItems.value.length; item++) {
          if (parseFloat(listItems.value[item].val)) {
            totVal = (parseFloat(totVal) + parseFloat(listItems.value[item].val));
            allVal.push(parseFloat(listItems.value[item].val));
            tempAllSchedVal.push({shedule: listItems.value[item].shedule, val: parseFloat(listItems.value[item].val)});
          }
        }
        // this.partDeedTotVal = totVal.toLocaleString('hi-IN');
        this.partDeedTotVal = parseFloat(totVal);
        // Divide Share Value
        // this.dividedShare = (totVal / allVal.length).toLocaleString('hi-IN');
        this.dividedShare = parseFloat(totVal / allVal.length);

        if (allVal.length > 1) {
          var tempGreatVal = false;
          for (var i = 0; i < tempAllSchedVal.length; i++) {

            if ((tempAllSchedVal[i].val != Math.max.apply(null, allVal)) || tempGreatVal ) {
              this.partDeedSeprtVal += parseFloat(tempAllSchedVal[i].val);
              this.generalDSD = (1 / 100) * parseFloat(this.partDeedSeprtVal);
              this.dividedAndSubShares.push({shedule: tempAllSchedVal[i].shedule, val: parseFloat(tempAllSchedVal[i].val)});

            } else if (allVal[i] == Math.max.apply(null, allVal)) {
              tempGreatVal = true;
              this.greaterSchedVal = [{schedule: tempAllSchedVal[i].schedule, val: parseFloat(tempAllSchedVal[i].val)}];
            }
          }

          for (var share = 0; share < this.dividedAndSubShares.length; share++) {
            if (parseFloat(this.dividedAndSubShares[share].val) < parseFloat(this.dividedShare)) {
              this.sepTotDividedVal += parseFloat(this.dividedShare) - parseFloat(this.dividedAndSubShares[share].val);
            }
          }
        }
      this.tblHead = "Total Deed Value: Rs." + (this.partDeedTotVal).toLocaleString('hi-IN') + "/-";

    this.rows = [
        { title: 'Divided Share' , amt: 'Rs.' + (this.dividedShare).toLocaleString('hi-IN') + '/-' }
    ];
    // for (var shedule = 0; shedule < this.dividedAndSubShares.length; shedule++) {
    //  this.rows.push({ title: 'Subtracted ' + this.dividedAndSubShares[shedule].shedule , amt: 'Rs.' + (this.dividedAndSubShares[shedule].val).toLocaleString('hi-IN') + '/-' },)
    // }
    var dsdOne = ((1 / 100) * this.partDeedSeprtVal).toLocaleString('hi-IN');
    var dsdThree = ((3 / 100) * this.sepTotDividedVal).toLocaleString('hi-IN');
    // var regFee = (1000 + (0.5 / 100) * this.sepTotDividedVal).toLocaleString('hi-IN');

    this.rows.push({ title: 'General DSD (1% on Rs.' + (this.partDeedSeprtVal).toLocaleString('hi-IN') + '/-)' , amt: 'Rs.' + dsdOne + '/-' });
    this.rows.push({ title: 'DSD on (3% on Rs.' + (this.sepTotDividedVal).toLocaleString('hi-IN') + '/-)' , amt: 'Rs.' + dsdThree + '/-' });
    this.rows.push({ title: 'General Reg. Fee' , amt: 'Rs.1,000/-' });

    if (((0.5 / 100) * this.sepTotDividedVal) < 1000) {
        // this.partTotalFee = 1000;
      this.rows.push({ title: 'Reg. Fee(Minimum', amt: 'Rs.1,000/-' });
      this.partTotalFee = '2,000';
      } else if (((0.5 / 100) * this.sepTotDividedVal) > 10000) {
      this.rows.push({ title: 'Reg. Fee(Maximum' , amt: 'Rs.10,000/-' });
      this.partTotalFee = '11,000';
      } else {
      this.partTotalFee = (1000 + (0.5 / 100) * this.sepTotDividedVal).toLocaleString('hi-IN');
      this.rows.push({ title: 'Reg. Fee(0.5% on Rs.' + (this.sepTotDividedVal).toLocaleString('hi-IN') + '/-)' , amt: 'Rs.' + ((0.5 / 100) * this.sepTotDividedVal).toLocaleString('hi-IN') + '/-' });
      }

    this.partTotalDSD = (((1 / 100) * this.partDeedSeprtVal) + ((3 / 100) * this.sepTotDividedVal)).toLocaleString('hi-IN');
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 200px
  margin: 5px
  height:650px

.my-card-prhbtd
  width: 100%
  max-width: 200px
  margin: 5px

.my-card-view
  width: 100%
  min-height: 580px
  margin: 5px
 
.my-dailog
  width: 500px
  margin: 5px

.bold-class
  font-weight: 600
  color: #26A69A

.cls-primary
  color: #1976d2

</style>
