# Kata Pokemon API

This codebase boilerplate is extracted from Daniel’s other project, for single purpose which is to complete kata.ai assignment. A lot of feature has been removed to simplify it. This API support serverless framework and koa http server as main interface. I’ve also include the bot.yaml for deploying flow of bot.

> You can try the bot with username: @daniel_pokemon_info_bot

There’s todo feature i can afford to develop due to time constraint:

- Message in-out bond
- Pokemon cache data PokeAPI
- Log image generation task
- Top 3 pokemon for each categories

## Features

- Register new user - The feature will log the user name to database, including conversation initiation time.
- Find pokemon - This feature will ask you for pokemon name and give you detail information about it like: type, statistic, weight, height and image.

![Image.jpeg](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/B56BD936-F4A8-4A2F-8154-32A5AEE68562_2/dXdOI2qWyK05tw1uP924YXBsOyWJHJaprmnCTszxACYz/Image.jpeg) ![WhatsApp Image 2025-10-29 at 06.13.27.jpeg](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/1E5B84AD-9B24-43BE-8765-1DA682AA0B26_2/LRHPOLCoaWARYJBNjLOjUxqo4XWHQXKiVH1dq9Vxzdoz/WhatsApp%20Image%202025-10-29%20at%2006.13.27.jpeg)

- Mix API - This feature require to name two pokemon to combine it into one, then you’ll receive combined pokemon of both as a picture (Have fun with this feature).

![Image.jpeg](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/2728D611-ADBD-466C-824B-D4F390AC6211_2/YklHXvUdsC1kJy8qQicLU9nQMgDIlLeD2U2xYqjLgpoz/Image.jpeg)

## Configuration

> This API require three configuration which is postgresql for storing users name and it’s required, aws s3 storage for storing the image generated from `mix` operation, and openrouter is used to call google gemini image generation.

> Though openrouter and aws s3 storage only required when you want to enable mix operation. You actually don’t need to create these two configuration because i’ve prepared the variable in document i submit, but don’t worry i also limit the configuration to prevent exposed to public and getting abused.

> Duplicate the .env.template file with name .env and put all the configuration here.

> Basic configuration for port and timeout can adjust based your requirements. But atleast set 16000 for timeout if you want to use combine pokemon api.

#### Acquire Configuration

- PostgreSQL

The easiest way is using free serverless database such as neondb.

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/19DF6621-6F01-4962-8D34-B144DCAC6847_2/9rmG4o9yx6dH1HNuX9yzx9018kykvBfiHUvLdXuIjPIz/Image.png)

After you create the project, retrieve the configuration using connect button.

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/16A8F1CD-7D17-4E47-B017-E91FF3840853_2/aFBdZ1rVoVfrScOzEYyQqd69pMMtRu9vRKIZrzxlfV8z/Image.png)

You can also create the database with name something such as `kata` , `pokemon`  in the same page. We'll use this database to store our data later in application.

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/FA36A7B7-DCFF-478A-A817-3377F9BA12BC_2/5ShNvSX1Opb6tlwpCJVgdoXJb7bAxTy9fovTP9RAH5Iz/Image.png)

Put all the value from connection string to .env. `DATABASE_URL` config is used to push the prisma schema, meanwhile postgres configuration below it, will be used for service to access the database.

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/5AB968C9-60F2-4E81-AA2F-2AA3A0F328EE_2/h4GAB1MZjwtaWPqkqZ6mHjdZKFxp8BesPmtO5ToRJw8z/Image.png)

- AWS S3

You required to have aws account first.

Then generate users with full permission of aws s3 service, also you need to create bucket for storing images, such as this:

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/D530B633-2769-44EB-A4AD-4A1B679BAA3F_2/yNW2gzs2zgDqTja0ttbfh4bVmOr0dou0hEyd2VYYsNsz/Image.png)

- OpenRouter

You need to register to openrouter, then go to credits page

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/26807844-0414-4230-BFB0-25839DE3671A_2/iDcHfuiXPRe6hE6k3nm4shajlcVOndRZBdbBMjjqjxIz/Image.png)

You need to top up some of the credits to be used.

After top up some credits, you need to generate api key, in the left side `API Keys`

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/53F536B4-345D-4995-9055-6901917711BB_2/yEijgybOoxbHEdwM1UxWSYBGFyqxykolAxT6YS8fz5oz/Image.png)

then put it to config .env file

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/40039C5A-7FB7-4FCE-8BFF-5A4F0CF67CE8_2/Mj0sxDIGAwu5RlKFDTQVgBqVhULxMXqT9XxFMYDLBK4z/Image.png)

## Setup

> Make sure you already have the configuration variable ready.

    - Clone the source - `https://github.com/ReiiSky/KataPokemonAPI `
    - Install the module - `npm install`

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/0F389858-0C46-46FE-860B-8232162C3749_2/8UMQRkIANVhimAr3JMqyM4F2jvQwDZLvSrChLxwgus8z/Image.png)

    - Push the database schema `npx prisma migrate deploy` or `prisma migrate deploy`  

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/F6B8BAA6-9443-4924-9BBF-9428A6431D2F_2/zUxJeWRxpOiGUtUNiVYFR1EQZMdfiYW1Wkgbhiy6FoEz/Image.png)

    - Generate prisma types - `npx prisma generate` or `prisma generate`

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/DB0B685E-AA33-4C0C-A75A-790971D21AF6_2/iMtDbCHadn3QXcFfzRCLbkccBtzpEhTASXDYB7Pe7gkz/Image.png)

## Running Script

- Accessing API Docs, then open the browser - `npm run watch:docs:rest` 

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/CF90262D-C5F7-4E9B-95E8-B112D0A83961_2/nny7NNcO6x8uIEZhnVZWUTU4kRc8nlMyohByqCntPGwz/Image.png)

- Serverless offline - `serverless offline` 

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/47132124-B523-4FFA-B1DE-1577B3F08B31_2/xt9k3AwkWNJykCF9upj8izconxGdhvRjSIE4zmPqfCsz/Image.png)

- Run dev server - `npm run dev`

![Image.png](https://resv2.craft.do/user/full/efbd129d-cd95-4fee-c221-d5812178c5ea/doc/DCF651A3-C43D-46A9-9943-E6176C41D95B/ACC5D90A-8448-47FB-A4F9-5E1D43B81AEB_2/pHAwyCiZI1Isp4SnFc6bSbl19KNAK52hztDNH6apxgMz/Image.png)