import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<{
    spec: any;
}>(import('swagger-ui-react'), { ssr: false });

const ApiDoc = () => <SwaggerUI url="swagger.json" />;

export default ApiDoc;
