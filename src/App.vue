<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
.flex {
  display: flex;
}
.column {
  flex-direction: column
}
.space-between {
  justify-content: space-between;
}
.space-around {
  justify-content: space-around
}
.center{
  justify-content: center;
}
.wrap {
  flex-wrap: wrap
}
.flex-start {
  justify-content: flex-start;
}
.el-card__header{
    padding: 8px 20px;
}
.el-form-item--mini.el-form-item {
    margin-bottom: 10px;
}
.el-table--medium td{
    padding: 5px 0;
}
.el-input-group__prepend {
    padding: 0
}
</style>
