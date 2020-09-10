import { getConfig } from '../../utilities/config-helper';
import { config, S3 } from 'aws-sdk';

if (process.env.HTTP_PROXY) {
    // Currently have no TS typings for proxy-agent, so have to use plain require().
    const proxy = require('proxy-agent');

    config.update({
        httpOptions: { agent: proxy(process.env.HTTP_PROXY) },
    });
}

export namespace AWS {
    const config = getConfig().S3.CONFIG;
    let s3 = new S3(config);

    export function getS3() {
        return s3;
    }
}
