declare module 'worker-loader?filename=static/[hash].worker.js!*' {
    class WebpackWorker extends Worker {
        public constructor();
    }

    export default WebpackWorker;
}
