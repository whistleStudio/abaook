import COS from 'cos-js-sdk-v5'

const BUCKET = 'abaook-1300400818'
const REIGON = 'ap-nanjing'

const cos = new COS({
    // getAuthorization 必选参数
    getAuthorization: function (options, callback) {
        const url = '/api/sts/getCred'; // url 替换成您自己的后端服务
        const xhr = new XMLHttpRequest();
        let data = null;
        let credentials = null;
        xhr.open('GET', url, true);
        xhr.onload = function (e) {
            try {
              data = JSON.parse(e.target.responseText);
              credentials = data.credentials;
              console.log("comment later!!!", credentials);
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

// let uploadFile = ref('uploadFile')

function upload(file, tinyEditor) {
  // console.log(uploadFile.value.files[0])

  // fetch("/api/hello")
  // .then(res => res.json()
  // .then(data => console.log(data)))

  cos.uploadFile({
    Bucket: BUCKET, /* 填入您自己的存储桶，必须字段 */
    Region: REIGON,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
    Key: file.name,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
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
      console.log("err----", err);
      if (!err) {
        tinyEditor.activeEditor.execCommand('InsertImage', false, `https://${data.Location}`)
      }
  });

}

export default {
  cosUpload: upload
}