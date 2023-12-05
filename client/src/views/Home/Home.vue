<template>
  <div class="main flex-row">
    <FullCalendar class="left" :options="calendarOptions" />
    <div class="right flex-row">
      <div class="r-content box-grey">
        <img alt="Vue logo" class="logo" src="../../assets/logo.svg" width="125" height="125" />
        <Editor
          api-key="8iqq40o18n64rab68l24qiagwsbd0veublv5x5hey61sjdr6"
          :init="tinymceInit"
        />
      </div>
      <ul class="r-tag">
        <li v-for="i in 3"></li>
      </ul>
    </div>
    <ul class="fliover">
      <li>&lt;</li>
      <li>&gt;</li>
    </ul>
  </div>
</template>

<script setup>
import {ref, reactive} from "vue"
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import Editor from '@tinymce/tinymce-vue'


const calendarOptions = reactive({
  plugins: [ dayGridPlugin, interactionPlugin ],
  initialView: 'dayGridMonth',
});

const tinymceInit = reactive({
  selector: 'textarea#file-picker',
  plugins: 'image code',
  toolbar: 'undo redo | link image | code',
  language: 'zh-Hans',
  language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@2.0.2/dist/tinymce/langs/zh-Hans.js',
  image_title: true,
  automatic_uploads: true,
  file_picker_types: 'image',
  file_picker_callback: (cb, value, meta) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
        const id = 'blobid' + (new Date()).getTime();
        const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(',')[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* call the callback and populate the Title field with the file name */
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  },
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
});
</script>

<style scoped lang="scss">
  .main {
    // background-color: red;
    justify-content: space-between;
    position: relative;
    .left {
      width: 49%;
    }
    .right {
      width: 49%;
      height: 100%;
      position: relative;
      // background-color: orange;
      .r-content {
        width: calc(100% - 3rem);
        height: 90%;
      }
      ul.r-tag {
        position: absolute;
        top: 5%;
        right: 0;
        li {
          width: 3rem;
          height: 10rem;
          box-sizing: border-box;
          border: 1px solid burlywood;
        }
      }
    }
    ul.fliover {
      width: 100%;
      position: absolute;
      li {
        width: 3rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        &:first-of-type {
          left: -3rem;
        }
        &:last-of-type {
          right: -3rem;
        }
      }
    }
  }
</style>
