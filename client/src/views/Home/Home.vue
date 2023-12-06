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
        <input type="file" ref="uploadFile">
        <button @click="upload">up</button>
      </div>
      <ul class="r-tag">
        <li v-for="i in 3" :key="i"></li>
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
import COS from 'cos-js-sdk-v5'

const calendarOptions = reactive({
  plugins: [ dayGridPlugin, interactionPlugin ],
  initialView: 'dayGridMonth',
});

const tinymceInit = reactive({
  selector: 'textarea#file-picker',
  plugins: 'image code',
  toolbar: 'undo redo | link image | code',
  language: 'zh-Hans',
  // 花时间
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

/* cos */

const BUCKET = 'abaook-1300400818'
const REIGON = 'ap-nanjing'

const cos = new COS({
    // getAuthorization 必选参数
    getAuthorization: function (options, callback) {
        console.log("xxx");
        const url = 'http://127.0.0.1:8011/api/sts'; // url 替换成您自己的后端服务
        const xhr = new XMLHttpRequest();
        let data = null;
        let credentials = null;
        xhr.open('GET', url, true);
        xhr.onload = function (e) {
            try {
              data = JSON.parse(e.target.responseText);
              credentials = data.credentials;
              console.log(credentials);
            } catch (e) {
            }
            if (!data || !credentials) {
              return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
            };
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              SecurityToken: credentials.sessionToken,
              // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
              ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
          });
        };
        xhr.send();
    }
});

let uploadFile = ref('uploadFile')

function upload() {
  cos.uploadFile({
    Bucket: BUCKET, /* 填入您自己的存储桶，必须字段 */
    Region: REIGON,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
    Key: '1.jpg',  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: uploadFile.value, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
    SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */
    onTaskReady: function(taskId) {                   /* 非必须 */
        console.log(taskId);
    },
    onProgress: function (progressData) {           /* 非必须 */
        console.log(JSON.stringify(progressData));
    },
    onFileFinish: function (err, data, options) {   /* 非必须 */
       console.log(options.Key + '上传' + (err ? '失败' : '完成'));
    },
    // 支持自定义headers 非必须
    // Headers: {
    //   'x-cos-meta-test': 123
    // },
}, function(err, data) {
    console.log(err || data);
});

}


console.log("home over")
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
