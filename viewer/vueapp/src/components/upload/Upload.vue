<template>

<div id="upload">

  <div class="sub-navbar">
    <span class="sub-navbar-title">
      <span class="fa-stack">
        <span class="fa fa-upload fa-stack-1x">
        </span>
        <span class="fa fa-square-o fa-stack-2x">
        </span>
      </span>&nbsp;
      {{$t('Upload File')}}
    </span>
    <div class="pull-right toast-container" style="font-size: 80%; font-weight: 400">
      <moloch-toast
        class="mr-1"
        :message="msg"
        :type="msgType"
        :done="messageDone">
      </moloch-toast>
    </div>
  </div>
  <div class="container">
    <div id="top">
      <div id="file_drop_target">
        <div style="position: absolute;left: 28%;font-size: 19px;color: #cccccc;">
          拖拽到此处文件上传
          <b>或者</b>
        </div>
        <input type="file" style="width: 100%;padding: 0 0 0 45%;height: 100%;" ref="file" multiple accept=".pcap" @change="handleFile"/>
      </div>
      <el-table stripe :data="data">
        <el-table-column label="文件名" align="center">
          <template slot-scope="scope">
            <img src="@/assets/pcap.png" style="width: 20px;">
            <span style="display: inline-block;line-height: 27px;">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件大小" align="center">
          <template slot-scope="scope">
            {{ scope.row.changeSize }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">
            {{new Date(parseInt(scope.row.lastModified)).toLocaleString().replace(/[\u4e00-\u9fa5]+/g, '')}}
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center">
          <template slot-scope="scope">
            <el-input v-model="tags" placeholder="tags"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span v-if="!success && rate">{{ rate }}%</span>
            <el-button v-if="!success" size="mini" type="info" @click="Confirm(scope.row, 'upload')">上传</el-button>
            <el-button v-if="success" size="mini" type="info" @click="Confirm(scope.row, 'add')">导入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="upload_progress"></div>
  </div>
  <!-- file upload error -->
  <moloch-error
    v-if="error"
    :message-html="error"
    class="mt-5 mb-5">
  </moloch-error> <!-- /file upload error -->
</div>

</template>

<script>
import Vue from 'vue';
import MolochToast from '../utils/Toast';
import MolochError from '../utils/Error';
import {isContinue, changeSize, notify} from '../../api/validate';

export default {
  name: 'MolochUpload',
  components: { MolochToast, MolochError },
  data: function () {
    return {
      // file: '',
      tags: '',
      rate: '',
      success: false,
      uploading: false,
      error: '',
      msg: '',
      msgType: undefined,
      filename: '',
      data: []
    };
  },
  compputed: {
    file: {
      get: function () {
        return this.$store.state.file;
      },
      set: function (newVal) {
        this.$store.commit('setFile', newVal);
      }
    }
  },
  methods: {
    handleFile: function () {
      this.file = this.$refs.file.files[0];
      this.file.changeSize = changeSize(this.file.size);
      this.data.push(this.file);
    },
    Confirm: function (file, msg) {
      switch (msg) {
        case 'add': isContinue(this, this.importFile, '', `是否要导入文件${file.name}`); break;
        case 'upload': isContinue(this, this.uploadFile, '', `是否要上传文件${file.name}`); break;
      }
    },
    importFile: function () {
      let filename = this.filename;
      let tags = this.tags;
      Vue.axios.post('/import', {filename: filename, tags: tags}).then((res) => {
        if (res.data.success) {
          notify(this, `${this.file.name}导入成功`, 'success');
          for (let i in this.data) {
            if (this.file.name === this.data[i].name) {
              this.data.splice(i, 1);
              break;
            }
          }
          this.success = false;
          this.rate = 0;
          this.filename = '';
          this.file = '';
          this.error = '';
          this.$refs.file.value = null;
        } else {
          notify(this, res.data.message, 'error');
        }
      });
    },
    uploadFile: function () {
      let vm = this;
      this.uploading = true;

      let formData = new FormData();

      formData.append('file', this.file);
      formData.append('tags', this.tags);
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: function (e) {
          if (e.lengthComputable) {
            vm.rate = parseInt((e.loaded / e.total) * 100);
          }
        }
      };
      Vue.axios.post(
        'upload',
        formData, config
      ).then((res) => {
        this.success = true;
        if (res.data.success) {
          this.filename = res.data.filename;
          notify(this, `${this.file.name}上传成功`, 'success');
        }
      }).catch((error) => {
        this.error = error;
        this.uploading = false;
        notify(this, error, 'error');
      });
    },
    /* remove the message when user is done with it or duration ends */
    messageDone: function () {
      this.msg = '';
      this.msgType = undefined;
    }
  }
};
</script>

<style scoped>
  #top {
    height:52px;
  }
  #upload_progress {
    padding: 4px 0;
  }
  #upload_progress .error {
    color:#a00;
  }
  #upload_progress > div {
    padding:3px 0;
  }
  #file_drop_target {
    width: 100%;
    padding:25px 0;
    height: 120px;
    border: 1px dashed #ccc;
    font-size:16px;
    color:#ccc;
    text-align: center;
    float:left;
    margin-right:20px;
    border-bottom: transparent;
  }
  .container {
    position: relative;
    top: 60px;
    max-width: 100% !important;
  }
</style>
