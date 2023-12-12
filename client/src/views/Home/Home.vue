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
          <button @click="test">test</button>
          <button @click="isEditorDis = !isEditorDis">{{ isEditorDis ? "编辑" : "阅读" }}</button>
          <button @click="saveNote">保存</button>
        </div>
      </div>
      <ul class="r-tag">
        <li v-for="i in 3" :key="i"></li>
      </ul>
    </div>
    <ul class="fliover">
      <li></li>
      <li></li>
    </ul>
    <div class="insert poa-center" @click="insertNote"></div>
    <div class="deco-line poa-center"></div>

    <Modal1 v-if="isHintSaveShow" title="提示" body="当前内容尚未保存, 是否继续" btn-l="取消" btn-r="确定"
    @cancelEvent="isHintSaveShow=false" @confirmEvent="reqInsertNote"/>

  </div>
  
</template>

<script setup>
import {ref, reactive, onActivated, onMounted} from "vue"
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import Editor from '@tinymce/tinymce-vue'
import myCos from "../../utils/cos"
import Modal1 from "../../components/Modal1.vue"

const myEditor = ref()
const curContent = ref(``), oldContent = ref(""), isEditorDis = ref(false), curPageNum = ref(0), isSaved = ref(false), 
isHintSaveShow = ref(false)


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
  if (curContent.value) reqSave({content: curContent.value, curPageNum: curPageNum.value})
}

function reqSave ({content, curPageNum}) {
  fetch("/api/doc/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({content, curPageNum})
  })
  .then(res => res.json())
  .then(({err}) => {
    if (!err) {
      alert("save success!")
    }
  })
}

/* 获取 */
function reqGetContent (pageNum) {
  fetch(`/api/doc/getContent?pageNum=${pageNum}`)
  .then(res => res.json())
  .then(({err, content}) => {
    if (!err) {
      tinymce.activeEditor.execCommand('InsertHTML', false, content);
      oldContent.value = content
    }
  })
}

/* 插入 */
function insertNote () {
  if (curContent.value == oldContent.value) {
    if (curContent.value) reqInsertNote() // 未编辑修改且有内容时直接增加
    // 无内容时，不需要操作（不允许空笔记）
  } else {
    isHintSaveShow.value = true
  }
}

function reqInsertNote () {
  fetch(`/api/doc/insertNote?curPageNum=${curPageNum.value}`)
  .then(res => res.json())
  .then(({err}) => {
    console.log(err)
    if (!err) {
      emptyNote()
    }
  })
}

/* 清空 */
function emptyNote () {tinymce.activeEditor.execCommand('InsertHTML', false, "");}


onMounted(()=>{
  setTimeout(()=>{
    reqGetContent(0)
  },1000)

})
</script>

<style scoped lang="scss">
  @import './Home.scss';
</style>
