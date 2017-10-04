import toposort from '@rafa93br/toposort';

const mapToGraph = config => Object.keys(config).map(name => ({
  name,
  edges: config[name][1],
}));

const getPromiseFromPromiseOrFn = (fn) => {
  if (fn.then) return fn;
  return () => Promise.resolve(fn());
};

export default map => ({
  async start() {
    const system = {};
    const components = toposort(mapToGraph(map));
    const stopFunctions = {};

    for (const componentName of components) {
      const componentFactory = map[componentName][0];
      const component = componentFactory(system);
      const componentInstance = await getPromiseFromPromiseOrFn(component.start)();
      system[componentName] = componentInstance;
      stopFunctions[componentName] = component.stop;
    }
    this.system = system;
    this.stopFunctions = stopFunctions;
    this.orderToStop = [...components].reverse();
    return system;
  },
  async stop() {
    for (const component of this.orderToStop) {
      const stopFn = this.stopFunctions[component];
      const stopPromise = getPromiseFromPromiseOrFn(stopFn);
      await stopPromise();
    }
  },
});
