module.exports = {
  apps: [
    {
      name: "arbispotter-fe",
      script: "/app/node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "cluster",
      instances: "2",
    },
  ],
};
