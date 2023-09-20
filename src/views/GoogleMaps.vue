<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <!-- Card stats -->
      <b-row>
        <b-col xl="3" md="6" @click="showInputModal(0)">
          <stats-card
              title="画线"
                      type="gradient-red"
                      sub-title="searchLocation(至少两个点)"
                      icon="ni ni-active-40"
                      role="button"
                      class="mb-4 pointer-event">
          </stats-card>
        </b-col>
        <b-col xl="3" md="6" @click.prevent="showInputModal(1)">
          <stats-card title="标点"
                      type="gradient-orange"
                      sub-title="传入完整的places数组即可，会自动解析其中的position"
                      icon="ni ni-chart-pie-35"
                      class="mb-4">
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="Sales"
                      type="gradient-green"
                      sub-title="924"
                      icon="ni ni-money-coins"
                      class="mb-4">

            <template slot="footer">
              <span class="text-danger mr-2">5.72%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>

        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="Performance"
                      type="gradient-info"
                      sub-title="49,65%"
                      icon="ni ni-chart-bar-32"
                      class="mb-4">

            <template slot="footer">
              <span class="text-success mr-2">54.8%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row>
        <b-col>
          <b-card no-body class="border-0">
            <tencent-map @ready="onMapReady" ref="tmap" class="map-view" :ak="apiKey"/>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-modal @ok.prevent="parseLocation" :id="locationInputModalTitle" no-close-on-backdrop>
      <template #modal-title>
        {{modalTitle}}
      </template>
      <div class="d-block">
        <textarea id="code-editor" v-model="codeValue" ></textarea>
      </div>
    </b-modal>
  </div>
</template>
<script>
  import { API_KEY } from './Maps/API_KEY';
  import {TencentMap} from "ppos-vue-tencent-map/src/components";
  import dedent from 'dedent'
  import CodeMirror from "codemirror"
  import 'codemirror/lib/codemirror.css';
  import {decode} from "../util/PolylineDecoder";
  import {checkInputValidation} from "../util/v5-json-parse";

  const LINE = 0;
  const MARKER = 1;

  const LOCATIONS_INPUT_MODAL_TITLE = "bv-modal-map-input"

  export default {
    components: {
      TencentMap
    },
    data() {
      return {
        apiKey: API_KEY,
        locationInputModalTitle: LOCATIONS_INPUT_MODAL_TITLE,
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
        cm: undefined,
        codeValue: '',
        mapIsReady: false,
        map: undefined,
        TMap: undefined,
        polylines: undefined,
        labels: undefined,
        markers: undefined,
        places: [],
        modalType: LINE
      }
    },
    computed: {
      modalTitle() {
        switch (this.modalType) {
          case LINE:
            return "请输入searchLocation参数";
          case MARKER:
            return "请输入places数组";
          default:
            return "未知格式，可能无法使用"
        }
      }
    },
    methods: {
      parseLocation() {
        try {
          switch (this.modalType) {
            case LINE:
              this.drawLine();
              break;
            case MARKER:
              this.drawMarker();
              break;
            default:
              break;
          }
        } catch (e) {
          this.$bvToast.toast(`传入的参数无法解析！${e}`, {
            title: '错误！',
            variant: 'danger',
            solid: true
          })
        }
      },
      drawMarker() {
        const inputJson = checkInputValidation(JSON.parse(this.cm.getValue()));
        const geometries = inputJson
            .map(places => places.place)
            .map(({providerId, providerPlaceId, position, title}) => ({
              id: `${providerId}-${providerPlaceId}`, // 点图形数据的标志信息
              styleId: 'label', // 样式id
              position: new TMap.LatLng(position.lat, position.lng), // 标注点位置
              content: title, // 标注文本
              properties: {
                // 标注点的属性数据
                title: 'label',
              },
            }))
        this.markers.setGeometries(geometries);
        this.closeModal(
            geometries.map(geometry => geometry.position)
        );
      },
      drawLine() {
        let routeArrays;
        try {
          routeArrays = decode(this.cm.getValue());
        } catch (e) {
          try {
            routeArrays = this.cm.getValue()
                .split("|")
                .map(location => location.split(",")).map(latLng => ({
                  lat: latLng[0],
                  lng: latLng[1]
                }));
          } catch (e) {
            routeArrays = [];
            throw e;
          }
        }
        if (routeArrays.length < 2) {
          throw '路径至少存在两个点！';
        }
        this.polylines.remove('pl_1');
        const latLngArray = routeArrays.map(item => new TMap.LatLng(item.lat, item.lng));
        this.polylines.add({
          'id': 'pl_1',//折线唯一标识，删除时使用
          'styleId': 'style_blue',//绑定样式名
          'paths': latLngArray
        })
        this.closeModal(latLngArray);
      },
      closeModal(latLngs) {
        this.$nextTick(() => {
          const latlngBounds = new TMap.LatLngBounds();
          latLngs.forEach(item => latlngBounds.extend(item))
          this.map.fitBounds(latlngBounds);
          this.$bvModal.hide(LOCATIONS_INPUT_MODAL_TITLE)
        })
      },
      showInputModal(modalType) {
        this.$bvModal.show(LOCATIONS_INPUT_MODAL_TITLE);
        this.$nextTick().then(() => {
          this.modalType = modalType;
          this.cm = CodeMirror.fromTextArea(document.getElementById('code-editor'), this.cmOption)
        });
      },
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
        this.markers = new TMap.MultiMarker({
          id: 'marker-layer',
          map: map,
          styles: {
            "myStyle": new TMap.MarkerStyle({
              "width": 25,  // 点标记样式宽度（像素）
              "height": 35, // 点标记样式高度（像素）
              // "src": '../img/marker.png',  //图片路径
              //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
              "anchor": {x: 16, y: 32}
            })
          },
          //点标记数据数组
          geometries: []
        });
      },
      mounted() {
      }
    }
  };
</script>
