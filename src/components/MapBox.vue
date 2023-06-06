<template>
  <div class="container">
    <div id="mapBox"></div>
    <div class="pointList">
      <button @click="onExport">导出</button>
      <button @click="onRevocation" :disabled="list.length === 0">撤销</button>
      <p>共计{{ list.length }}条</p>
      <p v-for="(item, index) in list" :key="index">{{ item.join(',') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'map-box',
  props: {
    msg: String
  },
  data() {
    return {
      map: null,
      list: []
    }
  },
  mounted() {
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
        const point = [Number(e.latlng.lng.toFixed(6)), Number(e.latlng.lat.toFixed(6))]
        this.list.push(point)
        this.createLine()
      });
      this.map = map
    },
    createLine() {
      this.map.clearOverlays()
      const BMapGL = window.BMapGL
      const points = this.list.map(item => {
        return new BMapGL.Point(item[0], item[1])
      })
      const polyline = new BMapGL.Polyline(points, { strokeColor: "red", strokeWeight: 10, strokeOpacity: 0.5 });
      this.map.addOverlay(polyline);
    },
    onExport() {
      const text = JSON.stringify(this.list)
      this.$copyText(text).then(
        e => {
          alert('导出成功，已复制至剪贴板')
          console.log('复制成功：', e);
        },
        e => {
          alert('导出失败')
          console.log('复制失败：', e);
        }
      )
    },
    onRevocation() {
      const index = this.list.length - 1
      this.list.splice(index, 1)
      this.createLine()
    }
  }
}
</script>

<style scoped>
#mapBox {
  width: 100vw;
  height: 100vh;
}

.pointList {
  position: absolute;
  z-index: 999;
  right: 10px;
  bottom: 20px;
  width: 200px;
  height: 200px;
  overflow: auto;
  background-color: #ffffff93;
}

button {
  margin: 0 5px;
}
</style>
