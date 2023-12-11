<template>
  <div class="main flex-row">
    <div class="left">
      <FullCalendar class="calen" :options="calendarOptions" />
    </div>
    <div class="right flex-row">
      <div class="r-content">
        <!-- <img alt="Vue logo" class="logo" src="../../assets/logo.svg" width="125" height="125" /> -->
        <Editor ref="myEditor" id="myEditor" v-model="editorContent"
          api-key="8iqq40o18n64rab68l24qiagwsbd0veublv5x5hey61sjdr6"
          :init = "tinymceInit"
          :disabled="isEditorDis"
        />
        <!-- <textarea id="myEditor">Hello, World!</textarea> -->
        <!-- <input type="file" ref="uploadFile"> -->
        <button @click="setTinyContent">up</button>
        <button @click="isEditorDis = !isEditorDis">disabled</button>
        <button @click="console.log(editorContent)">get</button>
      </div>
      <ul class="r-tag">
        <li v-for="i in 3" :key="i"></li>
      </ul>
    </div>
    <ul class="fliover">
      <li></li>
      <li></li>
    </ul>
    <div class="deco-line poa-center"></div>
  </div>
</template>

<script setup>
import {ref, reactive, onActivated, onMounted} from "vue"
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import Editor from '@tinymce/tinymce-vue'
import myCos from "../../utils/cos"

const editorContent = ref(``);

const calendarOptions = reactive({
  plugins: [ dayGridPlugin, interactionPlugin ],
  initialView: 'dayGridMonth',
});
// 富文本编辑器设置
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
  // language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@2.0.2/dist/tinymce/langs/zh-Hans.js',
  language_url: 'https://abaook-1300400818.cos.ap-nanjing.myqcloud.com/tingymce/zh-Hans.js',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
});

let content = `
<h1>Hello from Tiny!</h1>
<p>This is Editor Content!</p>
`;
onMounted(()=>{
  // setTimeout(()=>{tinymce.onS},1000)

})

function setTinyContent() {
  tinymce.activeEditor.execCommand('Italic');
  tinymce.activeEditor.execCommand('InsertImage', false, 'https://abaook-1300400818.cos.ap-nanjing.myqcloud.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-11%20224608.png');
}

const myEditor = ref()
const isEditorDis = ref(false)

console.log("home over")
</script>

<style scoped lang="scss">
  @import './Home.scss';
</style>
