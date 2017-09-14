const
    {promisify, resolve} = require("./promises"),
    Pipeline = require("./pipeline"),
    Container = require("./container"),
    app = new Container();

export {
    promisify as promise,
    resolve,
    Pipeline,
    Container,
    app
};