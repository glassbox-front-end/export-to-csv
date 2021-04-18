module.exports = function (config) {
    config.set({
        basePath: '',
        exclude: ['node_modules', '*.d.ts'],
        files: ['src/*'],
        preprocessors: {
            '**/*.ts': 'karma-typescript'
        },
        mime: { 'text/x-typescript': ['ts','tsx'] },
        browsers: ['Chrome'],
        frameworks: ['jasmine', 'karma-typescript'],
        reporters: ['karma-typescript', 'progress'],
        singleRun: false
    });
}