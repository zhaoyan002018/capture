import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    timeRange: 1,
    expression: undefined,
    time: {
      startTime: undefined,
      stopTime: undefined
    },
    showMaps: true,
    mapSrc: true,
    mapDst: true,
    xffGeo: false,
    graphType: undefined,
    seriesType: undefined,
    focusSearch: undefined,
    issueSearch: undefined,
    focusTimeRange: undefined,
    shiftKeyHold: false,
    displayKeyboardShortcutsHelp: undefined,
    user: undefined,
    responseTime: undefined,
    sessionsTableState: undefined,
    views: undefined,
    loadingData: false,
    menu: undefined,
    // 侧边栏菜单控制
    menuState: true,
    isOpened: false,
    // logo
    logo: 'logo',
    // query
    query: {},
    // userName
    username: undefined,
    file: ''
  },
  mutations: {
    setFile (state, value) {
      state.file = value;
    },
    setUserName (state, value) {
      state.username = value;
    },
    setQuery (state, value) {
      state.query = value;
    },
    setLogo (state, value) {
      state.logo = value;
    },
    setMenuState (state, value) {
      state.menuState = value;
    },
    setIsOpened (state, value) {
      state.isOpened = value;
    },
    setTimeRange (state, value) {
      state.timeRange = value.toString();
    },
    setTime (state, value) {
      if (value.startTime) {
        state.time.startTime = value.startTime.toString();
      }
      if (value.stopTime) {
        state.time.stopTime = value.stopTime.toString();
      }
    },
    setExpression (state, value) {
      state.expression = value;
    },
    addToExpression (state, value) {
      let newExpr = '';

      if (!state.expression) { state.expression = ''; }

      if (state.expression && state.expression !== '') {
        if (state.expression[state.expression.length - 1] !== ' ') {
          // if last char is not a space, add it
          newExpr += ' ';
        }
        newExpr += (value.op || '&&') + ' ';
      }

      newExpr += value.expression;

      state.expression += newExpr;
    },
    clearExpression (state) {
      state.expression = undefined;
    },
    toggleMaps (state, value) {
      state.showMaps = value;
    },
    toggleMapSrc (state, value) {
      state.mapSrc = value;
    },
    toggleMapDst (state, value) {
      state.mapDst = value;
    },
    toggleMapXffGeo (state, value) {
      state.xffGeo = value;
    },
    updateGraphType (state, value) {
      state.graphType = value;
    },
    updateSeriesType (state, value) {
      state.seriesType = value;
    },
    setFocusSearch (state, value) {
      state.focusSearch = value;
    },
    setIssueSearch (state, value) {
      state.issueSearch = value;
      if (value) {
        setTimeout(() => {
          state.issueSearch = false;
        });
      }
    },
    setFocusTimeRange (state, value) {
      state.focusTimeRange = value;
    },
    setShiftKeyHold (state, value) {
      state.shiftKeyHold = value;
    },
    setDisplayKeyboardShortcutsHelp (state, value) {
      state.displayKeyboardShortcutsHelp = value;
    },
    setUser (state, value) {
      state.user = value;
    },
    setUserSettings (state, value) {
      state.user.settings = value;
    },
    setResponseTime (state, value) {
      state.responseTime = value;
    },
    setSessionsTableState (state, value) {
      state.sessionsTableState = value;
    },
    setViews (state, value) {
      state.views = value;
    },
    setLoadingData (state, value) {
      state.loadingData = value;
    },
    setMenu (state, value) {
      state.menu = JSON.parse(JSON.stringify(value));
    }
  }
});

export default store;
