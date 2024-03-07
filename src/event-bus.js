import Vue from 'vue';
export const EventBus = new Vue();

export const loaded = {
  patches: false,
  storage: false,
  ftp_cli: false
};

console.log(`EVENT-BUS.js`);

EventBus.$on(`event_loader_start`,  () => {
  console.log(`EVENT_LOADER_START`);
});
EventBus.$on(`event_loader_stop`,  (val) => {
  if(val) { loaded[val] = true; }
  console.log(`event_loader_stop`, val, loaded);
});