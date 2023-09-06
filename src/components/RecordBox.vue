<template>
    <div class="record-container">
        <div :class="['contentBox', { 'showDetail': detailVisible }]">
            <div class="pointList">
                <div class="item" v-for="(item, index) in list" :key="index" @click="goDetail(index)">
                    {{ item.name }}
                </div>
            </div>
            <div class="detailBox">
                <div class="detailTitle">
                    <div class="backIcon" @click="closeDetail">&lt;</div>
                    <p>共计{{ list[currentIndex]?.points?.length || 0 }}条</p>
                </div>
                <div class="detailList">
                    <p v-for="(item, index) in list[currentIndex]?.points" :key="index">{{ item.join(',') }}</p>
                </div>
            </div>
        </div>
        <div class="actionBar">
            <div v-if="detailVisible" class="detailActionBar">
                <div @click="onExport" class="btn">导出</div>
                <div @click="onRevocation" :disabled="list.length === 0" class="btn">撤销</div>
                <div @click="onTypeChange" class="btn">{{ list[currentIndex]?.type === 'line' ? '围栏' : '路径' }}
                </div>
                <div @click="onRename" class="btn">重命名</div>
                <div @click="onDel" class="btn">删除</div>
            </div>
            <div v-else @click="onCreate" class="btn">新建✏️</div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'record-box',
    props: {
        pointList: Array
    },
    data() {
        return {
            drawType: 'line',
            detailVisible: false,
            currentIndex: 0,
            list: []
        }
    },
    mounted() {
        this.list = this.pointList
    },
    watch: {
        pointList() {
            this.list = this.pointList;
        }
    },
    methods: {
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
            const index = this.list[this.currentIndex].points.length - 1
            this.list[this.currentIndex].points.splice(index, 1)
            this.$emit('updatedList', this.list)
        },
        goDetail(index) {
            this.detailVisible = true
            this.currentIndex = index
        },
        closeDetail() {
            this.detailVisible = false
        },
        onCreate() {
            const name = window.prompt("请输入新建的记录名称")
            if (name) {
                this.list.push({
                    name,
                    type: 'line',
                    points: []
                })
                this.currentIndex = this.list.length - 1
                this.detailVisible = true
                this.$emit('updatedList', this.list)
            }
        },
        onRename() {
            const oldData = this.list[this.currentIndex]
            const name = window.prompt("请输入新的记录名称", oldData.name)
            if (name) {
                oldData.name = name
                this.list.splice(this.currentIndex, 1, oldData)
                this.$emit('updatedList', this.list)
            }
        },
        onTypeChange() {
            this.list[this.currentIndex].type = this.list[this.currentIndex].type === 'line' ? 'polygon' : 'line'
            this.$emit('updatedList', this.list)
        },
        onDel() {
            if (window.confirm(`确定删除当前路线(${this.list[this.currentIndex].name})吗？`)) {
                this.list = this.list.splice(this.currentIndex, 1)
                this.currentIndex = 0
                this.detailVisible = false
                this.$emit('updatedList', this.list)
            }
        }
    }
}
</script>
  
<style scoped>
.record-container {
    position: absolute;
    z-index: 999;
    right: 10px;
    bottom: 20px;
    width: 250px;
    height: 200px;
    overflow: hidden;
    background-color: #ffffff93;
}

button {
    margin: 0 5px;
}

.item {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
}

.item:hover {
    color: #3d6dcc;
    background-color: rgba(128, 128, 128, 0.224);
}

.contentBox {
    height: 174px;
    position: relative;
}

.pointList {
    position: absolute;
    top: 0;
    left: 0;
    width: 250px;
    height: 174px;
    transition: all linear .3s;
}

.detailBox {
    position: absolute;
    top: 0;
    left: 250px;
    width: 250px;
    height: 174px;
    box-sizing: border-box;
    overflow: hidden;
    transition: all linear .3s;
}

.detailTitle {
    position: relative;
    width: 250px;
    height: 24px;
    line-height: 24px;
    text-align: center;
}

.detailList {
    width: 250px;
    height: 150px;
    overflow-y: auto;
}

.backIcon {
    position: absolute;
    top: 0;
    left: 10px;
    cursor: pointer;
    font-weight: bold;
}

.showDetail .pointList {
    left: -250px;
}

.showDetail .detailBox {
    left: 0;
}

.actionBar {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 26px;
    box-shadow: 0px -5px 5px rgba(0, 0, 0, .15);
    user-select: none;
    cursor: pointer;
}

.actionBar .btn:hover {
    color: #3d6dcc;
}

.detailActionBar {
    display: flex;
    justify-content: space-around;
}

p {
    margin: 0;
}
</style>
  