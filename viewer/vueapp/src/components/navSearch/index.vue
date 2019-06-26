<template>
  <div class="search_model">
    <div style="margin: 0.25rem !important;">
      <div style="position: relative;display: flex;flex-wrap: wrap;width: 100%;">
        <div style="margin-right: -1px; display: flex;">
            <span style="width:36px;height: calc(1.8125rem + 2px);padding: 0.25rem 0.5rem;
            font-size: 0.875rem;line-height: 1.5;border-radius: 0.2rem;border: 1px solid #ccc;">
              <span v-if="!shiftKeyHold"
                    class="fa fa-search fa-fw">
              </span>
              <span v-else
                    class="query-shortcut">
                Q
              </span>
            </span>
        </div>
        <input type="text"
               style="height: calc(1.8125rem + 2px);padding: 0.25rem 0.5rem;width: calc(100% - 75px);border: 1px solid #ccc;
            font-size: 0.875rem;line-height: 1.5;"
               v-model="query.filter"
               v-focus-input="focusInput"
               @blur="onOffFocus"
               @input="searchForUsers"
               :placeholder=placeholder />
        <span style="display: flex">
            <button type="button"
                    @click="clear"
                    :disabled="!query.filter"
                    style="height: calc(1.8125rem + 2px);padding: 0.25rem 0.5rem;font-size: 0.875rem;margin-left: 1px;
              line-height: 1.5;border-radius: 0.2rem;position: relative;z-index: 2;">
              <span class="fa fa-close">
              </span>
            </button>
          </span>
      </div>
    </div>
  </div>
</template>

<script>
import FocusInput from '../utils/FocusInput';

export default {
  name: 'MolochNavSearch',
  directives: { FocusInput },
  data () {
    return {};
  },
  props: {
    placeholder: {
      type: String
    },
    searchForUsers: {
      type: Function
    },
    query: {
      type: Object
    },
    clear: {
      type: Function
    }
  },
  computed: {
    shiftKeyHold: function () {
      return this.$store.state.shiftKeyHold;
    },
    focusInput: {
      get: function () {
        return this.$store.state.focusSearch;
      },
      set: function (newValue) {
        this.$store.commit('setFocusSearch', newValue);
      }
    }
  },
  methods: {
    onOffFocus: function () {
      this.focusInput = false;
    }
  }
};
</script>
