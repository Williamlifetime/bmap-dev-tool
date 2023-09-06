<template>
  <div class="container">
    <div id="mapTypeBtn" @click="changeMapType">{{ isSatellite ? '关闭卫星图层' : '🛰️卫星图层' }}</div>
    <div id="mapBox"></div>
    <RecordBox ref="recordBox" :pointList="list" @updatedList="updatedList" />
  </div>
</template>

<script>
import RecordBox from './RecordBox.vue'
export default {
  name: 'map-box',
  props: {
    msg: String
  },
  components: { RecordBox },
  data() {
    return {
      map: null,
      mapType: 'BMAP_NORMAL_MAP',
      list: []
    }
  },
  computed: {
    isSatellite() {
      return this.mapType === 'BMAP_SATELLITE_MAP'
    },
  },
  mounted() {
    const list = localStorage.getItem('list')
    if (list) {
      this.list = JSON.parse(list)
    }
    this.init()
  },
  methods: {
    init() {
      const BMapGL = window.BMapGL
      const map = new BMapGL.Map("mapBox");
      const point = new BMapGL.Point(104.070, 30.596);
      const cityCtrl = new BMapGL.CityListControl();
      map.centerAndZoom(point, 12);
      map.enableScrollWheelZoom(true);
      map.addControl(cityCtrl);
      map.addEventListener('click', (e) => {
        if (this.$refs.recordBox.detailVisible) {
          const point = [Number(e.latlng.lng.toFixed(6)), Number(e.latlng.lat.toFixed(6))]
          this.list[this.$refs.recordBox.currentIndex].points.push(point)
          this.createOverlay()
        }
      });
      this.map = map
      this.createOverlay()
    },
    createOverlay() {
      this.map.clearOverlays()
      const BMapGL = window.BMapGL
      if (!this.list.length) return
      this.list.forEach(item => {
        if (item.points.length === 0) return
        const points = item.points.map(it => {
          return new BMapGL.Point(it[0], it[1])
        })
        const polyline = item.type === 'line' ? new BMapGL.Polyline(points, { strokeColor: "red", strokeWeight: 10, strokeOpacity: 0.5 }) : new BMapGL.Polygon(points, { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });
        this.map.addOverlay(polyline);
      })
    },
    changeMapType() {
      // eslint-disable-next-line no-undef
      this.map.setMapType(this.isSatellite ? BMAP_NORMAL_MAP : BMAP_SATELLITE_MAP)
      this.mapType = this.isSatellite ? 'BMAP_NORMAL_MAP' : 'BMAP_SATELLITE_MAP'
    },
    updatedList(list) {
      this.list = list
      window.localStorage.setItem('list', JSON.stringify(this.list))
      this.createOverlay()
    }
  }
}
</script>

<style scoped>
#mapBox {
  width: 100vw;
  height: 100vh;
}

#mapTypeBtn {
  position: absolute;
  top: 11px;
  left: 150px;
  z-index: 10;
  width: 100px;
  height: 31px;
  line-height: 31px;
  border-radius: 3px;
  background-color: #fff;
  padding: 0 12px 0 10px;
  color: #666;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, .15);
  user-select: none;
  cursor: pointer;
}

#mapTypeBtn:hover {
  background-color: #dadada;
  color: #3d6dcc;
}
</style>
