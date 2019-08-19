test('Test the loaders reset', () => {
    const config = require('../webpack.config.js');

    expect(config.length).toBe(2);
    expect(config[0].module.rules[1].oneOf.length).toBe(6);
    expect(config[1].module.rules[1].oneOf.length).toBe(3);
});
