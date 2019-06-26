<template>

  <div class="packet-search-page ml-2 mr-2">

    <!-- search navbar -->
    <moloch-search
      v-if="user.settings"
      :start="sessionsQuery.start"
      :timezone="user.settings.timezone"
      :hide-actions="true"
      :hide-interval="true"
      @changeSearch="loadSessions">
    </moloch-search> <!-- /search navbar -->

    <div>&nbsp;</div>

    <!-- hunt create navbar -->
    <form class="hunt-create-navbar">
      <div class="mt-1 ml-1 mr-1">
        <button type="button"
          v-if="!createFormOpened"
          @click="createFormOpened = true"
          class="btn btn-theme-tertiary btn-sm pull-right">
          创建一个Packet搜索任务
        </button>
        <div class="mt-1" style="display:inline-block;">
          <span class="fa fa-info-circle fa-fw">
          </span>&nbsp;
          创建一个Packet搜索任务将会在
          <strong>
            {{ sessions.recordsFiltered | commaString }}
          </strong>
          个会话的Packet中进行搜索
        </div>
      </div>
    </form> <!-- /hunt create navbar -->

    <!-- loading overlay -->
    <moloch-loading
      v-if="loading">
    </moloch-loading> <!-- /loading overlay -->

    <!-- packet search jobs content -->
    <div class="packet-search-content ml-2 mr-2">

      <!-- create new packet search job -->
      <div class="mb-3">
        <div v-if="createFormOpened"
          class="card">
          <form class="card-body"
            @keyup.enter="createJob">
            <div class="row">
              <div class="col-12">
                <div class="alert alert-info"
                  :class="{'alert-info':sessions.recordsFiltered < huntWarn,'alert-danger':sessions.recordsFiltered >= huntWarn}">
                  <em v-if="sessions.recordsFiltered > huntWarn">
                    由于会话数量较多，搜索任务将会比较耗时
                    <strong>
                      请谨慎操作
                    </strong>
                    <br>
                  </em>
                  <span class="fa fa-exclamation-triangle fa-fw">
                  </span>&nbsp;
                  确保上面过滤出来的会话仅包含您packet搜索必须的会话
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-lg-4 col-md-12">
                <!-- packet search job name -->
                <div class="input-group input-group-sm">
                  <span class="input-group-prepend cursor-help"
                    v-b-tooltip.hover
                    title="为packet搜索任务命名(多个任务可以有相同的名称）">
                    <span class="input-group-text">
                      Name
                    </span>
                  </span>
                  <input type="text"
                    v-model="jobName"
                    v-focus-input="true"
                    placeholder="命名您的packet搜索任务"
                    class="form-control"
                    maxlength="40"
                  />
                </div> <!-- /packet search job name -->
              </div>
              <!-- packet search size -->
              <div class="form-group col-lg-4 col-md-12">
                <div class="input-group input-group-sm">
                  <span class="input-group-prepend">
                    <span class="input-group-text">
                      每个会话最大检测packet数量
                    </span>
                  </span>
                  <select class="form-control"
                    v-model="jobSize"
                    style="-webkit-appearance: none;">
                    <option value="50">50 packets</option>
                    <option value="500">500 packets</option>
                    <option value="5000">5000 packets</option>
                    <option value="10000">All packets</option>
                  </select>
                </div>
              </div> <!-- /packet search size -->
              <!-- notifier -->
              <div class="form-group col-lg-4 col-md-12">
                <div class="input-group input-group-sm">
                  <span class="input-group-prepend cursor-help"
                    v-b-tooltip.hover
                    title="Notifies upon completion">
                    <span class="input-group-text">
                      通知
                    </span>
                  </span>
                  <select class="form-control"
                    v-model="jobNotifier"
                    style="-webkit-appearance: none;">
                    <option value=undefined>none</option>
                    <option v-for="notifier in notifiers"
                      :key="notifier.name"
                      :value="notifier.name">
                      {{ notifier.name }} ({{ notifier.type }})
                    </option>
                  </select>
                </div>
              </div> <!-- /notifier -->
            </div>
            <div class="row">
              <!-- packet search text & text type -->
              <div class="form-group col-lg-6 col-md-12">
                <div class="input-group input-group-sm">
                  <span class="input-group-prepend cursor-help"
                    v-b-tooltip.hover
                    title="Search for this text in packets">
                    <span class="input-group-text">
                      <span class="fa fa-search">
                      </span>
                    </span>
                  </span>
                  <input type="text"
                    v-model="jobSearch"
                    placeholder="搜索packet条件"
                    class="form-control"
                  />
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input"
                    :checked="jobSearchType === 'ascii'"
                    @click="setJobSearchType('ascii')"
                    type="radio"
                    id="ascii"
                    value="ascii"
                    name="packetSearchTextType"
                  />
                  <label class="form-check-label"
                    for="ascii">
                    ascii
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input"
                    :checked="jobSearchType === 'asciicase'"
                    @click="setJobSearchType('asciicase')"
                    type="radio"
                    id="asciicase"
                    value="asciicase"
                    name="packetSearchTextType"
                  />
                  <label class="form-check-label"
                    for="asciicase">
                    ascii (case sensitive)
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input"
                    :checked="jobSearchType === 'hex'"
                    @click="setJobSearchType('hex')"
                    type="radio"
                    id="hex"
                    value="hex"
                    name="packetSearchTextType"
                  />
                  <label class="form-check-label"
                    for="hex">
                    hex
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input"
                    :checked="jobSearchType === 'regex'"
                    @click="setJobSearchType('regex')"
                    type="radio"
                    id="regex"
                    value="regex"
                    name="packetSearchTextType"
                  />
                  <label class="form-check-label"
                    for="regex">
                    regex
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input"
                    :checked="jobSearchType === 'hexregex'"
                    @click="setJobSearchType('hexregex')"
                    type="radio"
                    id="hexregex"
                    value="hexregex"
                    name="packetSearchTextType"
                  />
                  <label class="form-check-label"
                    for="hexregex">
                    hex regex
                  </label>
                </div>
              </div> <!-- /packet search text & text type -->
              <!-- packet search direction -->
              <div class="form-group col-lg-3 col-md-12">
                <div class="form-check">
                  <input class="form-check-input"
                    :checked="jobSrc"
                    @click="jobSrc = !jobSrc"
                    type="checkbox"
                    id="src"
                    value="src"
                  />
                  <label class="form-check-label"
                    for="src">
                    搜索客户端数据包
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input"
                    :checked="jobDst"
                    @click="jobDst = !jobDst"
                    type="checkbox"
                    id="dst"
                    value="dst"
                  />
                  <label class="form-check-label"
                    for="dst">
                    搜索目的段数据包
                  </label>
                </div>
              </div> <!-- /packet search direction -->
              <!-- packet search type -->
              <div class="form-group col-lg-3 col-md-12">
                <div class="form-check">
                  <input class="form-check-input"
                    :checked="jobType === 'raw'"
                    @click="setJobType('raw')"
                    type="radio"
                    id="raw"
                    value="raw"
                    name="packetSearchType"
                  />
                  <label class="form-check-label"
                    for="raw">
                    搜索原始数据包
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input"
                    :checked="jobType === 'reassembled'"
                    @click="setJobType('reassembled')"
                    type="radio"
                    id="reassembled"
                    value="reassembled"
                    name="packetSearchType"
                  />
                  <label class="form-check-label"
                    for="reassembled">
                    搜索重组数据包
                  </label>
                </div>
              </div> <!-- /packet search type -->
            </div>
            <div class="row">
              <div class="col-12 mt-1">
                <div v-if="createFormError"
                  class="pull-left alert alert-danger alert-sm">
                  <span class="fa fa-exclamation-triangle">
                  </span>&nbsp;
                  {{ createFormError }}
                </div>
                <!-- create search job button -->
                <button type="button"
                  @click="createJob"
                  class="pull-right btn btn-theme-tertiary pull-right ml-1">
                  <span class="fa fa-plus fa-fw">
                  </span>&nbsp;
                  Create
                </button> <!-- /create search job button -->
                <!-- cancel create search job button -->
                <button type="button"
                  @click="cancelCreateForm"
                  class="pull-right btn btn-warning pull-right">
                  <span class="fa fa-ban fa-fw">
                  </span>&nbsp;
                  Cancel
                </button> <!-- /cancel create search job button -->
              </div>
            </div>
          </form>
        </div>
      </div> <!-- /create new packet search job -->

      <h4 v-if="results.length">
        <span class="fa fa-list-ol">
        </span>&nbsp;
        Hunt Job Queue
      </h4>

      <!-- hunt job queue errors -->
      <div v-if="queuedListError"
        class="alert alert-danger">
        {{ queuedListError }}
      </div>
      <div v-if="queuedListLoadingError"
        class="alert alert-danger">
        加载流量猎手任务队列错误:
        {{ queuedListLoadingError }}
      </div> <!-- /hunt job queue errors -->

      <table v-if="results.length"
        class="table table-sm table-striped mb-4">
        <thead>
          <tr>
            <th width="40px">&nbsp;</th>
            <th>
              状态
            </th>
            <th>
              匹配结果
            </th>
            <th>
              名称
            </th>
            <th>
              用户
            </th>
            <th>
              搜索内容
            </th>
            <th>
              通知
            </th>
            <th>
              是否创建
            </th>
            <th>
              ID
            </th>
            <th width="140px">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <!-- packet search jobs -->
          <template v-for="job in results">
            <tr :key="`${job.id}-row`">
              <td>
                <toggle-btn
                  v-if="user.userId === job.userId || user.createEnabled"
                  :opened="job.expanded"
                  @toggle="toggleJobDetail(job)">
                </toggle-btn>
              </td>
              <td>
                <span v-if="job.status === 'running'"
                  v-b-tooltip.hover
                  title="运行中"
                  class="fa fa-spinner fa-spin fa-fw cursor-help">
                </span>
                <span v-else-if="job.status === 'paused'"
                  v-b-tooltip.hover
                  title="暂停"
                  class="fa fa-pause fa-fw cursor-help">
                </span>
                <span v-else-if="job.status === 'queued'"
                  v-b-tooltip.hover
                  title="排队中"
                  class="fa fa-clock-o fa-fw cursor-help">
                </span>
                <span v-else-if="job.status === 'finished'"
                  v-b-tooltip.hover
                  title="已完成"
                  class="fa fa-check fa-fw cursor-help">
                </span>
                &nbsp;
                <span class="badge badge-secondary cursor-help"
                  :id="`jobmatches${job.id}`">
                  {{ ((job.searchedSessions / job.totalSessions) * 100) | round(1) }}%
                </span>
                <b-tooltip :target="`jobmatches${job.id}`">
                  Found {{ job.matchedSessions | commaString }} out of {{ job.searchedSessions | commaString }} sessions searched.
                  <div v-if="job.status !== 'finished'">
                    Still need to search {{ (job.totalSessions - job.searchedSessions) | commaString }} sessions.
                  </div>
                </b-tooltip>
                <span v-if="job.errors && job.errors.length"
                  class="badge badge-danger cursor-help">
                  <span class="fa fa-exclamation-triangle"
                    v-b-tooltip.hover
                    title="搜索期间出现错误， 打开任务查看详情">
                  </span>
                </span>
              </td>
              <td>
                {{ job.matchedSessions | commaString }}
              </td>
              <td>
                {{ job.name }}
              </td>
              <td>
                {{ job.userId }}
              </td>
              <td>
                <span v-if="user.userId === job.userId || user.createEnabled">
                  {{ job.search }} ({{ job.searchType }})
                </span>
              </td>
              <td>
                {{ job.notifier }}
              </td>
              <td>
                {{ job.created | timezoneDateString(user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z') }}
              </td>
              <td>
                {{ job.id }}
              </td>
              <td>
                <span v-if="user.userId === job.userId || user.createEnabled">
                  <button
                    @click="removeJob(job, 'results')"
                    type="button"
                    v-b-tooltip.hover
                    title="删除任务历史记录"
                    class="ml-1 pull-right btn btn-sm btn-danger">
                    <span class="fa fa-trash-o fa-fw">
                    </span>
                  </button>
                  <button type="button"
                    @click="openSessions(job)"
                    v-if="job.matchedSessions"
                    :id="`openresults${job.id}`"
                    class="ml-1 pull-right btn btn-sm btn-theme-primary">
                    <span class="fa fa-folder-open fa-fw">
                    </span>
                  </button>
                  <b-tooltip v-if="job.matchedSessions"
                    :target="`openresults${job.id}`">
                    在新的会话选项卡中打开 <strong>partial</strong> 结果
                    <br>
                    <strong>注意:</strong> 由于ES更新会话需要时间，因此需要等待一会才能展示您的结果
                  </b-tooltip>
                  <button v-if="job.status === 'running' || job.status === 'queued'"
                    @click="pauseJob(job)"
                    type="button"
                    v-b-tooltip.hover
                    title="Pause this job"
                    class="pull-right btn btn-sm btn-warning">
                    <span class="fa fa-pause fa-fw">
                    </span>
                  </button>
                  <button v-if="job.status === 'paused'"
                    @click="playJob(job)"
                    type="button"
                    v-b-tooltip.hover
                    title="运行此任务"
                    class="pull-right btn btn-sm btn-theme-secondary">
                    <span class="fa fa-play fa-fw">
                    </span>
                  </button>
                </span>
              </td>
            </tr>
            <tr :key="`${job.id}-detail`"
              v-if="job.expanded">
              <td colspan="10">
                <div class="row">
                  <div class="col-12">
                    流量猎手
                    <strong>[{{ job.status }}]</strong>
                  </div>
                </div>
                <div v-if="job.lastUpdated"
                  class="row">
                  <div class="col-12">
                    流量猎手任务最近更新时间:
                    <strong>
                      {{ job.lastUpdated | timezoneDateString(user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z') }}
                    </strong>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    检测ing
                    <strong v-if="job.size > 0">{{ job.size }}</strong>
                    <strong v-else>all</strong>
                    <strong>{{ job.type }}</strong>
                    <strong v-if="job.src">source</strong>
                    <span v-if="job.src && job.dst">
                      and
                    </span>
                    <strong v-if="job.dst">destination</strong>
                    packets/session
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    Found
                    <strong>{{ job.matchedSessions | commaString }}</strong> of
                    <strong>{{ job.searchedSessions | commaString }}</strong>
                    searched sessions out of
                    <strong>{{ job.totalSessions }}</strong>
                    total sessions to search
                  </div>
                </div>
                <div v-if="job.query.expression"
                  class="row">
                  <div class="col-12">
                    会话搜索表达式:
                    <strong>{{ job.query.expression }}</strong>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    会话时间范围从
                    <strong>{{ job.query.startTime | timezoneDateString(user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z') }}</strong>
                    到
                    <strong>{{ job.query.stopTime | timezoneDateString(user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z') }}</strong>
                  </div>
                </div>
                <div v-if="job.errors"
                  v-for="(error, index) in job.errors"
                  :key="index"
                  class="row text-danger">
                  <div class="col-12">
                    <span class="fa fa-exclamation-triangle">
                    </span>&nbsp;
                    {{ error.value }}
                  </div>
                </div>
              </td>
            </tr>
          </template> <!-- /packet search jobs -->
        </tbody>
      </table>

      <h4>
        <span class="fa fa-clock-o">
        </span>&nbsp;
        搜索记录
      </h4>

      <!-- hunt job history errors -->
      <div v-if="historyListError"
        class="alert alert-danger">
        {{ historyListError }}
      </div>
      <div v-if="historyListLoadingError"
        class="alert alert-danger">
        加载历史记录失败:
        {{ historyListLoadingError }}
      </div> <!-- /hunt job history errors -->

      <div v-if="!historyListLoadingError"
        class="row form-inline">
        <div class="col-12">
        <!-- job history paging -->
        <moloch-paging
          class="pull-right ml-2"
          :records-total="historyResults.recordsTotal"
          :records-filtered="historyResults.recordsFiltered"
          @changePaging="changePaging">
        </moloch-paging> <!-- /job history paging -->
          <!-- search packet search jobs -->
          <div class="input-group input-group-sm">
            <span class="input-group-prepend cursor-help">
              <span class="input-group-text">
                <span class="fa fa-search">
                </span>
              </span>
            </span>
            <input type="text"
              v-model="query.searchTerm"
              @input="debounceSearch"
              placeholder="packet搜索记录"
              class="form-control"
            />
            <span class="input-group-append">
              <button type="button"
                @click="clear"
                :disabled="!query.searchTerm"
                class="btn btn-outline-secondary btn-clear-input">
                <span class="fa fa-close">
                </span>
              </button>
            </span>
          </div> <!-- /search packet search jobs -->
        </div>
      </div>

      <table class="table table-sm table-striped">
        <thead>
          <tr>
            <th width="40px">&nbsp;</th>
            <th class="cursor-pointer"
              @click="columnClick('status')">
              状态
              <span v-show="query.sortField === 'status' && !query.desc" class="fa fa-sort-asc"></span>
              <span v-show="query.sortField === 'status' && query.desc" class="fa fa-sort-desc"></span>
              <span v-show="query.sortField !== 'status'" class="fa fa-sort"></span>
            </th>
            <th>
              匹配结果
            </th>
            <th class="cursor-pointer"
              @click="columnClick('name')">
              名称
              <span v-show="query.sortField === 'name' && !query.desc" class="fa fa-sort-asc"></span>
              <span v-show="query.sortField === 'name' && query.desc" class="fa fa-sort-desc"></span>
              <span v-show="query.sortField !== 'name'" class="fa fa-sort"></span>
            </th>
            <th class="cursor-pointer"
              @click="columnClick('userId')">
              用户
              <span v-show="query.sortField === 'userId' && !query.desc" class="fa fa-sort-asc"></span>
              <span v-show="query.sortField === 'userId' && query.desc" class="fa fa-sort-desc"></span>
              <span v-show="query.sortField !== 'userId'" class="fa fa-sort"></span>
            </th>
            <th>
              搜索内容
            </th>
            <th>
              通知
            </th>
            <th class="cursor-pointer"
              @click="columnClick('created')">
              是否创建
              <span v-show="query.sortField === 'created' && !query.desc" class="fa fa-sort-asc"></span>
              <span v-show="query.sortField === 'created' && query.desc" class="fa fa-sort-desc"></span>
              <span v-show="query.sortField !== 'created'" class="fa fa-sort"></span>
            </th>
            <th>
              ID
            </th>
            <th width="140px">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <!-- packet search jobs -->
          <template v-for="job in historyResults.data">
            <tr :key="`${job.id}-row`">
              <td>
                <toggle-btn
                  v-if="user.userId === job.userId || user.createEnabled"
                  :opened="job.expanded"
                  @toggle="toggleJobDetail(job)">
                </toggle-btn>
              </td>
              <td>
                <span v-if="job.status === 'running'"
                  v-b-tooltip.hover
                  title="运行中"
                  class="fa fa-spinner fa-spin fa-fw cursor-help">
                </span>
                <span v-else-if="job.status === 'paused'"
                  v-b-tooltip.hover
                  title="暂停"
                  class="fa fa-pause fa-fw cursor-help">
                </span>
                <span v-else-if="job.status === 'queued'"
                  v-b-tooltip.hover
                  title="排队中"
                  class="fa fa-clock-o fa-fw cursor-help">
                </span>
                <span v-else-if="job.status === 'finished'"
                  v-b-tooltip.hover
                  title="已完成"
                  class="fa fa-check fa-fw cursor-help">
                </span>
                &nbsp;
                <span class="badge badge-secondary cursor-help"
                  :id="`jobmatches${job.id}`">
                  {{ ((job.searchedSessions / job.totalSessions) * 100) | round(1) }}%
                </span>
                <b-tooltip :target="`jobmatches${job.id}`">
                  Found {{ job.matchedSessions | commaString }} out of {{ job.searchedSessions | commaString }} sessions searched.
                  <div v-if="job.status !== 'finished'">
                    剩余 {{ (job.totalSessions - job.searchedSessions) | commaString }} 个会话需要继续搜索.
                  </div>
                </b-tooltip>
                <span v-if="job.errors && job.errors.length"
                  class="badge badge-danger cursor-help">
                  <span class="fa fa-exclamation-triangle"
                    v-b-tooltip.hover
                    title="搜索期间出现错误， 打开任务查看详情">
                  </span>
                </span>
              </td>
              <td>
                {{ job.matchedSessions | commaString }}
              </td>
              <td>
                {{ job.name }}
              </td>
              <td>
                {{ job.userId }}
              </td>
              <td>
                <span v-if="user.userId === job.userId || user.createEnabled">
                  {{ job.search }} ({{ job.searchType }})
                </span>
              </td>
              <td>
                {{ job.notifier }}
              </td>
              <td>
                {{ job.created | timezoneDateString(user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z') }}
              </td>
              <td>
                {{ job.id }}
              </td>
              <td>
                <span v-if="user.userId === job.userId || user.createEnabled">
                  <button
                    @click="removeJob(job, 'historyResults')"
                    type="button"
                    v-b-tooltip.hover
                    title="从历史记录中删除此任务"
                    class="ml-1 pull-right btn btn-sm btn-danger">
                    <span class="fa fa-trash-o fa-fw">
                    </span>
                  </button>
                  <button type="button"
                    @click="openSessions(job)"
                    v-if="job.matchedSessions"
                    :id="`openresults${job.id}`"
                    class="ml-1 pull-right btn btn-sm btn-theme-primary">
                    <span class="fa fa-folder-open fa-fw">
                    </span>
                  </button>
                  <b-tooltip v-if="job.matchedSessions"
                    :target="`openresults${job.id}`">
                    在新的会话选项卡中打开结果
                    <br>
                    <strong>注意:</strong> 由于ES更新会话需要时间，因此需要等待一会才能展示您的结果
                  </b-tooltip>
                  <button type="button"
                    @click="rerunJob(job)"
                    v-b-tooltip.hover
                    title="使用当前时间范围和搜索条件重新运行此任务"
                    class="ml-1 pull-right btn btn-sm btn-theme-secondary">
                    <span class="fa fa-refresh fa-fw">
                    </span>
                  </button>
                </span>
              </td>
            </tr>
            <tr :key="`${job.id}-detail`"
              v-if="job.expanded">
              <td colspan="10">
                <div class="row">
                  <div class="col-12">
                    This hunt is
                    <strong>{{ job.status }}</strong>
                  </div>
                </div>
                <div v-if="job.lastUpdated"
                  class="row">
                  <div class="col-12">
                    流量猎手任务最近更新时间:
                    <strong>
                      {{ job.lastUpdated | timezoneDateString(user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z') }}
                    </strong>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    Examining
                    <strong v-if="job.size > 0">{{ job.size }}</strong>
                    <strong v-else>all</strong>
                    <strong>{{ job.type }}</strong>
                    <strong v-if="job.src">source</strong>
                    <span v-if="job.src && job.dst">
                      and
                    </span>
                    <strong v-if="job.dst">destination</strong>
                    packets/session
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    Found
                    <strong>{{ job.matchedSessions | commaString }}</strong> of
                    <strong>{{ job.searchedSessions | commaString }}</strong>
                    searched sessions out of
                    <strong>{{ job.totalSessions | commaString }}</strong>
                    total sessions to search
                  </div>
                </div>
                <div v-if="job.query.expression"
                  class="row">
                  <div class="col-12">
                    会话搜索表达式如下:
                    <strong>{{ job.query.expression }}</strong>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    会话时间范围从
                    <strong>{{ job.query.startTime | timezoneDateString(user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z') }}</strong>
                    到
                    <strong>{{ job.query.stopTime | timezoneDateString(user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z') }}</strong>
                  </div>
                </div>
                <div v-if="job.errors"
                  v-for="(error, index) in job.errors"
                  :key="index"
                  class="row text-danger">
                  <div class="col-12">
                    <span class="fa fa-exclamation-triangle">
                    </span>&nbsp;
                    {{ error.value }}
                  </div>
                </div>
              </td>
            </tr>
          </template> <!-- /packet search jobs -->
        </tbody>
      </table>

      <!-- no results -->
      <div v-if="!loading && !historyResults.data.length"
        class="ml-1 mr-1">
        <div class="mb-5 info-area horizontal-center">
          <div>
            <span class="fa fa-3x text-muted-more fa-folder-open">
            </span>&nbsp;
            <span v-if="!query.searchTerm">
              历史记录中目前没有数据包搜索任务
              <span v-if="!results.length">
                <br>
                单击上面的“创建Packet搜索任务”按钮，然后填写表单以创建一个
              </span>
            </span>
            <span v-else>
              没有任何Packet搜索任务符合您的查询
            </span>
          </div>
        </div>
      </div> <!-- /no results -->

    </div> <!-- /packet search jobs content -->

  </div>

</template>

<script>
import SessionsService from '../sessions/SessionsService';
import ToggleBtn from '../utils/ToggleBtn';
import MolochSearch from '../search/Search';
import MolochLoading from '../utils/Loading';
import MolochNoResults from '../utils/NoResults';
import MolochPaging from '../utils/Pagination';
import FocusInput from '../utils/FocusInput';

let timeout;
let interval;
let respondedAt;

export default {
  name: 'PacketSearch',
  components: {
    ToggleBtn,
    MolochSearch,
    MolochLoading,
    MolochNoResults,
    MolochPaging
  },
  directives: { FocusInput },
  data: function () {
    return {
      queuedListError: '',
      queuedListLoadingError: '',
      historyListError: '',
      historyListLoadingError: '',
      loading: true,
      results: [], // running/queued/paused hunt jobs
      historyResults: { // finished hunt jobs
        data: [],
        recordsTotal: 0,
        recordsFiltered: 0
      },
      sessions: {}, // sessions a new job applies to
      // new job search form
      createFormError: '',
      createFormOpened: false,
      // new job search default values
      jobName: '',
      jobSize: 50,
      jobSearch: '',
      jobSearchType: 'ascii',
      jobSrc: true,
      jobDst: true,
      jobType: 'raw',
      jobNotifier: undefined,
      // notifiers
      notifiers: undefined,
      // hunt limits
      huntWarn: this.$constants.MOLOCH_HUNTWARN,
      huntLimit: this.$constants.MOLOCH_HUNTLIMIT
    };
  },
  computed: {
    query: function () {
      return { // packet search job history search query
        sortField: 'created',
        desc: true,
        searchTerm: '',
        start: 0, // first item index
        length: this.$route.query.length || 50
      };
    },
    sessionsQuery: function () {
      return { // sessions query defaults
        length: this.$route.query.length || 50, // page length
        start: 0, // first item index
        facets: 1,
        date: this.$store.state.timeRange,
        startTime: this.$store.state.time.startTime,
        stopTime: this.$store.state.time.stopTime,
        bounding: this.$route.query.bounding || 'last',
        interval: this.$route.query.interval || 'auto',
        expression: this.$store.state.expression || undefined,
        view: this.$route.query.view || undefined
      };
    },
    user: function () {
      return this.$store.state.user;
    }
  },
  mounted: function () {
    setTimeout(() => {
      // wait for computed queries
      this.loadData();
      this.loadSessions();
      this.loadNotifiers();
    });

    // interval to load jobs every 5 seconds
    interval = setInterval(() => {
      if (respondedAt && Date.now() - respondedAt >= 5000) {
        this.loadData();
      }
    }, 500);
  },
  methods: {
    cancelCreateForm: function () {
      this.jobName = '';
      this.jobSearch = '';
      this.createFormError = '';
      this.createFormOpened = false;
    },
    createJob: function () {
      this.createFormError = '';

      if (!this.sessions.recordsFiltered) {
        this.createFormError = '流量猎手没有适用的会话，请先尝试搜索会话';
        return;
      }
      if (this.sessions.recordsFiltered > this.huntLimit) {
        this.createFormError = `流量猎手不能在如此多的会话中进行搜索，会导致严重的性能问题，请把会话数降低到${this.huntLimit}以下`;
        return;
      }
      if (!this.jobName) {
        this.createFormError = '缺少任务名称';
        return;
      }
      if (!this.jobSearch) {
        this.createFormError = '缺少任务搜索内容';
        return;
      }
      if (!this.jobSrc && !this.jobDst) {
        this.createFormError = 'Packet搜索任务的搜索对象必须是"客户段报文"，"服务端报文","双向报文"三种之一';
        return;
      }

      let newJob = {
        name: this.jobName,
        size: this.jobSize,
        search: this.jobSearch,
        searchType: this.jobSearchType,
        type: this.jobType,
        src: this.jobSrc,
        dst: this.jobDst,
        totalSessions: this.sessions.recordsFiltered,
        query: this.sessionsQuery,
        notifier: this.jobNotifier
      };

      this.axios.post('hunt', { hunt: newJob })
        .then((response) => {
          this.createFormOpened = false;
          this.jobName = '';
          this.jobSearch = '';
          this.createFormError = '';
          this.jobNotifier = undefined;
          this.loadData();
        }, (error) => {
          this.createFormError = error.text || error;
        });
    },
    removeJob: function (job, arrayName) {
      this.setErrorForList(arrayName, '');
      this.axios.delete(`hunt/${job.id}`)
        .then((response) => {
          let array = this.results;
          if (arrayName === 'historyResults') {
            array = this.historyResults.data;
          }
          for (let i = 0, len = array.length; i < len; ++i) {
            if (array[i].id === job.id) {
              array.splice(i, 1);
              return;
            }
          }
        }, (error) => {
          this.setErrorForList(arrayName, error.text || error);
        });
    },
    pauseJob: function (job) {
      this.setErrorForList('results', '');
      this.axios.put(`hunt/${job.id}/pause`)
        .then((response) => {
          this.$set(job, 'status', 'paused');
        }, (error) => {
          this.setErrorForList('results', error.text || error);
        });
    },
    playJob: function (job) {
      this.setErrorForList('results', '');
      this.axios.put(`hunt/${job.id}/play`)
        .then((response) => {
          this.$set(job, 'status', 'queued');
        }, (error) => {
          this.setErrorForList('results', error.text || error);
        });
    },
    openSessions: function (job) {
      let url = `sessions?expression=huntId == ${job.id}&stopTime=${job.query.stopTime}&startTime=${job.query.startTime}`;
      window.open(url, '_blank');
    },
    setJobSearchType: function (val) {
      this.jobSearchType = val;
    },
    setJobType: function (val) {
      this.jobType = val;
    },
    toggleJobDetail: function (job) {
      this.$set(job, 'expanded', !job.expanded);
    },
    debounceSearch: function () {
      if (timeout) { clearTimeout(timeout); }
      timeout = setTimeout(() => {
        this.loadData();
      }, 400);
    },
    clear () {
      this.query.searchTerm = undefined;
      this.loadData();
    },
    columnClick: function (name) {
      if (name === this.query.sortField) {
        // same sort field, so toggle order direction
        this.query.desc = !this.query.desc;
      } else { // new sort field, so set default order (desc)
        this.query.sortField = name;
        this.query.desc = true;
      }

      this.loadData();
    },
    changePaging: function (args) {
      this.query.start = args.start;
      this.query.length = args.length;
      this.loadData();
    },
    rerunJob: function (job) {
      this.jobSrc = job.src;
      this.jobDst = job.dst;
      this.jobSize = job.size;
      this.jobType = job.type;
      this.jobName = job.name;
      this.jobSearch = job.search;
      this.jobNotifier = job.notifier;
      this.jobSearchType = job.searchType;
      this.createFormOpened = true;
    },
    /* helper functions ---------------------------------------------------- */
    setErrorForList: function (arrayName, errorText) {
      let errorArea = 'queuedListError';
      if (arrayName === 'historyResults') {
        errorArea = 'historyListError';
      }
      this[errorArea] = errorText;
    },
    loadData: function () {
      respondedAt = undefined;

      let expanded = [];
      if (this.results && this.results.length) {
        // save the expanded ones
        for (let result of this.results) {
          if (result.expanded) {
            expanded.push(result.id);
          }
        }
      }
      if (this.historyResults.data && this.historyResults.data.length) {
        // save the expanded ones
        for (let result of this.historyResults.data) {
          if (result.expanded) {
            expanded.push(result.id);
          }
        }
      }

      // get the hunt history
      let historyReq = this.axios.get('hunt/list', { params: { ...this.query, history: true } });
      historyReq.then((response) => {
        this.historyListLoadingError = '';

        if (expanded.length) {
          // make sure expanded ones are still expanded
          for (let result of response.data.data) {
            if (expanded.indexOf(result.id) > -1) {
              result.expanded = true;
            }
          }
        }

        this.historyResults = response.data;
      }, (error) => {
        this.historyListLoadingError = error.text || error;
      });

      // get the running, queued, paused hunts
      let queuedQuery = JSON.parse(JSON.stringify(this.query));
      queuedQuery.desc = false;
      queuedQuery.length = undefined;
      queuedQuery.start = 0;
      let queueReq = this.axios.get('hunt/list', { params: queuedQuery });
      queueReq.then((response) => {
        this.queuedListLoadingError = '';

        if (expanded.length) {
          // make sure expanded ones are still expanded
          for (let result of response.data.data) {
            if (expanded.indexOf(result.id) > -1) {
              result.expanded = true;
            }
          }
        }

        this.results = response.data.data;
      }, (error) => {
        this.queuedListLoadingError = error.text || error;
      });

      // stop loading when both requests are done
      Promise.all([historyReq, queueReq])
        .then((values) => {
          respondedAt = Date.now();
          this.loading = false;
        })
        .catch(() => {
          respondedAt = undefined;
        });
    },
    loadSessions: function () {
      SessionsService.get(this.sessionsQuery)
        .then((response) => {
          this.sessions = response.data;
        })
        .catch((error) => {
          this.sessions = undefined;
        });
    },
    /* retrieves the notifiers that have been configured */
    loadNotifiers: function () {
      this.$http.get('notifiers')
        .then((response) => {
          this.notifiers = response.data;
        });
    }
  },
  beforeDestroy: function () {
    if (interval) { clearInterval(interval); }
  }
};
</script>

<style scoped>
/* packet search page, navbar, and content styles */
.packet-search-page {
  margin-top: 36px;
}

.packet-search-content {
  margin-top: 100px;
}

.info-area {
  font-size: var(--px-xxlg);
}

form.hunt-create-navbar {
  z-index: 4;
  position: fixed;
  top: 110px;
  left: 0;
  right: 0;
  height: 40px;
  background-color: var(--color-quaternary-lightest);

  -webkit-box-shadow: 0 0 16px -2px black;
     -moz-box-shadow: 0 0 16px -2px black;
          box-shadow: 0 0 16px -2px black;
}
</style>
