import {  v2 } from 'cloudinary';
//import {config as dotenvConfig} from 'dotenv'
import { config as envConfig } from 'dotenv';


envConfig({
    path: '.env',
  });

export const CloudinaryConfig = {
    provide: 'CLOUDINARY',
    useFactory: () =>{
        return v2.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key: process.env.API_KEY  ,
            api_secret: process.env.API_SECRET
        })
    }

}
