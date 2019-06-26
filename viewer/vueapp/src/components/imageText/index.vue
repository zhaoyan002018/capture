<template>
  <div id="imageText">
    <el-row style="height: 100%;position: relative;">
      <el-col :span="8">
        <div class="imageTitle">替换logo</div>
        <div class="upload">
          <el-upload action="/oem/modifylogo" :file-list="fileList"
                     :limit="1" list-type="picture" drag
                     :on-success="ScUpload"
                     :on-error="ErUpload"
                     :before-upload="bfUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">
              <div>只能上传jpg/png文件，且不能超过50k</div>
            </div>
          </el-upload>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="imageTitle">替换ICO图标</div>
        <div class="upload">
          <el-upload action="/oem/modifyfavicon" :file-list="fileList"
                     :limit="1" list-type="picture" drag
                     :on-success="ScUpload"
                     :on-error="ErUpload"
                     :before-upload="bfIcoUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">
              <div>只能上传ICO文件，大小为32*32</div>
            </div>
          </el-upload>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="imageTitle">替换其他信息</div>
        <el-form class="imageBody" ref="pageSet" :model="pageSet" label-position="right" label-width="120px">
          <el-form-item label="网页标题">
            <el-input v-model="pageSet.titleConfig"></el-input>
          </el-form-item>
          <el-form-item label="登录页表单标题">
            <el-input v-model="pageSet.welcome"></el-input>
          </el-form-item>
          <el-form-item label="登录页公司显示">
            <el-input v-model="pageSet.company"></el-input>
          </el-form-item>
          <el-form-item label="网页链接">
            <el-input v-model="pageSet.webSite"></el-input>
          </el-form-item>
          <el-form-item label="页脚公司">
            <el-input v-model="pageSet.shortCompany"></el-input>
          </el-form-item>
          <el-form-item label="版本信息">
            <el-input v-model="pageSet.version"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="pageSet.showLogo">logo图片不是透明的</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Confirm()">确定</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { notify, isContinue } from '../../api/validate';

export default {
  data () {
    return {
      fileList: [],
      imageList: '',
      pageSet: {}
    };
  },
  mounted () {
    this.getPageSet();
  },
  methods: {
    onSubmit: function () {
      this.axios.post('/oem/modifyconf', this.pageSet).then(res => {
        if (res.data.success) {
          window.location = '/logout';
        } else {
          notify(this, res.data.message, 'error');
        }
      });
    },
    bfUpload: function (file) {
      let is50K = file.size / 1024 < 50;
      let isPng = file.name.endsWith('.png');
      if (!is50K) {
        notify(this, '图片太大，上传失败,不可小于50K', 'error');
      }
      if (!isPng) {
        notify(this, '只能上传png文件', 'error');
      }
      return is50K && isPng;
    },
    bfIcoUpload: function (file) {
      let is50K = file.size / 1024 < 5;
      let isIco = file.name.endsWith('.ico');
      if (!is50K) {
        notify(this, '图片太大，上传失败,图片大小为32*32', 'error');
      }
      if (!isIco) {
        notify(this, '只能上传ICO文件', 'error');
      }
      return is50K && isIco;
    },
    Confirm () {
      let that = this;
      isContinue(that, this.onSubmit, '', '替换完成后需要重新登录，是否继续');
    },
    ScUpload (res, file) {
      if (res.success) {
        notify(this, `${file.name}上传成功,请主动刷新页面`, 'success');
      } else {
        notify(this, res.message, 'error');
      }
    },
    ErUpload (err, file) {
      notify(this, `${file.name}上传失败`, 'error');
    },
    getPageSet () {
      this.axios.get('/oem/listconf').then((res) => {
        this.pageSet = JSON.parse(JSON.stringify(res.data));
      }).catch((err) => {
        console.log('err', err);
      });
    }
  }
};
</script>
<style scoped>
  #imageText{
    padding: 1% 1%;
    height: 100%;
  }
  .upload{
    position: absolute;
    left: 45%;
    top: 55px;
    transform: translateX(-50%);
  }
  .imageTitle{
    position: absolute;
    top: 0px;
    font-size: 25px;
    padding: 0 5px;
    left: 40%;
    font-family: monospace;
    font-weight: 100;
    font-style: oblique;
    transform: rotateX(30deg);
  }
  .imageBody{
    position: absolute;
    left: 6%;
    top: 55px;
    width: 83%;
  }
  .isTransparent{
    position: fixed;
    top: 331px;
  }
</style>
