const express = require("express")
var STS = require('qcloud-cos-sts');

const rt = express.Router()

// 配置参数
var config = {
  secretId: 'AKIDSs7at1zkJekOp21mJpLk05xc3OZjv5A3', // 固定密钥
  secretKey: 'kHckePzLTPDpCSfkdK3e1A63pOktoW1S', // 固定密钥
  proxy: '',
  durationSeconds: 1800,
  // host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
  endpoint: 'sts.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com

  // 放行判断相关参数
  bucket: 'abaook-1300400818',
  region: 'ap-nanjing',
  allowPrefix: '*', // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
  // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
  allowActions: [
      // 简单上传
      'name/cos:PutObject',
      'name/cos:PostObject',
      // 分片上传
      'name/cos:InitiateMultipartUpload',
      'name/cos:ListMultipartUploads',
      'name/cos:ListParts',
      'name/cos:UploadPart',
      'name/cos:CompleteMultipartUpload'
  ],
};

// 临时密钥接口
rt.get('/getCred', (req, res) => {
  console.log("sts")
  // TODO 这里根据自己业务需要做好放行判断

  // 获取临时密钥
  var shortBucketName = config.bucket.substr(0 , config.bucket.lastIndexOf('-'));
  var appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'));
  var policy = {
      'version': '2.0',
      'statement': [{
          'action': config.allowActions,
          'effect': 'allow',
          'principal': {'qcs': ['*']},
          'resource': [
              'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + config.allowPrefix,
          ],
      }],
  };
  STS.getCredential({
      secretId: config.secretId,
      secretKey: config.secretKey,
      proxy: config.proxy,
      durationSeconds: config.durationSeconds,
      endpoint: config.endpoint,
      policy: policy,
  }, function (err, tempKeys) {
      var result = JSON.stringify(err || tempKeys) || '';
      res.send(result)
      // res.json({data: result});
  });

  // res.json({tag: "sts"})
});

module.exports = rt