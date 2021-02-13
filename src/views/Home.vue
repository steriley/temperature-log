<template>
  <div class="home">
    <Graph v-bind="{ data }" />
  </div>
</template>

<script>
import Graph from '@/components/Graph.vue';

export default {
  data: () => ({
    data: null,
    room: 'boxroom',
  }),
  components: {
    Graph,
  },
  async mounted() {
    const json = await fetch(`./${this.room}.json`).then((data) => data.json());

    this.data = json;
  },
};
</script>
