<template>
  <div class="main flex-row">
    <div class="left">
      <FullCalendar class="calen" :options="calendarOptions" />
    </div>
    <div class="right flex-row">
      <div class="r-content">
        <!-- <img alt="Vue logo" class="logo" src="../../assets/logo.svg" width="125" height="125" /> -->
        <Editor ref="myEditor" id="myEditor" v-model="curContent"
          api-key="8iqq40o18n64rab68l24qiagwsbd0veublv5x5hey61sjdr6"
          :init = "tinymceInit"
          :disabled="isEditorDis"
        />
        <div class="r-content-foot flex-row">
          <div class="icon" @click="isEditorDis = !isEditorDis" 
          :style="{backgroundImage: isEditorDis ? 'url(https://abaook-1300400818.cos.ap-nanjing.myqcloud.com/abao/home/icons/icon_edit.png)':'url(https://abaook-1300400818.cos.ap-nanjing.myqcloud.com/abao/home/icons/icon_read.png)'}"></div>
          <div class="icon" @click="saveNote" 
          :style="{backgroundImage: 'url(https://abaook-1300400818.cos.ap-nanjing.myqcloud.com/abao/home/icons/icon_save.png)'}"></div>
          <!-- <button @click="test">test</button>
          <button @click="isEditorDis = !isEditorDis">{{ isEditorDis ? "编辑" : "阅读" }}</button>
          <button @click="saveNote">保存</button>
          <button>第{{ curPageNum }}页</button> -->
        </div>
      </div>
      <!-- <ul class="r-tag">
        <li v-for="i in 3" :key="i"></li>
      </ul> -->
    </div>
    <ul class="fliover">
      <li @click="flioverClick(-1)"></li>
      <li @click="flioverClick(1)"></li>
    </ul>
    <div class="insert poa-center" @click="insertNote"></div>
    <div class="deco-line poa-center"></div>

    <Modal1 v-if="modalType" title="🙀" :body="modalList[modalType]" btn-l="取消" btn-r="确定"
    @cancelEvent="modalType=0" @confirmEvent="modalConfirm"/>

    <div class="logo"></div>
  </div>
  
</template>

<script setup>
import {ref, reactive, onActivated, onMounted, onUnmounted, onBeforeUnmount} from "vue"
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import Editor from '@tinymce/tinymce-vue'
import myCos from "../../utils/cos"
import Modal1 from "../../components/Modal1.vue"

const myEditor = ref()
const curContent = ref(``), isEditorDis = ref(false), curPageNum = ref(0), isSaved = ref(false),
// 0-隐藏；1-保存；2-清空 
modalType = ref(0)
const modalList = {
  0: "",
  1: "当前内容未保存，是否插入新纸张",
  2: "当前内容为空，是否删除此页",
  3: "当前内容未保存，是否翻至下一页",
  "-3": "当前内容未保存，是否翻至上一页", 
}

let oldContent = ""
let isInserted = false

/* 日历 */
const calendarOptions = reactive({
  plugins: [ dayGridPlugin, interactionPlugin ],
  initialView: 'dayGridMonth',
});
/* 富文本 */
const tinymceInit = reactive({
  selector: '#myEditor',
  // plugins: 'image ',
  toolbar: 'my-image',
  setup: (editor) => {
    editor.ui.registry.addButton('my-image', {
      icon: 'image',
      // onAction: () => editor.windowManager.open(dialogConfig)
      onAction: () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.addEventListener('change', (e) => {
          const file = e.target.files[0];
          console.log(file)
          myCos.cosUpload(file, tinymce)
          // upload(file)
        })
        input.click()
      }
    })
  },
  language: 'zh-Hans',
  // language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@2.0.2/dist/tinymce/langs/zh-Hans.js', // 官方
  language_url: 'https://abaook-1300400818.cos.ap-nanjing.myqcloud.com/tingymce/zh-Hans.js',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
});

/* 保存 */
function saveNote () {
  if (curContent.value) {
    reqSave({content: curContent.value, curPageNum: curPageNum.value, isInserted})
    // oldContent = curContent.value
  } else if (oldContent) {
    // 清空文本后保存，提示是否删除
    modalType.value = 2
  }
}

function reqSave ({content, curPageNum, isInserted}) {
  fetch("/api/doc/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({content, curPageNum, isInserted})
  })
  .then(res => res.json())
  .then(({err}) => {
    if (!err) {
      alert("😸保存成功")
      oldContent = curContent.value
      isInserted = false // 若是插入，成功保存后，改变状态
    }
  })
}

/* 删除(保存空) */
function reqDelNote () {
  fetch(`/api/doc/delNote?curPageNum=${curPageNum.value}`)
  .then(res => res.json())
  .then(({err}) => {
    console.log("del ", err)
    emptyNote()
    ;(async () => {
      const err = await reqGetContent(curPageNum.value)
      if (err == -1) isInserted = true
    })()
  })
}

/* 获取 */
function reqGetContent (pageNum) {
  return new Promise((rsv, rej) => {
    fetch(`/api/doc/getContent?pageNum=${pageNum}`)
    .then(res => res.json())
    .then(({err, content}) => {
      if (!err) {
        curContent.value = content
        oldContent = curContent.value
        isInserted = false
      }
      rsv(err) 
    })
  })
}

/* 插入 */
function insertNote () {
  if (curContent.value == oldContent) {
    if (curContent.value) {emptyNote(); isInserted = true} // 未编辑修改且有内容时直接增加
    // 无内容时，不需要操作（不允许空笔记）
  } else {
    modalType.value = 1
  }
}

// function reqInsertNote () {
//   fetch(`/api/doc/insertNote?curPageNum=${curPageNum.value}`)
//   .then(res => res.json())
//   .then(({err}) => {
//     console.log(err)
//     if (!err) {
//       emptyNote()
//       isInserted = true
//     }
//   })
// }

/* 取消插入 */
// function cancelInsertNote () { console.log("ccc");if (isInserted && !oldContent) reqCancelInsertNote() }

// function reqCancelInsertNote () {
//   return new Promise((rsv, rej) => {
//     fetch(`/api/doc/cancelInsertNote?curPageNum=${curPageNum.value}`)
//       .then(res => res.json())
//       .then(({err}) => {
//         console.log("cancel ", err)
//         rsv(err)
//       })
//   })
// }



/* 内容清空 */
function emptyNote () {curContent.value="";oldContent="";console.log("empty");}

/* 翻页 */
function flioverClick (overPages) {
  if (curPageNum.value == 0 && overPages<0) alert("😼 已经是首页咯")
  else {
    if (curContent.value == oldContent) {
      ;(async () => {
        // if (isInserted) await reqCancelInsertNote()
        if (isInserted && overPages>0) overPages = 0 
        const err = await reqGetContent(curPageNum.value + overPages)
        if (!err) {curPageNum.value += overPages}
        else if (err == -1) alert("😼 已经是最后一页咯")
      })()
    } else {
      // 内容有未保存改动
      modalType.value = 3 * overPages
    }
  }
}

/* 模态框确定 */
function modalConfirm () {
  switch (modalType.value) {
    case 1: emptyNote(); isInserted = true; break;
    case 2: reqDelNote(); break;
    case 3, -3:
      const f = modalType.value 
      ;(async () => {
        // if (!oldContent && isInserted) {
        //   // 当前为插入页, 需要先丢弃
        //   await reqCancelInsertNote()
        // }
        let dp = 0;
        if (f < 0) dp = -1
        else if (!isInserted) dp = 1
        const err = await reqGetContent(curPageNum.value + dp) // 下一页, curPageNum不变；上一页, curPageNum-1
        if (!err) curPageNum.value += dp
        else if (err == -1) alert("😼 已经是最后一页咯")
      })()
      break;
  }
  modalType.value = 0
}

onMounted(()=>{
  setTimeout(()=>{
    ;(async () => {
      const err = await reqGetContent(0)
      if (err == -1) isInserted = true
    })()
  },1000)
})

onBeforeUnmount(() => {
  // cancelInsertNote()
})
</script>

<style scoped lang="scss">
  @import './Home.scss';
</style>
