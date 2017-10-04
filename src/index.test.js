import systemMap from './';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('systemMap', () => {
  jest.setTimeout(10000);
  test.only('builds a system from components, starts it and stops', async () => {
    const configCpStopFn = jest.fn();
    const apolloCpStopFn = jest.fn();
    const anotherCpStopFn = jest.fn();

    const configCp = () => ({
      async start() {
        await sleep(100);
        return {
          env: 'prod',
        };
      },
      stop() {
        configCpStopFn();
      },
    });

    const apolloCp = ({ config }) => ({
      async start() {
        await sleep(100);
        return `something based on ${config.env}`;
      },
      async stop() {
        await sleep(100);
        apolloCpStopFn();
      },
    });

    const anotherCp = ({ apollo, config }) => ({
      start() {
        return `apollo is ${apollo} and config is ${config.env}`;
      },
      stop() {
        anotherCpStopFn();
      },
    });


    const map = {
      anotherCp: [anotherCp, ['apollo', 'config']],
      apollo: [apolloCp, ['config']],
      config: [configCp, []],
    };

    const systemControl = await systemMap(map);
    const system = await systemControl.start();
    expect(system).toEqual({
      config: {
        env: 'prod',
      },
      apollo: 'something based on prod',
      anotherCp: 'apollo is something based on prod and config is prod',
    });

    await systemControl.stop();
    expect(configCpStopFn.mock.calls.length).toBe(1);
    expect(apolloCpStopFn.mock.calls.length).toBe(1);
    expect(anotherCpStopFn.mock.calls.length).toBe(1);
  });
});
