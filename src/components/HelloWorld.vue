<template>
  <div class="hello">
    <textarea id="code-editor" ></textarea>
    <h3>
      <b-button variant="primary">添加路线可视化</b-button>
      <tencent-map @ready="onMapReady" ref="tmap" class="map-view" ak=""/>
    </h3>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank"
             rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank"
             rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a>
      </li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
import {TencentMap} from "ppos-vue-tencent-map/src/components";
// import {decode} from '../utils/PolylineDecoder'
import dedent from 'dedent'
import CodeMirror from "codemirror"
import 'codemirror/lib/codemirror.css';

export default {
  name: 'HelloWorld',
  components: {
    TencentMap
  },
  props: {
    msg: String
  },
  data() {
    return {
      code: dedent`
          An h1 header
          ============

          Paragraphs are separated by a blank line.`,
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        line: true,
        mode: 'text/x-markdown',
        theme: 'lesser-dark'
      },
      mapIsReady: false,
      map: undefined,
      TMap: undefined,
      polylines: undefined,
      labels: undefined,
      markers: undefined,
      places: []
    }
  },
  methods: {
    onMapReady({TMap, map}) {
      this.mapIsReady = true;
      this.map = map;
      this.TMap = TMap;
      this.polylines = new TMap.MultiPolyline({
        id: 'polyline-layer', //图层唯一标识
        map,//设置折线图层显示到哪个地图实例中
        styles: {
          'style_blue': new TMap.PolylineStyle({
            'color': '#3777FF', //线填充色
            'width': 6, //折线宽度
            'borderWidth': 5, //边线宽度
            'borderColor': '#FFF', //边线颜色
            'lineCap': 'butt' //线端头方式
          })
        }, //折线样式定义
        geometries: [] //折线数据定义
      });
      this.labels = new TMap.MultiLabel({
        id: 'label-layer',
        map: map,
        styles: {
          label: new TMap.LabelStyle({
            color: '#3777FF', // 颜色属性
            size: 20, // 文字大小属性
            offset: {x: 0, y: 0}, // 文字偏移属性单位为像素
            angle: 0, // 文字旋转属性
            alignment: 'center', // 文字水平对齐属性
            verticalAlignment: 'middle', // 文字垂直对齐属性
          }),
        },
        geometries: []
      });
      // this.places = [
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201810557",
      //       "title": "佟庄艺园宾馆 停车场",
      //       "position": {
      //         "lat": 39.674573,
      //         "lng": 116.628836
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "大兴区",
      //         "city": "北京市",
      //         "street": "长子营镇佟庄8号"
      //       },
      //       "formattedAddress": "大兴区 北京市 长子营镇佟庄8号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.674573,
      //             "lng": 116.628836
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 139 1058 6500"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 4814.321295697182
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201813044",
      //       "title": "联东U谷·北京长子营科技园 停车场",
      //       "position": {
      //         "lat": 39.698855,
      //         "lng": 116.588485
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "大兴区",
      //         "city": "北京市",
      //         "street": "长恒路20号"
      //       },
      //       "formattedAddress": "大兴区 北京市 长恒路20号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.698855,
      //             "lng": 116.588485
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 9084.459007092188
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201811363",
      //       "title": "联东U谷永乐产业园 停车场",
      //       "position": {
      //         "lat": 39.617812,
      //         "lng": 116.788116
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "通州区",
      //         "city": "北京市",
      //         "street": "通州區"
      //       },
      //       "formattedAddress": "通州区 北京市 通州區",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.617812,
      //             "lng": 116.788116
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 10225.628835402396
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816181",
      //       "title": "天津居然之家武清店 停车场",
      //       "position": {
      //         "lat": 39.368685,
      //         "lng": 117.031465
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "武清区",
      //         "city": "天津市",
      //         "street": "前进道"
      //       },
      //       "formattedAddress": "武清区 天津市 前进道",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.368685,
      //             "lng": 117.031465
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 44094.16930800465
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816176",
      //       "title": "天津武清人民医院中医院区 停车场",
      //       "position": {
      //         "lat": 39.380768,
      //         "lng": 117.053179
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "武清区",
      //         "city": "天津市",
      //         "street": "雍阳西道北侧98号"
      //       },
      //       "formattedAddress": "武清区 天津市 雍阳西道北侧98号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.380768,
      //             "lng": 117.053179
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "1.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 44432.42550079586
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815355",
      //       "title": "天津友谊武清商厦 停车场",
      //       "position": {
      //         "lat": 39.370561,
      //         "lng": 117.06888
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "武清区",
      //         "city": "天津市",
      //         "street": "京津公路"
      //       },
      //       "formattedAddress": "武清区 天津市 京津公路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.370561,
      //             "lng": 117.06888
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 46189.98758956316
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815526",
      //       "title": "联东U谷天津北辰产业园区 停车场",
      //       "position": {
      //         "lat": 39.215243,
      //         "lng": 117.037816
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "北辰区",
      //         "city": "天津市",
      //         "street": "京福公路"
      //       },
      //       "formattedAddress": "北辰区 天津市 京福公路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.215243,
      //             "lng": 117.037816
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 58072.18226943837
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815346",
      //       "title": "天津杨柳青庄园 停车场",
      //       "position": {
      //         "lat": 39.156523,
      //         "lng": 116.979997
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "津同公路20号"
      //       },
      //       "formattedAddress": "西青区 天津市 津同公路20号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.156523,
      //             "lng": 116.979997
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "10.00 元 / 次",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 61490.86588936378
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815918",
      //       "title": "天津杨柳青农博园 停车场",
      //       "position": {
      //         "lat": 39.157428,
      //         "lng": 116.995209
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "津同公路"
      //       },
      //       "formattedAddress": "西青区 天津市 津同公路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.157428,
      //             "lng": 116.995209
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "免费",
      //           "free": true
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 61955.684615249855
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815574",
      //       "title": "天津杨柳青古镇景区 停车场",
      //       "position": {
      //         "lat": 39.135754,
      //         "lng": 117.011691
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "柳口路"
      //       },
      //       "formattedAddress": "西青区 天津市 柳口路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.135754,
      //             "lng": 117.011691
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 64742.179466652786
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815341",
      //       "title": "天津市鑫茂科技园新能源材料产业基地 停车场",
      //       "position": {
      //         "lat": 39.112781,
      //         "lng": 117.018037
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "柳口路98号"
      //       },
      //       "formattedAddress": "西青区 天津市 柳口路98号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.112781,
      //             "lng": 117.018037
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 67280.94963713277
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816057",
      //       "title": "天津水高庄园 停车场",
      //       "position": {
      //         "lat": 39.085255,
      //         "lng": 116.938363
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "津静公路"
      //       },
      //       "formattedAddress": "西青区 天津市 津静公路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.085255,
      //             "lng": 116.938363
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "10.00 元 / 次",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 67523.33084480019
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816011",
      //       "title": "天津子牙河游乐场 停车场",
      //       "position": {
      //         "lat": 39.083927,
      //         "lng": 116.941287
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "津静公路"
      //       },
      //       "formattedAddress": "西青区 天津市 津静公路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.083927,
      //             "lng": 116.941287
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "免费",
      //           "free": true
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 67745.18383513688
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815550",
      //       "title": "天津市澜湾花园 停车场",
      //       "position": {
      //         "lat": 39.132094,
      //         "lng": 117.083248
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "津杨路"
      //       },
      //       "formattedAddress": "西青区 天津市 津杨路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.132094,
      //             "lng": 117.083248
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "6.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 68008.83891211335
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815557",
      //       "title": "天津市澜湾广场 停车场",
      //       "position": {
      //         "lat": 39.131605,
      //         "lng": 117.082587
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "津杨路"
      //       },
      //       "formattedAddress": "西青区 天津市 津杨路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.131605,
      //             "lng": 117.082587
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 68026.99181548203
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815552",
      //       "title": "天津市澜湾广场 停车场",
      //       "position": {
      //         "lat": 39.131913,
      //         "lng": 117.083382
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "津杨路"
      //       },
      //       "formattedAddress": "西青区 天津市 津杨路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.131913,
      //             "lng": 117.083382
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "car_park",
      //         "mguVehicleCategoryId": 281,
      //         "name": "Car parks"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 68032.03243567146
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816061",
      //       "title": "天津市中北镇医院 停车场",
      //       "position": {
      //         "lat": 39.127731,
      //         "lng": 117.075342
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "星光路39号"
      //       },
      //       "formattedAddress": "西青区 天津市 星光路39号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.127731,
      //             "lng": 117.075342
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "1.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 68088.01163056641
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816209",
      //       "title": "天津富力湾天阔园 停车场",
      //       "position": {
      //         "lat": 39.133307,
      //         "lng": 117.088919
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "津杨路"
      //       },
      //       "formattedAddress": "西青区 天津市 津杨路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.133307,
      //             "lng": 117.088919
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 68141.21726559776
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815975",
      //       "title": "天津市鑫茂科技园汽车产业孵化园A区 停车场",
      //       "position": {
      //         "lat": 39.097227,
      //         "lng": 117.0125
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "于成路1号"
      //       },
      //       "formattedAddress": "西青区 天津市 于成路1号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.097227,
      //             "lng": 117.0125
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 68648.99135100382
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816025",
      //       "title": "天津溪华苑社区 停车场",
      //       "position": {
      //         "lat": 39.118974,
      //         "lng": 117.069024
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "海光路"
      //       },
      //       "formattedAddress": "西青区 天津市 海光路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.118974,
      //             "lng": 117.069024
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 68670.888359469
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608660",
      //       "title": "芥园西道地铁站 停车场",
      //       "position": {
      //         "lat": 39.142290284,
      //         "lng": 117.120397321
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300112",
      //         "street": "芥园西道195号"
      //       },
      //       "formattedAddress": "南开区 天津市 芥园西道195号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.142240385,
      //             "lng": 117.120345044
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 136 1209 7404"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 68728.99553830971
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815655",
      //       "title": "天津市鑫茂科技园汽车产业孵化园B区 停车场",
      //       "position": {
      //         "lat": 39.094619,
      //         "lng": 117.012047
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "于成路1号"
      //       },
      //       "formattedAddress": "西青区 天津市 于成路1号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.094619,
      //             "lng": 117.012047
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "3.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 68897.08742350464
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816161",
      //       "title": "天津市九一九（星光） 停车场",
      //       "position": {
      //         "lat": 39.117745,
      //         "lng": 117.076317
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "星光路"
      //       },
      //       "formattedAddress": "西青区 天津市 星光路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.117745,
      //             "lng": 117.076317
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69095.63939952216
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816071",
      //       "title": "天津华亭丽园 停车场",
      //       "position": {
      //         "lat": 39.120887,
      //         "lng": 117.087678
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "卉安道"
      //       },
      //       "formattedAddress": "西青区 天津市 卉安道",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.120887,
      //             "lng": 117.087678
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69277.18865894458
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608661",
      //       "title": "天津世贸城 停车场",
      //       "position": {
      //         "lat": 39.136462773,
      //         "lng": 117.120716443
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300112",
      //         "street": "南泥湾路5号"
      //       },
      //       "formattedAddress": "南开区 天津市 南泥湾路5号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.136543521,
      //             "lng": 117.120613418
      //           }
      //         },
      //         {
      //           "position": {
      //             "lat": 39.137039288,
      //             "lng": 117.121336241
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "1.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "FREE",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8788 8686"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69287.27756939996
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608663",
      //       "title": "云和桥(四号) 停车场",
      //       "position": {
      //         "lat": 39.139238057,
      //         "lng": 117.126620731
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300112",
      //         "street": "密云路"
      //       },
      //       "formattedAddress": "南开区 天津市 密云路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.139239151,
      //             "lng": 117.126702251
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "car_park",
      //         "mguVehicleCategoryId": 281,
      //         "name": "Car parks"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "FREE",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8773 8677"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69306.56368842784
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201864321",
      //       "title": "东安生资驾校 停车场",
      //       "position": {
      //         "lat": 39.138014,
      //         "lng": 117.126984
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300111",
      //         "street": "黄河道"
      //       },
      //       "formattedAddress": "南开区 天津市 黄河道",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.138014,
      //             "lng": 117.126984
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "6.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "FREE",
      //         "lastUpdate": "2023-09-19 13:31:29+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8686 0559"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69437.4451936121
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815588",
      //       "title": "天津幸福城鹏业广场 停车场",
      //       "position": {
      //         "lat": 39.117149,
      //         "lng": 117.083422
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "万源路"
      //       },
      //       "formattedAddress": "西青区 天津市 万源路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.117149,
      //             "lng": 117.083422
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69454.56860997087
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608672",
      //       "title": "乐汤汇温泉生活馆 停车场",
      //       "position": {
      //         "lat": 39.137555891,
      //         "lng": 117.127705604
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300111",
      //         "street": "黄河道507号"
      //       },
      //       "formattedAddress": "南开区 天津市 黄河道507号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.137690479,
      //             "lng": 117.127698718
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "8.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "FREE",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8757 8888"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69514.13595772735
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201783952",
      //       "title": "熙悦汇 停车场",
      //       "position": {
      //         "lat": 39.136395,
      //         "lng": 117.125838
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300112",
      //         "street": "黄河道513号"
      //       },
      //       "formattedAddress": "南开区 天津市 黄河道513号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.136395,
      //             "lng": 117.125838
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "15.00 元 / 次",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "FREE",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8780 8889"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69533.89186964864
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201864320",
      //       "title": "云河桥(一号) 停车场",
      //       "position": {
      //         "lat": 39.134205,
      //         "lng": 117.125721
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300112",
      //         "street": "密云路"
      //       },
      //       "formattedAddress": "南开区 天津市 密云路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.134205,
      //             "lng": 117.125721
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "car_park",
      //         "mguVehicleCategoryId": 281,
      //         "name": "Car parks"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:29+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8773 8677"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69732.32700065398
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608659",
      //       "title": "新南马路五金城 停车场",
      //       "position": {
      //         "lat": 39.132683056,
      //         "lng": 117.122771929
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300112",
      //         "street": "密云一支路"
      //       },
      //       "formattedAddress": "南开区 天津市 密云一支路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.132573379,
      //             "lng": 117.122891006
      //           }
      //         },
      //         {
      //           "position": {
      //             "lat": 39.133121745,
      //             "lng": 117.116568715
      //           }
      //         },
      //         {
      //           "position": {
      //             "lat": 39.135559878,
      //             "lng": 117.119218498
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "car_park",
      //         "mguVehicleCategoryId": 281,
      //         "name": "Car parks"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "FREE",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8788 8315"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69736.31486038228
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608657",
      //       "title": "云和桥(二号) 停车场",
      //       "position": {
      //         "lat": 39.134149736,
      //         "lng": 117.126059639
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300112",
      //         "street": "密云路"
      //       },
      //       "formattedAddress": "南开区 天津市 密云路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.134123289,
      //             "lng": 117.126154805
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "car_park",
      //         "mguVehicleCategoryId": 281,
      //         "name": "Car parks"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8773 8677"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 69753.38307326936
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816046",
      //       "title": "天津旭水蓝轩 停车场",
      //       "position": {
      //         "lat": 39.119643,
      //         "lng": 117.104473
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "福姜路"
      //       },
      //       "formattedAddress": "西青区 天津市 福姜路",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.119643,
      //             "lng": 117.104473
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 70132.71502491379
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815638",
      //       "title": "天津南开研究院集群产业园 停车场",
      //       "position": {
      //         "lat": 39.127869,
      //         "lng": 117.127933
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300110",
      //         "street": "宜宾道22号"
      //       },
      //       "formattedAddress": "南开区 天津市 宜宾道22号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.127869,
      //             "lng": 117.127933
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 138 2092 1028"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 70426.98251537394
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201824336",
      //       "title": "天津天贺全民健身中心 停车场",
      //       "position": {
      //         "lat": 39.134298,
      //         "lng": 117.14114
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300110",
      //         "street": "渭水道16号"
      //       },
      //       "formattedAddress": "南开区 天津市 渭水道16号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.134298,
      //             "lng": 117.14114
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "免费",
      //           "free": true
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 70456.57864342809
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816171",
      //       "title": "天津市金海A区 停车场",
      //       "position": {
      //         "lat": 39.104964,
      //         "lng": 117.093963
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "新科道"
      //       },
      //       "formattedAddress": "西青区 天津市 新科道",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.104964,
      //             "lng": 117.093963
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "2.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 71081.08508959747
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201816036",
      //       "title": "天津新兴园充电站 停车场",
      //       "position": {
      //         "lat": 39.103072,
      //         "lng": 117.091431
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "碧祥路16号"
      //       },
      //       "formattedAddress": "西青区 天津市 碧祥路16号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.103072,
      //             "lng": 117.091431
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 71155.86325104666
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815618",
      //       "title": "鑫茂民营科技园(北) 停车场",
      //       "position": {
      //         "lat": 39.121328,
      //         "lng": 117.133587
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300110",
      //         "street": "西湖道95号"
      //       },
      //       "formattedAddress": "南开区 天津市 西湖道95号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.121328,
      //             "lng": 117.133587
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "3.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 71302.01380868298
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815619",
      //       "title": "鑫茂民营科技园(西) 停车场",
      //       "position": {
      //         "lat": 39.120794,
      //         "lng": 117.132961
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300110",
      //         "street": "资阳路5号"
      //       },
      //       "formattedAddress": "南开区 天津市 资阳路5号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.120794,
      //             "lng": 117.132961
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "3.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 71322.64823909251
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201815998",
      //       "title": "天津环亚国际马球会大酒店 停车场",
      //       "position": {
      //         "lat": 39.094947,
      //         "lng": 117.076855
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "西青区",
      //         "city": "天津市",
      //         "street": "海泰华科九路16号"
      //       },
      //       "formattedAddress": "西青区 天津市 海泰华科九路16号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.094947,
      //             "lng": 117.076855
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking",
      //         "mguVehicleCategoryId": 11030,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 71338.69229321183
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "201812291",
      //       "title": "运河渔村(红旗路店) 停车场",
      //       "position": {
      //         "lat": 39.125534,
      //         "lng": 117.149674
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300101",
      //         "street": "红旗路169号"
      //       },
      //       "formattedAddress": "南开区 天津市 红旗路169号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.125534,
      //             "lng": 117.149674
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "6.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 2769 9888"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 71675.27507431425
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608595",
      //       "title": "乐谷商务中心 停车场",
      //       "position": {
      //         "lat": 39.120017732,
      //         "lng": 117.149097325
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300190",
      //         "street": "红旗路208号"
      //       },
      //       "formattedAddress": "南开区 天津市 红旗路208号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.119866069,
      //             "lng": 117.149343798
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "4.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 5831 0588"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 72156.94248458966
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608775",
      //       "title": "人人乐 停车场",
      //       "position": {
      //         "lat": 39.121152648,
      //         "lng": 117.1524998
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300190",
      //         "street": "西湖道78号"
      //       },
      //       "formattedAddress": "南开区 天津市 西湖道78号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.121050989,
      //             "lng": 117.152481131
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "6.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "FREE",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 6069 1799"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 72215.22220942228
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608774",
      //       "title": "人人乐购物广场(西湖道店)地下 停车场",
      //       "position": {
      //         "lat": 39.121364328,
      //         "lng": 117.153255933
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300190",
      //         "street": "西湖道78号"
      //       },
      //       "formattedAddress": "南开区 天津市 西湖道78号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.121007087,
      //             "lng": 117.153266439
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "car_park",
      //         "mguVehicleCategoryId": 281,
      //         "name": "Car parks"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "6.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "FREE",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 6069 1799"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 72232.09303672475
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608656",
      //       "title": "三潭医院 停车场",
      //       "position": {
      //         "lat": 39.120135706,
      //         "lng": 117.153895887
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300192",
      //         "street": "三潭路50号"
      //       },
      //       "formattedAddress": "南开区 天津市 三潭路50号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.120102254,
      //             "lng": 117.154048146
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "免费",
      //           "free": true
      //         }
      //       },
      //       "availability": {
      //         "status": "ALL_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 2737 7327"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 72376.16308786342
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "609824",
      //       "title": "苏宁易购(红旗路店) 停车场",
      //       "position": {
      //         "lat": 39.117442142,
      //         "lng": 117.148864383
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300190",
      //         "street": "红旗路214号"
      //       },
      //       "formattedAddress": "南开区 天津市 红旗路214号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.117427499,
      //             "lng": 117.149078343
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "免费",
      //           "free": true
      //         }
      //       },
      //       "availability": {
      //         "status": "ALL_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 2762 3470"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 72384.25594562189
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "582387",
      //       "title": "慧谷大厦 停车场",
      //       "position": {
      //         "lat": 39.117191475,
      //         "lng": 117.148845687
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300190",
      //         "street": "红旗路218号"
      //       },
      //       "formattedAddress": "南开区 天津市 红旗路218号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.117190508,
      //             "lng": 117.149063363
      //           }
      //         },
      //         {
      //           "position": {
      //             "lat": 39.11624723,
      //             "lng": 117.148533956
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "6.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8761 3544"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 72406.5907627362
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608779",
      //       "title": "国美电器(鞍山西道店) 停车场",
      //       "position": {
      //         "lat": 39.116462626,
      //         "lng": 117.150828519
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300192",
      //         "street": "鞍山西道445号"
      //       },
      //       "formattedAddress": "南开区 天津市 鞍山西道445号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.116549589,
      //             "lng": 117.150825734
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "5.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "ALMOST_OCCUPIED",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 159 2225 5006"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 72568.56191350272
      //   },
      //   {
      //     "place": {
      //       "provider": "北京四维图新科技股份有限公司",
      //       "providerId": 304,
      //       "providerPlaceId": "608636",
      //       "title": "天环装饰城 停车场",
      //       "position": {
      //         "lat": 39.115169484,
      //         "lng": 117.148808889
      //       },
      //       "address": {
      //         "countryCode": "CN",
      //         "country": "中国",
      //         "region": "南开区",
      //         "city": "天津市",
      //         "postalCode": "300190",
      //         "street": "红旗路242号"
      //       },
      //       "formattedAddress": "南开区 天津市 红旗路242号",
      //       "entrances": [
      //         {
      //           "position": {
      //             "lat": 39.115165751,
      //             "lng": 117.149304254
      //           }
      //         }
      //       ],
      //       "placeType": "POI",
      //       "category": {
      //         "losCategory": "parking_lot",
      //         "mguVehicleCategoryId": 282,
      //         "name": "Parking"
      //       },
      //       "hasChildrenPois": "NO",
      //       "commercial": {
      //         "priceSummary": {
      //           "priceSummaryText": "6.00 元 / 小时",
      //           "free": false
      //         }
      //       },
      //       "availability": {
      //         "status": "FREE",
      //         "lastUpdate": "2023-09-19 13:31:28+00"
      //       },
      //       "contact": {
      //         "phoneNumber": "+86 22 8707 5666"
      //       },
      //       "staticIconDiscriminator": {
      //         "parkingPreferredPartner": false,
      //         "refuelingPreferredPartner": false,
      //         "chargingPreferredPartner": false,
      //         "onlinePayment": false
      //       }
      //     },
      //     "distance": 72592.30564147628
      //   }
      // ];
      // const locations = decode(
      //     "Y29hcUZzdmNnVXxXZWBAaE1jVXhRbWBAdFRzbkBua0Blc0JgT3NkQGRadXNAZGRAe3hAel9Ab2hAeFdfWmpUcVN0YkB5XHB7QGNrQHxedVp2UWlRYlBpUWxfQHNmQGhRdVhoVm1jQHRhQHlhQWJOdWJAfEthYUB8TnFyQHpXeWBCeEdvWnRNY2ZAckxlXmxTa2dAfk5rWmJab2dAZkxvUHRccWFAdFl1WWhfQHVaYFN9TXRebVNsVntLbHhAfVpsakB3WnBZa1VkWmVZfE53THpJd0V0UXtFaEZlRmRHaU1uR3lFdExpQnZ4QWNHalBpQWZiQHdGdG5Be1VoYUBlTXpUb0poUntKbFV9Tmx3QW1kQXZZX1BuW3VNbmJAYU1oWm1Gem5CbVVyUGlBaFhrQG5gQHJAaGJAYkViUHJDemRDdmlAamdAZElkVnxCflVuQX58QWxEell4Qm5YdkRkYUBgSmxiQHROcFtiT35nQWBtQHxYYkxkXXxKelNoRWpcakV2VHZBYHpAdkN+YEB8RGBSYER8ZERmdUB+VHREeE96QX5aZkFsY0BfQXZ7QWtRdFhhRXZnQF9FcnJAb0Fic0BHYmtBb0NkXn1Fam5AZ09oVmlEflBLdk5kQmRGe0B0Q2tDakJ3RXxBcVZwUWt1QXJ3QGNyRXZMZ2dAclxxaEFuTGNpQHBHe2JAalRhdkJ2RXVackl3XWBNeV1kZUFtdEJ0Y0B5akBqTl9OdlV1UWBRdUtsXHdPZlRrSGx2QF9UYlFfSGRWeUxwW3NTdldxVXpSY1RwVGNaeltza0B4TmleckphWnpIcVp0YUFpcEViUXtsQGpSd2NAfGxAdWVBcFxzbUBuSGNCcFJuQHxOekJ+YUB2SmBOZEJqUmJBYExEZldhQXZTb0N4U2NGcFN7SHZVcU1yZUVpekNgTGdHek15RWpOa0N6VnNAYlRyQmhIYkJ+TnhGYktmR2ZLeElyeEJmfEJqYEBkXHZaclFkXWxOdl5qSnpcdEVuY0BkQnRSWW5YZUJ6bUN5Y0B0ZUB9RWxdYUFwbUFQZmBAb0ByaUR9THBYeUJqZkBjSWhUcUZ6WmlLeGBEX3ZBdGZAb1B2d0N7b0ByV21FbFl9Q2JsQ19UZlhnRH5RdUR6bEB3UX54RXF+QWJ9QHdbfFl9Tm5iQGFYenxEaXpDbGFAb1l8X0BfVG58QWtvQH5mQHlYZF9AcVp0X0FzX0F+VXFRblV7TX5eaU9oZUBhTHJuQ2daaF53Rm5nQHNOalR9SXRTcUt4U3tNfFVhUnpVb1V4Tn1Qbk1nUXJSZ1t6YkBrfUBqUWtaYFhxXXZXaVdmY0BvWm5WdUxmUGFHcExrRHBdfUdkVH1CalVfQW5xRmpAamBAZ0Fge0BfSWBefUFoUUVoWGpAdkV0QGBDakFoRXBHZEZmRX5DaktgSWZ6QHxCYmdAdEBsZEBfQGB1QHNLcmxGd0F4SnVBZkF5QUJ1QnNCfUFxR3tAdU50QXlBdmVEZmBAaGlAbURkbUFfRnhlQXVHdkd6QWRtQXJhQHpNckR+YkFmR2JgQWpCZGdBZkB2dUB2SGZMbkd2dUF0b0Fmc0FgeEFuRnhCeEZ2QH5Ma0Bmc0F8fkB2XWhRZk5uR2ZKfkN+fUF2Z0B8R1pueEBnSGR1Q1h0dkZmQnplQnZVZkRgQXZqQG11QHBae2lAaHRBdWVBbEx7TXpkQG9wQHRxQHF5QH5QeVBuZ0JpekF3RXZmQXFFd0BXfkJxR11hU31De0JlQmFSYUBgUmBAekJkQmJLdEFjS3VBe0JlQmFSYUBgUmBAekJkQmBTfEN9RmdBblRGX0NhQF9AfkJoRmdBfEFlU35GfXVAdmxAY2NAdHRBZWxBYlFxVHRjQHV2QHRKe0puZ0BjV3hQcUZocUB3UHB5QGFOamxAa11ob0BpYkBuTWFDfmVAeUN2R3FCYmVDaXpBZElpQ2BMQm5rQGxSYkN4QXxOYEZgSmpBektxQXJkQmduQHZNYUN2TF56fEF0VmZJbEBgTmFAYklfQmZMY0Z2SWtHcExhUW59Q3NPfk1xTHBtQGdxQHBFZURwS3NCcmpDaUdwZEBVYHNDbkp+RWpAQXZGYkNmR3BDdEFmS3xAdkBuQVl8RGlDXW9CX0xnRX1oQHFCa3FAQ2d1R3RBdXlAfkF7VW5EZ1x+QmFQekhlYEBwTW1kQHhgQHFlQXRGX1J2TG9pQGZKY3RAZkRfd0BIYVpjQnluQH1fQF90RWFEeXFAS2lhQHxAdWBAfEFlWHxKY29BekFzXmRAY19AU3FlQGtKa2ZIc0J5bUBhSGl1QGNIYWNAd09fcEBhTGVda1RpZ0BneUFzcEN5VGttQG9Ob2pAc0ZxW3lIe3RAX0NxdUBnQHNgQXlBb1xrQ2VZZUh3ZUBjekB9ZkVfR2djQHNFZ2xAb0Jzd0BKeV5uQGtYcEJxX0B+XWF9RXpDbXpATGd3QHFIc21EQGtgQHZAY2dAaEZzY0F+WG14Q3pFe35AbEB1bEBgQX1GbER1RWJMc0l6R2dDalR7Q3RZa0JobkJxRHhMcUByX0B7Q2J3QGFOalRzRnRdZUxyWGNMaGRCfXZAdk9fR25fQH1IZlBzQWxWWWptQGhDfk1HYGhAe0NqaUBball2QXp1QHBLcFNuQGBPT3JOa0FoVX1EflJjR3xOZ0h4SnNHdEZpRXpeYV58SmVJYFl7T2RXa0lidUB5THBWfUh8X0B1UmhTcU9mVF9VbnBAY19BalVlV3RSc09oU3NMaFdxS2Jec0lsU31CcmNAZUJqYkFvQnpKQn5RYkFiVWBDfFNgRmhnQXxiQHhVZEhwVHZFdGBAdER8YUBmQHhiQHtCZFlhRXpTd0Z8X0B3TmRrQGVbbldxTGpWaUl2ZUBpSnJVc0JuXHdAZlJOeHZAZkZ8SkVmV19EbEl7Qm5MfUVyZkBjXXZafU1sekNfcUBwVm9EYnFAfUV+T2FEblZlSXpYYVFscUJzYUJ6W3tUal5nU2Zba05oYENrfUBsWntOdEx9R2xgQX1sQHZOfUVsbUBtTm5DWWpKXmpEc0FwQW9CckB9RXlCdVBlQ2lsQExhX0BqQnFrQGJIc3RAflp9ckJgQnVRbEJjZEBCa2ZAb0JvfEBcZ1FiRmV3QHpBeXZAbUBvY0BhRmdpQWdAaX1AekB7ZkB2SmtvRHJDZ29AfENzW2pIZ2lAcEptaUB0R2dpQHREdWhAbEF9XGJAY3BAcUZhckZqQX1rQH5GaXVAYEVpWWRJX2JAelxvbEFsT2diQG5Mc1Z+TnNWclBtVXBZe1x0Vm1fQGxRc11wXXV4QHhHY01wZUBhd0BgTnFZfk5lYUBwSnddfkhzXWBHb1J0SHNMakpzRnhIb0F6TF58WmBEaHpTcHFBbmRAfkFyWFdiZUB7RHJWa0Vwe0BnU2xUc0NgX0B7QnhfQE9uZUBgQ3BfQGxGZHhAdlFoZ0B0RnxaYkF4c0FYcFFzQHZVcUN2Um9FbHZAZ1V2V3dFZF13Q2RiQFt8d0FqRmZYXmBhQG1AenpAY0duX0BhQWZZTm5rQHRCZFRAeGJAX0Nib0B7SnhhQGNDelxkQHRzQGZIcGdAZkJ8V01wbUFlRWBgQEBoV3BBaHJEZlhkYEBcelxvQWRfQHlFYk51Q2Jcd0poVGNKdGFCe3ZAZmpBfWBAcF1tUm5xQ2dlQmZlQG9VeFtpTHZ+QHdWYnJBY2VAZFZnRmJYcUJ8WVpoekJiVmRcZkJ8VUhyUmtAfF9Ae0RkTmVDelZrR3RrQGtWel5rVmZtQG1oQHJFY0R0W3VOflJ7RW5sQGFKYn1AeVVuc0B3S3hrQGVOZFhrRH59QG9BalZSYFVwQWhvQXxMfk9yQHBZSXZba0JgZUBtSGZYd0hye0JzdUB0W21HfFlnQ3RPbUBueUBJcF9Bc0hgX0BzQGJkQGhCZHVAbkhiXnBAaGRAX0J8X0FhS2ReYUJ4UEJic0FuRXpUYUFsU29Efk9jRm5QeUlwSGdGaGFBZXtAdk1fSnJnQGNafF5nWXhbdV1kb0NzbERwR3FIZlFxT3xPeUpsT3FHaG9AbVB4XGdMaGVAc1VoXmFPYk17RGRea0hoX0BzRGRXaUBiXmxAeFhsQ3B5QXRVfmFAZENyd0BgQG5TYkNsb0BuTmhRdkFqUEpkUHFAblFlQ2xiQXFValltRGhUW2htQGBDbltJamVDfVBkVlp6Um5DcmlAZEt6UXRCbE9qQHRZX0BqTGVBdk9zQ2hPe0VqZ0BnVW5LaUN+UmtCZFVceGxDflZiUGBAeFFfQGpPb0F6V2NGZlV7SHxoQGFWdE5rRGpUa0J0TUB6ZkB4RHxVSnhTeUFyZEBvSHZZe0BsWHZCfHxBZFZ4S35AelBCdE5tQX5jQGFLZFhxQ2xXQHp0QGxDalhnQGRabUZob0BzVWZMeUJoVnVBdEtQbFBgQmpPbERuWGRJdlN0RGZkQ2JSZFpuRW5QeEZwUGJLfEpwSXpXflliS2JJdk1oSGRTbEd4akB0SXZaeEluWWRObGVAdlxkVWBNfFFsR2JyQHBOeGxAaFV4TX5CbGBAckNqXn5GalZmQn5WUWhoQWlGck9GcFJ6QnBLckNgSnJEfmVCYnpAeE14RGRpQHRMZmRAYE9gS3ZCbE12QWhhQEtuTm1CcE9fRWJNZ0Z8TGtIfnhAe25AcFJ3TGZRYUp2ZEB3UG5iQV9XdGhBe2FAdmBAZUpqYUBvRmBjQHdCbmlAWGRcdkJ2cEBiSnxYbENgYEBkQn5mQ2hFcmRAeER6ZEB4SG5sQHBQemdAclRiW2xRdm1BfnpAZFBkSn5YekxyY0BmTWBXZEVse0B0SnRQYERqdkBuUX5MckFoWVJwUXlBfGFBd09yUWVAblRiQXxQdENiUXJGdG1BbG9AdFd0S2ZTbEV4U3RCYkpYbmdAWXJcYENkVX5FaE9qRmhhQG5QZFtiSG5WcEJ8WEN0T2lBaHxAY0t4ZkBrQ3hjQEV2ZUB4QnRiQGRGemFAckloUWBGcGRCcGtAbGBAdEp4ZUBmSHBpQnhRcFN4QHZVRmxTa0B6VnNCfFZ3RHhTd0VsZkFfXWpafUR8SWNAfFVCblh6QmRWYkZ6SXJDempAcFV8YkB0TWhYfkVwWGxDbFh6QHRkQHtAdFhrQ2puQGNKdGFAaUJ2UkRwV2pBak96QWRyQGhLaFVmQmhYbkB4VlVoakNjS2paWWpbYkBoWXZBYnJCbE5wXW5EfmdAfkpkakFmXXhPckNqTXJBbFJ2QHJiQGFBdFxnRmBqQG1OZE5xQX5SQ3pOdEF2UHxEeF9CcHJAfE1uRXZPYkR+U2ZCcEpMZE5hQG5VeUNiW3tKYlR7THZuQ195QnZYaVFsZEBrVHhWa056VV9RalBrT2BwQG11QGpYe1VwVmlSYFRfVHJLaU1sUWtXYlNfXWhPdVR4S2FOYm9Ad3FAfEthT3JpQGV9QGRKc01wUWVUZF1hW2JwQHFiQGBbYVZ8RmdGanVAX3pAeld3U3xXc05iWmFLfFdjRmBQeUF6T2VAcFBMYE94QHpkRH5aaExMblBvQGRNe0F4TmVEeE97RmBLa0ZsSmtHbk1nTH5PY1NwYkB5dUBsVmdddFh3WWZoQHdhQHBacVxiVW9jQGRIe1R+YkB1fEF4TnlecGBAZ3lAcEx9W3BKa1xsTV9uQHJHa2ZAdkR5Z0BmR3lxQWpFd19Aakd7XWxKZ19AbktpW3hpQG9sQXJQbWRAckxvZEB6Tnd7QHZKY2NAcE9nZUB4WnlzQHxPY2hAcEl5YEB6YEBfeEJgSnddYl9Aa25BYkp5X0BuSHNlQHxMc3BBaEZnXGxKcWJAfE99ZkB8dEBpbkJsUW9del5jbUB8SXlRckxnWmZIc1R6S2VkQHBPX2NBeER5UnhCa0diRmFHaERtQmRGZUFoSGNAclJJZlVoQXx6QH5GbFZBYHNAbURqW19AcFdgQGRqQHpDZGBAXG5XeUBydEB9Rn5hQHFAYn5HdkZgXXRCdndAZkp+VWRBcllOZl9Ab0FsbkB9RmhYdUFyVlNkdEBsQHhkQHFBbl1jRHR1QG1KamRAb0N4YkBHbmJBbER8Y0BzQGJYe0JiYEFhTmJZYUdoYUBnTXJvQXtpQHpXaU58XWtWdGNAaWNAZk95UmBTeVtwSmVSemRAb2NBck9xWGhSb1huUWlUblVzVXZOfUxyeUBfb0B4V2NWalV9VnRoQHNvQHBYbWBAflR9YUByU3VmQHxOfWRAaGhAdWpCaFFpZUBsVntnQHhNYVx4S3VcdkltXHxMb3FAdkNpVnxIa3xAZkhvZ0BkSHVeelZpZUFgRnlZfkxzX0F4R3ldaEprX0BqUl9sQGBKbVR4VWFnQHZQYWRAdktvX0BkUG1wQGxdd2JBal1lbkFiTW1bcF19c0B0UW1lQGBKbVt2WHFvQWpLc112UGVmQGRMaWFAakt1Z0BwS3NjQGZOc2JAbFN7ZkB4S2tbaEh9VmpVdWNBYEd9U3pIX1VmYEBtX0F4TH1cakx1YUB4UW14QGxJa1h4TX1cflVrZEBoVWlcal9AfWBAaHpEa19EdlBjUHZSZVVqU3FZak9hWGxmQXtgQ2ZbZWpAZF5fZkBkUmtTaGJBaWJBclJtVWZSYVl2VntmQHJlQHFuQXZQY1xmVmFfQH5Rb1VmUX1ReFNfUmhwQWFkQXZTX1RkZ0BjbEB2UXdQfGJAd11+XW1eelJ7VmpTZ1t4XG1wQHJRfVp8VWNcbG1AcXNAdn5Ad3pBYFB5VHhedWFAZGZBb2BBeF5rY0BuTGVRbFNpX0BwTGNYYGRAbWpBYFNxXmhlQHd2QGhPb1tqWWVzQGpOdVhuV3NgQGBzQXdjQnRZa2hAcFBzYEBsUWtefFZ5YEBkUGVTdFNvVGpTfVB8fEF7Z0F6UGtPcmZAdWdAfmBAeVt+UHVLelRtTHhhQ21lQWhgQGtTemVAYV18fEFzdEF8UXFNZnBAa19AalZtUW5VeVNoVm9YcFRnW3BjQHF0QHRLb058UW9TdF1tWmJyQXl9QGxUd1B6WGdXcGFAbWJAcltrV2ZiQHlWen1CaWNBcGZAb1hkYkB9WmJfQXF6QHBjQGtdYFtnUnJxQW9wQGJhQGNYflpjWGJ9QF99QGBXbVNqXGNUdFZnTXhce01qfEJxcUB8Y0BzUHRkQHVWcnVAbWhAaGtBfWxAZmBAX1pob0B1bUB2dkB3akB2eEBfdkB8VXdQdFp5UXJWY1F8WXlWcFhtWHBUd1FqWHdRblllT3Rad0xmZkBvTXxbZUZwc0BrR25nQGFKeFV1R2x6QHdYenhAc1B+YUBxTGJgQHNPemNBbWhAZlZnSmhiQH1NYltxTXBVb01id0BhZ0B0VmNMaFZxSX5gQG1KbGlBcVJoVWlHcmlAX1JyYUBjS25baUZ2Z0FxTnhhQG9JfmBAd014ZkBfVWZhQH1OfHJDbXNAflxvS2JpQHFVfGhAaVtqW31PflJlSWxfQWFcbF9AZVFoW21SfmdBeXVAcFx7UGR9QGtefFxjUHpbd1J2akFteUB0UHlKdlxjUHBjQHVPemJBdVdiYUBzTWBacU14cEB3XX5Xe0t6VmtJempAcU1+dUFfVGhXfUZqX0BfTHhRX0hyWmNOYHdBYXZAZGRAaVFmX0BfS35oQHlJbmlDb1JyWmdEbFl7RXhRfUR8XV9LYnBCZXRAflVnR3psQHVKdmJAe0NmZkBlQGJfQ2xHal5OdmRAYUJmaEBlRnxhQHNCeldRenRAYkF6U19AeFhlQnZcb0V0W2NIelF1RnpzQW1lQHZUaUdoVGlFclt1RGp2QX1IYGBAd0R2XmdIfl9BaVhoa0BrS25ZdUNqUWNBcmZBcUNyXl9DZl5zRWx0QXdVYl1zRHxvQGNDdFNAdmFAcEFgYEBoRHxzQmZYdmxAaEV8VF5kXllsWn1BemhAbUdyVXNFaGJAb0xkVl9KZGZBb2RAYmBAZ01sWV9Ialh1RWxaX0R0YUJ3SHpcd0NsZUB7SHxjQHNMaFhfS2pWYUxyekBlZkB2ZUBfVGJoQHFPZGtBdVdiWG1KalFjSXpQZUp4XV9WZmNBaXpAflNnTnxhQGNUelZ9SnpZX0p4akJhYkBsZkB1TmhVYUpwXnNRZmNBe29A"
      // );
      //创建 MultiPolyline
      // this.polylines = new TMap.MultiPolyline({
      //   id: 'polyline-layer', //图层唯一标识
      //   map,//设置折线图层显示到哪个地图实例中
      //   //折线样式定义
      //   styles: {
      //     'style_blue': new TMap.PolylineStyle({
      //       'color': '#3777FF', //线填充色
      //       'width': 6, //折线宽度
      //       'borderWidth': 5, //边线宽度
      //       'borderColor': '#FFF', //边线颜色
      //       'lineCap': 'butt' //线端头方式
      //     })
      //   },
      //   //折线数据定义
      //   geometries: [
      //     {//第1条线
      //       'id': 'pl_1',//折线唯一标识，删除时使用
      //       'styleId': 'style_blue',//绑定样式名
      //       'paths': locations.map(item => new TMap.LatLng(item.lat, item.lng))
      //     }
      //   ]
      // });
      // this.labels = new TMap.MultiLabel({
      //   id: 'label-layer',
      //   map: map,
      //   styles: {
      //     label: new TMap.LabelStyle({
      //       color: '#3777FF', // 颜色属性
      //       size: 20, // 文字大小属性
      //       offset: {x: 0, y: 0}, // 文字偏移属性单位为像素
      //       angle: 0, // 文字旋转属性
      //       alignment: 'center', // 文字水平对齐属性
      //       verticalAlignment: 'middle', // 文字垂直对齐属性
      //     }),
      //   },
      //   geometries: this.places
      //       .map(places => places.place)
      //       .map(({providerId, providerPlaceId, position, title}) => ({
      //     id: `${providerId}-${providerPlaceId}`, // 点图形数据的标志信息
      //     styleId: 'label', // 样式id
      //     position: new TMap.LatLng(position.lat, position.lng), // 标注点位置
      //     content: title, // 标注文本
      //     properties: {
      //       // 标注点的属性数据
      //       title: 'label',
      //     },
      //   })),
      // });
    }
  },
  mounted() {
    CodeMirror.fromTextArea(document.getElementById('code-editor'), {
      lineNumbers: true,
      value: this.code
    });
    // new EditorView({
    //   extensions: [basicSetup],
    //   parent: this.$refs['code-editor']
    // })
  }


  // this.polyline = new this.$refs.tmap.MultiPolyline({
  //   id: 'polyline-layer',
  //   map: this.$refs.tmap.$el,
  //   styles: {
  //     'style_blue': new this.$refs.tmap.PolylineStyle({
  //       'color': '#3777FF', //线填充色
  //       'width': 6, //折线宽度
  //       'borderWidth': 5, //边线宽度
  //       'borderColor': '#FFF', //边线颜色
  //       'lineCap': 'butt' //线端头方式
  //     })
  //   },
  //   geometries: [
  //     {//第1条线
  //       'id': 'pl_1',//折线唯一标识，删除时使用
  //       'styleId': 'style_blue',//绑定样式名
  //       // new TMap.LatLng(
  //       'paths': locations.map(item => new this.$refs.tmap.LatLng(item.lat, item.lng))
  //     }
  //   ]
  // })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.map-view {
  margin: auto;
  width: 90%;
  height: 90vh;
}
</style>
