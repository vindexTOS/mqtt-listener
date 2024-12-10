import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ensureDatabase from './libs/db-connection/db-connection';
import { ValidationPipe } from '@nestjs/common';
 async function bootstrap() {

   await ensureDatabase()
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    preflightContinue: false,
    optionsSuccessStatus: 204,  
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,  
      exceptionFactory: (errors) => {
        console.log(errors)
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));


        return  {
          statusCode: 400,
          message: formattedErrors,
          error: 'Validation Failed',
        }
      },
    }),
  );
 


   await app.listen(3000);
  console.log('NestJS application is running on http://localhost:3000');
}
bootstrap();
